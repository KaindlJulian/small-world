import os
import time
import cv2
import requests
import pandas as pd
from tqdm import tqdm

from download_images import download_card_image
from process_images import crop_image, downscale_image
from upload_images import upload_file

CARD_INFO = "https://db.ygoprodeck.com/api/v7/cardinfo.php"
CSV_PATH = "../resources/m.csv"

RAW_FOLDER = "../resources/raw_images"
PROCESSED_FOLDER = "../resources/processed_images"
CROPPED_FOLDER = "../resources/cropped_images"

def main():
    print(f"Fetching fresh card list from ygoprodeck...")

    response = requests.get(CARD_INFO)
    response.raise_for_status()

    data = response.json()['data']
    df = pd.DataFrame(data)

    print(f"Found {len(df)} cards")

    # Filter main deck monsters
    df = df[df['type'].str.contains("Monster")]
    main_deck_frames = ['effect', 'normal', 'ritual', 'effect_pendulum', 'normal_pendulum', 'ritual_pendulum']
    df = df[df['frameType'].isin(main_deck_frames)]

    df = df[df['id'] != 10000040]   # edge case: 10000040,Holactie the Creator of Light,DIVINE,12,Creator God,-1,-1

    def clean_stat(val):
        try:
            return int(val)
        except (ValueError, TypeError):
            return -1
        
    df['atk'] = df['atk'].apply(clean_stat)
    df['def'] = df['def'].apply(clean_stat)
    df['level'] = df['level'].apply(clean_stat)
    df['type'] = df['race']

    print(f"Filtered down to {len(df)} monsters.")

    with open(CSV_PATH, "r", encoding="utf-8") as f:
        lines = f.readlines()

    existing_ids = set()
    for line in lines[1:]:
        parts = line.strip().split(',')
        if parts:
            existing_ids.add(int(parts[0]))

    new_monsters = df[~df['id'].isin(existing_ids)]

    if new_monsters.empty:
        print("Nothing to sync.")
        exit(1)

    print(f"Found {len(new_monsters)} new monsters.")

    with open(CSV_PATH, "a", encoding="utf-8") as f:
        target_cols = ['id', 'name', 'attribute', 'level', 'type', 'atk', 'def']
        csv_data = new_monsters[target_cols]
        csv_data.to_csv(f, header=False, index=False)

    print(f"Appended {len(new_monsters)} new monsters to {CSV_PATH}")
    print("\nStarting sync...")

    cards_to_process = new_monsters.to_dict(orient='records')

    with tqdm(total=len(cards_to_process), unit="card", desc="Syncing") as pbar:
        for card in cards_to_process:
            card_id = str(card['id'])
            raw_filename = os.path.join(RAW_FOLDER, f"{card_id}.jpg")
            
            if not os.path.exists(raw_filename):
                try:
                    download_card_image(card, raw_filename)
                    time.sleep(1 / 2)
                except Exception as e:
                    pbar.write(f"Download error {card['name']}: {e}")
                    pbar.update(1)
                    continue
            
            if os.path.exists(raw_filename):
                process_and_upload_card(card, raw_filename, pbar)
            else:
                pbar.write(f"Skipping {card['name']} (File missing)")

            pbar.update(1)

    print(f"Synced {len(cards_to_process)} cards successfully!")


def process_and_upload_card(card, raw_path, pbar):
    img = cv2.imread(raw_path)
    if img is None:
        return

    card_id = str(card['id'])
    
    cropped_file = f"{card_id}.webp"
    processed_file = f"{card_id}.webp"
    
    local_crop_path = os.path.join(CROPPED_FOLDER, cropped_file)
    local_proc_path = os.path.join(PROCESSED_FOLDER, processed_file)

    try:
        cropped_img = crop_image(img, card)
        small_cropped_img = downscale_image(cropped_img, max_size=252)
        cv2.imwrite(local_crop_path, small_cropped_img, [cv2.IMWRITE_WEBP_QUALITY, 50])
        cv2.imwrite(local_proc_path, img, [cv2.IMWRITE_WEBP_QUALITY, 80])
        upload_file(local_crop_path, 'cropped')
        upload_file(local_proc_path, 'full')

    except Exception as e:
        pbar.write(f"Error on {card_id}: {e}")

if __name__ == "__main__":
    main()
