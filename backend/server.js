require('dotenv').config();
const express = require('express');
const cors = require('cors');
const fs = require('fs');
const app = express();

app.use(cors({ origin: 'http://localhost:3000' }));
app.use(express.json());

const DATA_PATH = process.env.DATA_PATH || './data/leaderboard.json';

const getData = () => {
  try {
    return JSON.parse(fs.readFileSync(DATA_PATH));
  } catch (e) {
    if (fs.existsSync('./data/mock_leaderboard.json')) {
        return JSON.parse(fs.readFileSync('./data/mock_leaderboard.json'));
    }
    return [];
  }
};

app.get('/api/leaderboard', (req, res) => {
  const data = getData();
  res.json(data.sort((a,b) => b.overall_accuracy_score - a.overall_accuracy_score));
});

app.get('/api/creator/:id', (req, res) => {
  const creator = getData().find(c => c.creator_id === req.params.id);
  if (!creator) return res.status(404).json({ error: 'Not found' });
  res.json(creator);
});

app.get('/api/creator/:id/trend', (req, res) => {
  const creator = getData().find(c => c.creator_id === req.params.id);
  if (!creator) return res.status(404).json({ error: 'Not found' });
  
  const trend = {};
  creator.predictions.filter(p => p.accuracy_score !== null).forEach(p => {
    const year = p.video_date.substring(0,4);
    if (!trend[year]) trend[year] = { total:0, sum:0 };
    trend[year].total++; 
    trend[year].sum += p.accuracy_score;
  });
  
  res.json(Object.entries(trend).map(([year, d]) => ({
    year, 
    accuracy: Math.round(d.sum/d.total), 
    total_predictions: d.total
  })).sort((a,b) => a.year - b.year));
});

app.get('/api/creator/:id/confidence', (req, res) => {
  const creator = getData().find(c => c.creator_id === req.params.id);
  if (!creator) return res.status(404).json({ error: 'Not found' });

  const groups = { hard_claim:[], moderate:[], hedged:[] };
  creator.predictions.filter(p => p.accuracy_score).forEach(p => {
    if (groups[p.confidence_language]) {
      groups[p.confidence_language].push(p.accuracy_score);
    } else {
      groups[p.confidence_language] = [p.accuracy_score];
    }
  });

  res.json(Object.entries(groups).map(([type, scores]) => ({
    confidence_type: type,
    avg_accuracy: scores.length ? Math.round(scores.reduce((a,b)=>a+b)/scores.length) : null,
    count: scores.length
  })));
});

app.post('/api/analyze', async (req, res) => {
  const { url } = req.body;
  res.json({ status: 'processing', url });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`FinScope API running on :${PORT}`));
