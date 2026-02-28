import { useState, useEffect } from 'react';
import axios from 'axios';
import { API_BASE } from './config';
import { MOCK_DATA } from './mockData';
import Leaderboard from './components/Leaderboard';
import DeepDive from './components/DeepDive';
import AnalyzeBar from './components/AnalyzeBar';

export default function App() {
  const [creators, setCreators] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(API_BASE + '/api/leaderboard')
      .then(res => { setCreators(res.data.sort((a,b) => b.overall_accuracy_score - a.overall_accuracy_score)); setLoading(false); })
      .catch(() => { setCreators([...MOCK_DATA].sort((a,b) => b.overall_accuracy_score - a.overall_accuracy_score)); setLoading(false); });
  }, []);

  if (loading) return (
    <div style={{ display:'flex', justifyContent:'center', alignItems:'center',
      height:'100vh', fontFamily:'var(--font-mono)', color:'var(--green)' }}>
      LOADING FINVERDICT...
    </div>
  );

  return (
    <div style={{ minHeight:'100vh', background:'var(--bg)' }}>
      <AnalyzeBar />
      {selected
        ? <DeepDive creator={selected} onBack={() => setSelected(null)} />
        : <Leaderboard creators={creators} onSelect={setSelected} />
      }
    </div>
  );
}
