import os
import requests
import json
from dotenv import load_dotenv

load_dotenv()

SYMBOL_MAP = {
    "nifty 50": "^NSEI",
    "sensex": "^BSESN",
    "bank nifty": "^NSEBANK",
    "reliance": "RELIANCE.BSE",
    "hdfc bank": "HDFCBANK.BSE",
    "infosys": "INFY.BSE",
    "tcs": "TCS.BSE",
    "wipro": "WIPRO.BSE",
    "bitcoin": "btc-bitcoin",
    "ethereum": "eth-ethereum",
}

CACHE_FILE = "pipeline/data/cache.json"

def load_cache():
    if os.path.exists(CACHE_FILE):
        with open(CACHE_FILE, "r") as f:
            return json.load(f)
    return {}

def save_cache(cache_data):
    os.makedirs(os.path.dirname(CACHE_FILE), exist_ok=True)
    with open(CACHE_FILE, "w") as f:
        json.dump(cache_data, f, indent=2)

def get_stock_price(symbol, date_str):
    cache = load_cache()
    cache_key = f"stock_{symbol}_{date_str}"
    if cache_key in cache:
        return cache[cache_key]

    av_key = os.environ.get('ALPHA_VANTAGE_KEY')
    if not av_key:
        print("Error: ALPHA_VANTAGE_KEY is not set.")
        return None

    url = 'https://www.alphavantage.co/query'
    params = {
        'function': 'TIME_SERIES_DAILY',
        'symbol': symbol,
        'outputsize': 'full',
        'apikey': av_key
    }
    try:
        ts = requests.get(url, params=params).json().get('Time Series (Daily)', {})
        price = float(ts.get(date_str, {}).get('4. close', 0)) or None
        if price:
            cache[cache_key] = price
            save_cache(cache)
        return price
    except Exception as e:
        print(f"Failed to fetch stock {symbol} on {date_str}: {e}")
        return None

def get_crypto_price(coin_id, date_str):
    cache = load_cache()
    cache_key = f"crypto_{coin_id}_{date_str}"
    if cache_key in cache:
        return cache[cache_key]

    url = f'https://api.coinpaprika.com/v1/tickers/{coin_id}/historical'
    try:
        r = requests.get(url, params={'start': date_str, 'limit': 1, 'interval': '1d'}).json()
        price = r[0]['price'] if r else None
        if price:
            cache[cache_key] = price
            save_cache(cache)
        return price
    except Exception as e:
        print(f"Failed to fetch crypto {coin_id} on {date_str}: {e}")
        return None

def verify_predictions():
    if not os.path.exists("pipeline/data/extracted_predictions.json"):
        print("No extracted predictions found.")
        return

    with open("pipeline/data/extracted_predictions.json", "r") as f:
        data = json.load(f)

    for creator in data:
        for p in creator.get("extracted_predictions", []):
            asset_name = str(p.get("asset_name", "")).lower()
            asset_type = p.get("asset_type")
            pred_date = p.get("predicted_by_date")
            video_date = p.get("video_date")

            symbol = SYMBOL_MAP.get(asset_name)

            if symbol and video_date:
                if asset_type == "crypto":
                    p["price_on_prediction_date"] = get_crypto_price(symbol, video_date)
                else: # stock/index
                    p["price_on_prediction_date"] = get_stock_price(symbol, video_date)
            else:
                p["price_on_prediction_date"] = None
            
            if symbol and pred_date:
                if asset_type == "crypto":
                    p["actual_value"] = get_crypto_price(symbol, pred_date)
                else: # stock/index
                    p["actual_value"] = get_stock_price(symbol, pred_date)
            else:
                p["actual_value"] = None
            
            # Simple check if price was up/down
            if p["actual_value"] and p["price_on_prediction_date"]:
                p["actual_direction"] = "up" if p["actual_value"] > p["price_on_prediction_date"] else "down"
            else:
                p["actual_direction"] = None

    with open("pipeline/data/verified_predictions.json", "w") as f:
        json.dump(data, f, indent=2)
    print("Verified predictions saved to pipeline/data/verified_predictions.json")

if __name__ == "__main__":
    verify_predictions()
