import os
import boto3
from dotenv import load_dotenv
import tqdm

load_dotenv()

ACCOUNT_ID = os.environ['ACCOUNT_ID']
ACCESS_KEY_ID = os.environ['ACCESS_KEY_ID']
SECRET_ACCESS_KEY = os.environ['SECRET_ACCESS_KEY']

s3 = boto3.client(
  service_name="s3",
  endpoint_url=f"https://{ACCOUNT_ID}.r2.cloudflarestorage.com",
  aws_access_key_id=ACCESS_KEY_ID,
  aws_secret_access_key=SECRET_ACCESS_KEY,
  region_name="auto",
)

def main():
    processed_dir = '../resources/processed_images'
    cropped_dir = '../resources/cropped_images'

    for folder, target in [(processed_dir, 'full'), (cropped_dir, 'cropped')]:
        for filename in tqdm.tqdm(os.listdir(folder), desc=f"Uploading images from {folder}"):
            if filename.endswith('.webp'):
                file_path = os.path.join(folder, filename)
                upload_file(file_path, target)


def upload_file(file_path, target_folder):
    bucket_name = "small-world-cards"
    filename = os.path.basename(file_path)
    object_key = f"{target_folder}/{filename}"
    try:
        with open(file_path, "rb") as f:
            s3.upload_file(file_path, bucket_name, object_key, ExtraArgs={'ContentType': 'image/webp'})
    except Exception as e:
        print(f"Failed to upload {file_path}: {e}")


if __name__ == "__main__":
    main()

