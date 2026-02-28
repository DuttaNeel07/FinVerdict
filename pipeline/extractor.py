import os
import json
from groq import Groq
from dotenv import load_dotenv

load_dotenv()

EXTRACTION_PROMPT = '''
Extract ONLY specific, verifiable financial predictions from the provided transcript chunk.
Return a JSON array. Each item must have:
exact_quote, asset_name, asset_type (stock/crypto/index/macro),
predicted_direction (up/down), predicted_value (or null),
predicted_by_date (YYYY-MM-DD format if determinable, or null), confidence_language (hard_claim/moderate/hedged),
has_disclaimer (true/false)

Return ONLY valid JSON. No markdown. No explanation.
If no financial predictions are found, return an empty array [].
'''

def extract_predictions(transcript_chunk):
    client = Groq(api_key=os.environ.get('GROQ_API_KEY'))
    if not os.environ.get('GROQ_API_KEY'):
        print("Error: GROQ_API_KEY is not set.")
        return []

    try:
        response = client.chat.completions.create(
            model="llama3-70b-8192",
            messages=[{'role': 'user', 'content': EXTRACTION_PROMPT + "\n\nTranscript:\n" + transcript_chunk[:8000]}],
            temperature=0.1
        )
        
        raw = response.choices[0].message.content.strip()
        raw = raw.replace('```json', '').replace('```', '').strip()
        
        predictions = json.loads(raw)
        if isinstance(predictions, list):
            return predictions
        return []
    except Exception as e:
        print(f"Extraction failed: {e}")
        return []

def run_extraction():
    if not os.path.exists("pipeline/data/transcripts.json"):
        print("No transcripts found.")
        return

    with open("pipeline/data/transcripts.json", "r") as f:
        creators_data = json.load(f)

    all_predictions_data = []
    pred_counter = 1

    for creator in creators_data:
        creator_record = {
            "creator_id": creator["creator_id"],
            "creator_name": creator["creator_name"],
            "extracted_predictions": []
        }

        for video in creator["videos"]:
            print(f"Extracting for {creator['creator_name']} - {video['title']}...")
            chunk = video["transcript"]
            preds = extract_predictions(chunk)
            
            for p in preds:
                # Add metadata to each prediction
                p["prediction_id"] = f"{creator['creator_id']}_{pred_counter:03d}"
                p["video_url"] = video["url"]
                p["video_title"] = video["title"]
                p["video_date"] = video["date"]
                p["timestamp_in_video"] = "00:00" # Not precise without word-level timestamps, using stub
                p["status"] = "pending_verification"
                
                creator_record["extracted_predictions"].append(p)
                pred_counter += 1

        all_predictions_data.append(creator_record)

    os.makedirs("pipeline/data", exist_ok=True)
    with open("pipeline/data/extracted_predictions.json", "w") as f:
        json.dump(all_predictions_data, f, indent=2)
    print("Extracted predictions saved to pipeline/data/extracted_predictions.json")

if __name__ == "__main__":
    run_extraction()
