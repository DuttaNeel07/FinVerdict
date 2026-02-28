import { useState } from 'react';
import axios from 'axios';
import { API_BASE } from '../config';

const stages = [
  'Fetching transcript...',
  'Extracting predictions with AI...',
  'Verifying market data...',
  'Generating scores...',
  'Analysis complete ✓'
];

export default function AnalyzeBar() {
  const [url, setUrl] = useState('');
  const [status, setStatus] = useState(null);

  const handleAnalyze = () => {
    if (!url) return;
    let i = 0;
    setStatus(0);
    const interval = setInterval(() => {
      i++;
      if (i >= stages.length) { clearInterval(interval); return; }
      setStatus(i);
    }, 1400);
    axios.post(API_BASE + '/api/analyze', { url }).catch(() => {
      console.log('Backend not ready yet');
    });
  };

  return (
    <div style={{ padding:'16px 32px', borderBottom:'1px solid var(--border)',
      background:'var(--surface)', display:'flex', gap:'12px',
      alignItems:'center', flexWrap:'wrap' }}>
      <input
        placeholder='Paste any finance YouTube URL to analyse...'
        value={url}
        onChange={e => setUrl(e.target.value)}
        style={{ flex:1, background:'var(--bg)', border:'1px solid var(--border)',
          color:'var(--text)', padding:'10px 14px', fontFamily:'var(--font-mono)',
          fontSize:'13px', minWidth:'300px', outline:'none' }}
      />
      <button onClick={handleAnalyze}
        style={{ background:'var(--green)', color:'#000', border:'none',
          padding:'10px 20px', cursor:'pointer', fontFamily:'var(--font-mono)',
          fontSize:'13px', fontWeight:'bold' }}>
        ■ ANALYSE
      </button>
      {status !== null && (
        <span style={{ fontFamily:'var(--font-mono)', fontSize:'12px',
          color: status === stages.length - 1 ? 'var(--green)' : 'var(--yellow)' }}>
          {stages[status]}
        </span>
      )}
    </div>
  );
}