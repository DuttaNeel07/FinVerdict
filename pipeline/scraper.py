from youtube_transcript_api import YouTubeTranscriptApi
import json, re
import os

CREATORS = {
  "akshat_shrivastava": {
    "name": "Akshat Shrivastava",
    "videos": [
      {"url": "https://youtube.com/watch?v=1bMACbYhK7c", "title": "2023 Predictions", "date": "2022-12-27"}
    ]
  },
  "rachana_ranade": { "name": "CA Rachana Ranade", "videos": [
      {"url": "https://youtube.com/watch?v=y1EaX9N_oow", "title": "Top Stocks 2023", "date": "2023-12-29"}
  ]},
  "pranjal_kamra": { "name": "Pranjal Kamra", "videos": [] },
  "ankur_warikoo": { "name": "Ankur Warikoo", "videos": [] },
  "vivek_bajaj": { "name": "Vivek Bajaj", "videos": [] },
  "shankar_nath": { "name": "Shankar Nath", "videos": [] },
}

def get_transcript(url):
    match = re.search(r"v=([a-zA-Z0-9_-]{11})", url)
    if not match:
        print(f"Invalid URL: {url}")
        return None
        
    vid_id = match.group(1)
    try:
        t = YouTubeTranscriptApi.get_transcript(vid_id)
        return ' '.join([x['text'] for x in t])
    except Exception as e:
        print(f'Failed: {e}')
        return None

def fetch_transcripts(creators):
    all_data = []
    for creator_id, creator in creators.items():
        creator_data = {
            "creator_id": creator_id,
            "creator_name": creator["name"],
            "videos": []
        }
        for v in creator["videos"]:
            print(f"Fetching transcript for {creator['name']} - {v['title']}")
            text = get_transcript(v["url"])
            if text:
                v_copy = v.copy()
                v_copy["transcript"] = text
                creator_data["videos"].append(v_copy)
        all_data.append(creator_data)
    return all_data

if __name__ == "__main__":
    os.makedirs("pipeline/data", exist_ok=True)
    data = fetch_transcripts(CREATORS)
    with open("pipeline/data/transcripts.json", "w") as f:
        json.dump(data, f, indent=2)
    print("Transcripts saved to pipeline/data/transcripts.json")
