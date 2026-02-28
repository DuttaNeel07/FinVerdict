import os
import json
from groq import Groq
from dotenv import load_dotenv

load_dotenv()

SCORING_PROMPT = '''
Given a prediction and what actually happened, return JSON:
accuracy_score: 0-100 integer
verdict: one sentence plain English summary
failure_reason: brief reason if score < 50, else null

Return ONLY valid JSON.
Prediction: {quote}
Price at prediction date: {price_before}
Actual outcome: {actual_value} on {actual_date}
'''

def score_prediction(p):
    client = Groq(api_key=os.environ.get('GROQ_API_KEY'))
    if not os.environ.get('GROQ_API_KEY'):
        return {"accuracy_score": 0, "verdict": "API key missing.", "failure_reason": "No Groq output."}

    quote = p.get("exact_quote", "Unknown")
    price_before = p.get("price_on_prediction_date", "Unknown")
    actual_value = p.get("actual_value", "Unknown")
    actual_date = p.get("predicted_by_date", "Unknown")

    prompt = SCORING_PROMPT.format(
        quote=quote,
        price_before=price_before,
        actual_value=actual_value,
        actual_date=actual_date
    )

    try:
        response = client.chat.completions.create(
            model="llama3-70b-8192",
            messages=[{'role': 'user', 'content': prompt}],
            temperature=0.1
        )
        raw = response.choices[0].message.content.strip()
        raw = raw.replace('```json', '').replace('```', '').strip()
        
        return json.loads(raw)
    except Exception as e:
        print(f"Scoring failed for {p.get('prediction_id')}: {e}")
        return {"accuracy_score": 0, "verdict": "Scoring failed.", "failure_reason": str(e)}

def compute_category_scores(predictions):
    cat_totals = {"stocks": [0,0], "crypto": [0,0], "index": [0,0], "macro": [0,0]}
    
    for p in predictions:
        cat = p.get("asset_type", "macro").lower()
        if cat in cat_totals and "accuracy_score" in p and p["accuracy_score"] is not None:
            cat_totals[cat][0] += p["accuracy_score"]
            cat_totals[cat][1] += 1
            
    scores = {}
    for cat, (total_score, count) in cat_totals.items():
        if count > 0:
            scores[cat] = int(total_score / count)
        else:
            scores[cat] = 0
            
    return scores

def run_scoring():
    if not os.path.exists("pipeline/data/verified_predictions.json"):
        print("No verified predictions found.")
        return

    with open("pipeline/data/verified_predictions.json", "r") as f:
        data = json.load(f)

    leaderboard = []

    for creator in data:
        scored_preds = []
        for p in creator.get("extracted_predictions", []):
            print(f"Scoring prediction: {p.get('prediction_id')} - {p.get('asset_name')}")
            score_data = score_prediction(p)
            
            p.update(score_data)
            
            # Map asset_type to category for the schema
            cat_map = {"stock": "stocks"}
            p["category"] = cat_map.get(p.get("asset_type", "macro"), p.get("asset_type", "macro"))
            p["status"] = "verified"
            
            scored_preds.append(p)

        verified = [p for p in scored_preds if p.get("accuracy_score") is not None]
        overall_score = 0
        if len(verified) > 0:
            overall_score = sum(p["accuracy_score"] for p in verified) // len(verified)

        cat_scores = compute_category_scores(scored_preds)

        leaderboard.append({
            "creator_id": creator["creator_id"],
            "creator_name": creator["creator_name"],
            "overall_accuracy_score": overall_score,
            "total_predictions": len(scored_preds),
            "category_scores": cat_scores,
            "predictions": scored_preds
        })

    with open("leaderboard.json", "w") as f:
        json.dump(leaderboard, f, indent=2)
    print("Final leaderboard saved to leaderboard.json")

if __name__ == "__main__":
    run_scoring()
