import json
import pandas as pd
import requests

CARD_INFO = "https://db.ygoprodeck.com/api/v7/cardinfo.php"
JSON_PATH = "../resources/cardinfo_full.json" # https://www.ygoprodeck.com/api-guide/ , v7 ygoprodeck api json dump
CSV_PATH = "../resources/m.csv"

print(f"Fetching card list from ygoprodeck...")

response = requests.get(CARD_INFO)
response.raise_for_status()
data = response.json()['data']

with open(JSON_PATH, "w", encoding="utf-8") as f:
    json.dump({"data": data}, f, ensure_ascii=False, indent=4)

print(f"Saved API data to {JSON_PATH}")

df = pd.DataFrame(data)

print(f"Found {len(df)} cards")

# Filter main deck monsters
df = df[df['type'].str.contains("Monster")]
main_deck_frames = ['effect', 'normal', 'ritual', 'effect_pendulum', 'normal_pendulum', 'ritual_pendulum']
df = df[df['frameType'].isin(main_deck_frames)]

def clean_stat(val):
    try:
        return int(val)
    except (ValueError, TypeError):
        return -1
    
df['atk'] = df['atk'].apply(clean_stat)
df['def'] = df['def'].apply(clean_stat)
df['level'] = df['level'].apply(clean_stat)

df['type'] = df['race']
target_cols = ['id', 'name', 'attribute', 'level', 'type', 'atk', 'def']
df = df[target_cols]

print(f"Filtered down to {len(df)} monsters.")
df.to_csv(CSV_PATH, index=False)
print(f"Saved to {CSV_PATH}")
