export const MOCK_DATA = [
  {
    creator_id: "akshat_shrivastava",
    creator_name: "Akshat Shrivastava",
    overall_accuracy_score: 61,
    total_predictions: 34,
    category_scores: { stocks: 71, crypto: 43, macro: 60, index: 65 },
    predictions: [
      {
        prediction_id: "akshat_001",
        video_url: "https://youtube.com/watch?v=example",
        video_title: "My 2023 Market Predictions",
        video_date: "2023-01-15",
        timestamp_in_video: "04:32",
        exact_quote: "Nifty will touch 22,000 by December 2023",
        asset_name: "Nifty 50",
        asset_type: "index",
        predicted_direction: "up",
        predicted_value: 22000,
        predicted_by_date: "2023-12-31",
        confidence_language: "hard_claim",
        actual_value: 21200,
        actual_direction: "up",
        accuracy_score: 72,
        verdict: "Directionally correct, missed target by 3.8%",
        status: "verified",
        category: "index"
      }
    ]
  },
  {
    creator_id: "rachana_ranade",
    creator_name: "CA Rachana Ranade",
    overall_accuracy_score: 58,
    total_predictions: 22,
    category_scores: { stocks: 65, crypto: 38, macro: 55, index: 60 },
    predictions: [
      {
        prediction_id: "rachana_001",
        video_url: "https://youtube.com/watch?v=example2",
        video_title: "Stock Market Outlook 2023",
        video_date: "2023-02-10",
        timestamp_in_video: "02:15",
        exact_quote: "HDFC Bank will outperform the market in Q2",
        asset_name: "HDFC Bank",
        asset_type: "stock",
        predicted_direction: "up",
        predicted_value: null,
        predicted_by_date: "2023-06-30",
        confidence_language: "moderate",
        actual_value: null,
        actual_direction: "up",
        accuracy_score: 65,
        verdict: "Directionally correct, stock gained 8% in Q2",
        status: "verified",
        category: "stocks"
      }
    ]
  },
  {
    creator_id: "ankur_warikoo",
    creator_name: "Ankur Warikoo",
    overall_accuracy_score: 49,
    total_predictions: 18,
    category_scores: { stocks: 50, crypto: 40, macro: 52, index: 55 },
    predictions: [
      {
        prediction_id: "ankur_001",
        video_url: "https://youtube.com/watch?v=example3",
        video_title: "My Crypto Predictions 2023",
        video_date: "2023-03-05",
        timestamp_in_video: "06:45",
        exact_quote: "Bitcoin will cross 40,000 dollars by mid 2023",
        asset_name: "Bitcoin",
        asset_type: "crypto",
        predicted_direction: "up",
        predicted_value: 40000,
        predicted_by_date: "2023-06-30",
        confidence_language: "hard_claim",
        actual_value: 30000,
        actual_direction: "up",
        accuracy_score: 45,
        verdict: "Directionally correct but missed target by 25%",
        status: "verified",
        category: "crypto"
      }
    ]
  },
  {
    creator_id: "pranjal_kamra",
    creator_name: "Pranjal Kamra",
    overall_accuracy_score: 67,
    total_predictions: 28,
    category_scores: { stocks: 74, crypto: 48, macro: 65, index: 70 },
    predictions: [
      {
        prediction_id: "pranjal_001",
        video_url: "https://youtube.com/watch?v=example4",
        video_title: "Value Stocks to Watch 2023",
        video_date: "2023-01-20",
        timestamp_in_video: "08:10",
        exact_quote: "Reliance will be a strong buy at current levels",
        asset_name: "Reliance",
        asset_type: "stock",
        predicted_direction: "up",
        predicted_value: null,
        predicted_by_date: "2023-12-31",
        confidence_language: "hedged",
        actual_value: null,
        actual_direction: "up",
        accuracy_score: 70,
        verdict: "Correct — Reliance gained 12% over the period",
        status: "verified",
        category: "stocks"
      }
    ]
  },
  {
    creator_id: "vivek_bajaj",
    creator_name: "Vivek Bajaj",
    overall_accuracy_score: 55,
    total_predictions: 25,
    category_scores: { stocks: 60, crypto: 35, macro: 58, index: 62 },
    predictions: [
      {
        prediction_id: "vivek_001",
        video_url: "https://youtube.com/watch?v=example5",
        video_title: "Market Analysis 2023",
        video_date: "2023-04-01",
        timestamp_in_video: "03:22",
        exact_quote: "Sensex will reach 65,000 before year end",
        asset_name: "Sensex",
        asset_type: "index",
        predicted_direction: "up",
        predicted_value: 65000,
        predicted_by_date: "2023-12-31",
        confidence_language: "hard_claim",
        actual_value: 63000,
        actual_direction: "up",
        accuracy_score: 68,
        verdict: "Directionally correct, came within 3% of target",
        status: "verified",
        category: "index"
      }
    ]
  },
  {
    creator_id: "shankar_nath",
    creator_name: "Shankar Nath",
    overall_accuracy_score: 42,
    total_predictions: 15,
    category_scores: { stocks: 45, crypto: 38, macro: 40, index: 44 },
    predictions: [
      {
        prediction_id: "shankar_001",
        video_url: "https://youtube.com/watch?v=example6",
        video_title: "Crypto Market 2023 Predictions",
        video_date: "2023-02-28",
        timestamp_in_video: "05:10",
        exact_quote: "Ethereum will hit 3000 dollars by Q3 2023",
        asset_name: "Ethereum",
        asset_type: "crypto",
        predicted_direction: "up",
        predicted_value: 3000,
        predicted_by_date: "2023-09-30",
        confidence_language: "hard_claim",
        actual_value: 1650,
        actual_direction: "down",
        accuracy_score: 22,
        verdict: "Wrong direction and significantly missed target",
        status: "verified",
        category: "crypto"
      }
    ]
  }
];