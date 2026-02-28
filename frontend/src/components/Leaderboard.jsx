import { scoreColor } from '../config';

const CategoryBars = ({ scores }) => (
  <div style={{ display:'flex', flexDirection:'column', gap:'4px', minWidth:'120px' }}>
    {Object.entries(scores).map(([cat, val]) => (
      <div key={cat} style={{ display:'flex', alignItems:'center', gap:'6px' }}>
        <span style={{ color:'var(--muted)', fontSize:'10px', width:'30px', fontFamily:'var(--font-mono)' }}>
          {cat.substring(0,3).toUpperCase()}
        </span>
        <div style={{ flex:1, height:'3px', background:'#1c1c2e' }}>
          <div style={{ width:`${val}%`, height:'3px', background:scoreColor(val) }}/>
        </div>
        <span style={{ color:scoreColor(val), fontSize:'10px', fontFamily:'var(--font-mono)', width:'24px' }}>
          {val}
        </span>
      </div>
    ))}
  </div>
);

export default function Leaderboard({ creators, onSelect }) {
  const rankColor = (i) => i === 0 ? '#ffd60a' : i === 1 ? '#c0c0c0' : i === 2 ? '#cd7f32' : 'var(--muted)';

  return (
    <div style={{ padding:'32px' }}>
      <h1 style={{ fontFamily:'var(--font-mono)', color:'var(--green)', fontSize:'24px', marginBottom:'4px' }}>
        ■ FINVERDICT
      </h1>
      <p style={{ color:'var(--muted)', marginBottom:'32px', fontSize:'13px' }}>
        India's first data-backed finance influencer accountability platform
      </p>

      <table style={{ width:'100%', borderCollapse:'collapse' }}>
        <thead>
          <tr style={{ borderBottom:'1px solid var(--border)', color:'var(--muted)',
            fontSize:'11px', fontFamily:'var(--font-mono)' }}>
            <th style={{ padding:'8px', textAlign:'left' }}>#</th>
            <th style={{ padding:'8px', textAlign:'left' }}>CREATOR</th>
            <th style={{ padding:'8px', textAlign:'center' }}>ACCURACY</th>
            <th style={{ padding:'8px', textAlign:'center' }}>PREDICTIONS</th>
            <th style={{ padding:'8px', textAlign:'left' }}>CATEGORY BREAKDOWN</th>
            <th style={{ padding:'8px' }}></th>
          </tr>
        </thead>
        <tbody>
          {creators.map((c, i) => (
            <tr key={c.creator_id}
              style={{ borderBottom:'1px solid var(--border)', cursor:'pointer' }}
              onMouseEnter={e => e.currentTarget.style.background = '#0d0d14'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
              <td style={{ padding:'16px 8px', fontFamily:'var(--font-mono)',
                color:rankColor(i), fontSize:'20px', fontWeight:'bold' }}>
                {i + 1}
              </td>
              <td style={{ padding:'16px 8px' }}>
                <div style={{ fontWeight:'bold', fontSize:'15px' }}>{c.creator_name}</div>
              </td>
              <td style={{ padding:'16px 8px', textAlign:'center' }}>
                <span style={{ fontFamily:'var(--font-mono)', fontSize:'30px',
                  color:scoreColor(c.overall_accuracy_score) }}>
                  {c.overall_accuracy_score}
                </span>
                <span style={{ color:'var(--muted)', fontSize:'12px' }}>/100</span>
              </td>
              <td style={{ padding:'16px 8px', textAlign:'center',
                fontFamily:'var(--font-mono)', color:'var(--muted)', fontSize:'14px' }}>
                {c.total_predictions}
              </td>
              <td style={{ padding:'16px 8px' }}>
                <CategoryBars scores={c.category_scores} />
              </td>
              <td style={{ padding:'16px 8px' }}>
                <button onClick={() => onSelect(c)}
                  style={{ background:'transparent', border:'1px solid var(--green)',
                    color:'var(--green)', padding:'6px 14px', cursor:'pointer',
                    fontFamily:'var(--font-mono)', fontSize:'11px' }}>
                  DEEP DIVE →
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}