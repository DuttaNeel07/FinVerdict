import os

def main():
    print("=== Starting FinScope Data Pipeline ===")
    
    print("\\n[1/4] Running Scraper...")
    if os.system("python scraper.py") != 0:
        print("Error in Scraper.")
        return

    print("\\n[2/4] Running Extractor (Groq AI)...")
    if os.system("python extracter.py") != 0:
        print("Error in Extractor.")
        return
        
    print("\\n[3/4] Running Verifier (Market Data)...")
    if os.system("python verfier.py") != 0:
        print("Error in Verifier.")
        return
        
    print("\\n[4/4] Running Scorer (Groq AI)...")
    if os.system("python scorer.py") != 0:
        print("Error in Scorer.")
        return
        
    print("\\n=== Pipeline Complete ===")
    print("Check leaderboard.json for the final output.")

if __name__ == "__main__":
    main()
