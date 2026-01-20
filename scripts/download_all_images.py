import os
import time
import requests
from tqdm import tqdm

CARD_INFO = "https://db.ygoprodeck.com/api/v7/cardinfo.php"
RAW_FOLDER = "../resources/raw_images"
REQUEST_RATE = 2  # requests per second

if not os.path.exists(RAW_FOLDER):
    os.makedirs(RAW_FOLDER)

def main():
    all_cards = get_card_info()

    targets = [c for c in all_cards if is_main_deck_monster(c)]
    targets.sort(key=lambda x: x['id'])

    print(f"Found {len(targets)} monsters to process.")

    with tqdm(total=len(targets), unit="image", desc="Downloading") as pbar:
        for card in targets:
            card_id = str(card['id'])
            filename = os.path.join(RAW_FOLDER, f"{card_id}.jpg")
            
            # Skip if already downloaded
            if os.path.exists(filename):
                pbar.update(1)
                continue

            # Download the image
            try:
                if 'card_images' not in card or not card['card_images']:
                    pbar.write(f"Skipping {card['name']} (No image data)")
                    pbar.update(1)
                    continue

                img_url = card['card_images'][0]['image_url']

                for img in card['card_images']:
                    if str(img['id']) == card_id:
                        img_url = img['image_url']
                        break

                response = requests.get(img_url, stream=True)
                if response.status_code == 200:
                    with open(filename, 'wb') as f:
                        for chunk in response.iter_content(1024):
                            f.write(chunk)
                else:
                    pbar.write(f"API error {response.status_code} for {card['name']}")

                # we sent a request, wait to respect rate limit
                time.sleep(1 / REQUEST_RATE) 

            except Exception as e:
                pbar.write(f"Exception for {card['name']}: {e}")
        
            pbar.update(1)

    print("\nDownload complete!")


def get_card_info():
    print("Fetching card list from ygoprodeck...")
    try:
        response = requests.get(CARD_INFO)
        response.raise_for_status()
        return response.json()['data']
    except Exception as e:
        print(f"API Error: {e}")
        exit(1)


def is_main_deck_monster(card):
    """
    Filters for Main Deck Monsters only.
    Excludes Spells, Traps, and Extra Deck (Fusion, Synchro, XYZ, Link).
    """
    t = card.get('type', '')
    frames = card.get('frameType', '')
    
    is_monster = "Monster" in t

    main_deck_frames = ['effect', 'normal', 'ritual', 'effect_pendulum', 'normal_pendulum', 'ritual_pendulum']
    is_main_deck = frames in main_deck_frames
    
    return is_monster and is_main_deck


if __name__ == "__main__":
    main()