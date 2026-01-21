import os
import cv2
import tqdm
import json
 
cardinfo_json_path = '../resources/cardinfo_full.json'
raw_image_dir = '../resources/raw_images'
processed_dir = '../resources/processed_images'
cropped_dir = '../resources/cropped_images'

if not os.path.exists(raw_image_dir):
    print(f"No raw image directory '{raw_image_dir}'. Exiting script.")
    exit(1)

if not os.path.exists(processed_dir):
    os.makedirs(processed_dir)
if not os.path.exists(cropped_dir):
    os.makedirs(cropped_dir)

def main():
    with open(cardinfo_json_path, "r", encoding="utf-8") as f:
        cardinfo = f.read()
        data = json.loads(cardinfo)['data']

    targets = [c for c in data if is_main_deck_monster(c)]
    targets.sort(key=lambda x: x['id'])

    for card in tqdm.tqdm(targets, desc="Processing images"):
        card_id = int(card['id'])
        filename = f"{card_id}.jpg"
        img_path = os.path.join(raw_image_dir, filename)

        if not os.path.exists(img_path):
            print(f"Image {img_path} does not exist. Skipping.")
            continue

        img = cv2.imread(img_path)
        if img is None:
            print(f"Failed to read image {img_path}. Skipping.")
            continue

        # Create small cropped image
        cropped_img = crop_image(img, card)
        small_cropped_img = downscale_image(cropped_img, max_size=252)
        cropped_path = os.path.join(cropped_dir, filename.replace('.jpg', '.webp'))
        cv2.imwrite(cropped_path, small_cropped_img, [cv2.IMWRITE_WEBP_QUALITY, 50])

        # Convert full image to webp
        processed_path = os.path.join(processed_dir, filename.replace('.jpg', '.webp'))
        cv2.imwrite(processed_path, img, [cv2.IMWRITE_WEBP_QUALITY, 80])


def is_main_deck_monster(card):
    t = card.get('type', '')
    frames = card.get('frameType', '')
    is_monster = "Monster" in t
    main_deck_frames = ['effect', 'normal', 'ritual', 'effect_pendulum', 'normal_pendulum', 'ritual_pendulum']
    is_main_deck = frames in main_deck_frames
    return is_monster and is_main_deck


def crop_image(img, card):
    IMAGE_WIDTH = 813
    IMAGE_HEIGHT = 1185
    TARGET_WIDTH = 619
    TARGET_HEIGHT = 619
    TARGET_WIDTH_PEND = 706
    TARGET_HEIGHT_PEND = 520

    CROP_TOP = 216
    if 'pendulum' in card.get('frameType', '').lower():
        CROP_SIDE = (IMAGE_WIDTH - TARGET_WIDTH_PEND) // 2
        CROP_BOTTOM = IMAGE_HEIGHT - CROP_TOP - TARGET_HEIGHT_PEND
    else:
        CROP_SIDE = (IMAGE_WIDTH - TARGET_WIDTH) // 2
        CROP_BOTTOM = IMAGE_HEIGHT - CROP_TOP - TARGET_HEIGHT

    crop_img = img[CROP_TOP:IMAGE_HEIGHT - CROP_BOTTOM, CROP_SIDE:IMAGE_WIDTH - CROP_SIDE]
    return crop_img


def downscale_image(img, max_size=252):
    height, width = img.shape[:2]
    if max(height, width) <= max_size:
        return img
    scale = max_size / max(height, width)
    new_width = int(width * scale)
    new_height = int(height * scale)
    resized_img = cv2.resize(img, (new_width, new_height), interpolation=cv2.INTER_AREA)
    return resized_img


if __name__ == "__main__":
    main()
