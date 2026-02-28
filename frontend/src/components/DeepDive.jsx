import { useState } from 'react';
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer,
  RadarChart, Radar, PolarGrid, PolarAngleAxis,
  BarChart, Bar, Cell
} from 'recharts';
import { scoreColor } from '../config';

const MOCK_TREND = [
  { year: '2022', accuracy: 55 },
  { year: '2023', accuracy: 63 },
  { year: '2024', accuracy: 68 },
];

const MOCK_CONF = [
  { type: 'Hard Claim', accuracy: 48 },
  { type: 'Moderate', accuracy: 61 },
  { type: 'Hedged', accuracy: 72 },
];

export default function DeepDive({ creator, onBack }) {
  const [selected, setSelected] = useState(null);

  const radarData = Object.entries(creator.category_scores).map(([k, v]) => ({
    subject: k.toUpperCase(), value: v
  }));

  const confColor = {
    hard_claim: '#ff3b3b',
    moderate: '#ffd60a',
    hedged: '#00ff88'
  };

  return (
    <div style={{ padding:'32px' }}>

      {/* Back button */}
      <button onClick={onBack}
        style={{ background:'transparent', border:'none', color:'var(--muted)',
          cursor:'pointer', marginBottom:'24px', fontFamily:'var(--font-mono)',
          fontSize:'13px' }}>
        ← BACK TO LEADERBOARD
      </button>

      {/* Creator header */}
      <div style={{ display:'flex', alignItems:'baseline', gap:'16px', marginBottom:'32px' }}>
        <h2 style={{ fontFamily:'var(--font-mono)', fontSize:'22px', margin:0 }}>
          {creator.creator_name}
        </h2>
        <span style={{ fontFamily:'var(--font-mono)', fontSize:'48px',
          color:scoreColor(creator.overall_accuracy_score), lineHeight:1 }}>
          {creator.overall_accuracy_score}
        </span>
        <span style={{ color:'var(--muted)', fontSize:'13px' }}>overall accuracy</span>
        <span style={{ color:'var(--muted)', fontSize:'13px', marginLeft:'16px' }}>
          {creator.total_predictions} predictions tracked
        </span>
      </div>

      {/* 3 Charts */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr',
        gap:'24px', marginBottom:'40px' }}>

        {/* Chart 1: Accuracy over time */}
        <div style={{ background:'var(--surface)', padding:'20px',
          border:'1px solid var(--border)' }}>
          <p style={{ color:'var(--muted)', fontSize:'11px',
            fontFamily:'var(--font-mono)', marginBottom:'12px', margin:'0 0 12px 0' }}>
            ACCURACY OVER TIME
          </p>
          <ResponsiveContainer width='100%' height={160}>
            <LineChart data={MOCK_TREND}>
              <XAxis dataKey='year' stroke='#6b7280' tick={{ fontSize:10 }}/>
              <YAxis domain={[0,100]} stroke='#6b7280' tick={{ fontSize:10 }}/>
              <Tooltip contentStyle={{ background:'#12121a', border:'1px solid #1e1e2e',
                fontFamily:'var(--font-mono)', fontSize:'11px' }}/>
              <Line type='monotone' dataKey='accuracy' stroke='#00ff88'
                strokeWidth={2} dot={{ fill:'#00ff88' }}/>
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Chart 2: Category Radar */}
        <div style={{ background:'var(--surface)', padding:'20px',
          border:'1px solid var(--border)' }}>
          <p style={{ color:'var(--muted)', fontSize:'11px',
            fontFamily:'var(--font-mono)', margin:'0 0 12px 0' }}>
            CATEGORY BREAKDOWN
          </p>
          <ResponsiveContainer width='100%' height={160}>
            <RadarChart data={radarData}>
              <PolarGrid stroke='#1c1c2e'/>
              <PolarAngleAxis dataKey='subject' tick={{ fill:'#6b7280', fontSize:9 }}/>
              <Radar dataKey='value' stroke='#00ff88' fill='#00ff88' fillOpacity={0.15}/>
            </RadarChart>
          </ResponsiveContainer>
        </div>

        {/* Chart 3: Confidence vs Accuracy */}
        <div style={{ background:'var(--surface)', padding:'20px',
          border:'1px solid var(--border)' }}>
          <p style={{ color:'var(--muted)', fontSize:'11px',
            fontFamily:'var(--font-mono)', margin:'0 0 12px 0' }}>
            CONFIDENCE VS ACCURACY
          </p>
          <ResponsiveContainer width='100%' height={160}>
            <BarChart data={MOCK_CONF} layout='vertical'>
              <XAxis type='number' domain={[0,100]} stroke='#6b7280' tick={{ fontSize:10 }}/>
              <YAxis dataKey='type' type='category' stroke='#6b7280'
                tick={{ fontSize:9 }} width={75}/>
              <Tooltip contentStyle={{ background:'#12121a', border:'1px solid #1e1e2e',
                fontFamily:'var(--font-mono)', fontSize:'11px' }}/>
              <Bar dataKey='accuracy'>
                {MOCK_CONF.map((e, i) => (
                  <Cell key={i} fill={i===0?'#ff3b3b':i===1?'#ffd60a':'#00ff88'}/>
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Predictions Table */}
      <table style={{ width:'100%', borderCollapse:'collapse', fontSize:'13px' }}>
        <thead>
          <tr style={{ borderBottom:'1px solid var(--border)', color:'var(--muted)',
            fontSize:'10px', fontFamily:'var(--font-mono)' }}>
            <th style={{ padding:'8px', textAlign:'left' }}>QUOTE & SOURCE</th>
            <th style={{ padding:'8px', textAlign:'left' }}>ASSET</th>
            <th style={{ padding:'8px', textAlign:'left' }}>CONFIDENCE</th>
            <th style={{ padding:'8px', textAlign:'left' }}>VERDICT</th>
            <th style={{ padding:'8px', textAlign:'center' }}>SCORE</th>
          </tr>
        </thead>
        <tbody>
          {creator.predictions.map(p => (
            <tr key={p.prediction_id}
              onClick={() => setSelected(p)}
              style={{ borderBottom:'1px solid var(--border)', cursor:'pointer' }}
              onMouseEnter={e => e.currentTarget.style.background = '#0d0d14'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
              <td style={{ padding:'12px 8px', maxWidth:'300px' }}>
                <div style={{ fontStyle:'italic', marginBottom:'4px' }}>
                  "{p.exact_quote}"
                </div>
                <div style={{ color:'var(--muted)', fontSize:'11px',
                  fontFamily:'var(--font-mono)' }}>
                  {p.video_title} · {p.timestamp_in_video}
                </div>
              </td>
              <td style={{ padding:'12px 8px', fontFamily:'var(--font-mono)', fontSize:'12px' }}>
                {p.asset_name}
              </td>
              <td style={{ padding:'12px 8px' }}>
                <span style={{ fontSize:'10px', fontFamily:'var(--font-mono)',
                  color:confColor[p.confidence_language] }}>
                  {p.confidence_language}
                </span>
              </td>
              <td style={{ padding:'12px 8px', color:'var(--muted)', fontSize:'12px' }}>
                {p.verdict}
              </td>
              <td style={{ padding:'12px 8px', textAlign:'center',
                fontFamily:'var(--font-mono)', fontSize:'22px',
                color:scoreColor(p.accuracy_score) }}>
                {p.accuracy_score ?? '—'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal on row click */}
      {selected && (
        <div onClick={() => setSelected(null)}
          style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.8)',
            display:'flex', alignItems:'center', justifyContent:'center', zIndex:100 }}>
          <div onClick={e => e.stopPropagation()}
            style={{ background:'var(--surface)', border:'1px solid var(--border)',
              padding:'32px', maxWidth:'560px', width:'90%' }}>
            <p style={{ color:'var(--muted)', fontSize:'11px',
              fontFamily:'var(--font-mono)', marginBottom:'12px' }}>
              {selected.video_title} · {selected.timestamp_in_video}
            </p>
            <p style={{ fontStyle:'italic', fontSize:'16px', marginBottom:'20px' }}>
              "{selected.exact_quote}"
            </p>
            <div style={{ display:'flex', gap:'32px', marginBottom:'20px' }}>
              <div>
                <div style={{ color:'var(--muted)', fontSize:'10px',
                  fontFamily:'var(--font-mono)' }}>PREDICTED</div>
                <div style={{ fontFamily:'var(--font-mono)', color:'var(--yellow)' }}>
                  {selected.predicted_direction?.toUpperCase()} {selected.predicted_value ?? ''}
                </div>
              </div>
              <div>
                <div style={{ color:'var(--muted)', fontSize:'10px',
                  fontFamily:'var(--font-mono)' }}>ACTUAL</div>
                <div style={{ fontFamily:'var(--font-mono)', color:'var(--green)' }}>
                  {selected.actual_direction?.toUpperCase()} {selected.actual_value ?? ''}
                </div>
              </div>
              <div>
                <div style={{ color:'var(--muted)', fontSize:'10px',
                  fontFamily:'var(--font-mono)' }}>SCORE</div>
                <div style={{ fontFamily:'var(--font-mono)', fontSize:'28px',
                  color:scoreColor(selected.accuracy_score) }}>
                  {selected.accuracy_score}
                </div>
              </div>
            </div>
            <p style={{ color:'var(--muted)', fontSize:'13px', marginBottom:'20px' }}>
              {selected.verdict}
            </p>
            <a href={selected.video_url} target='_blank' rel='noreferrer'
              style={{ color:'var(--green)', fontFamily:'var(--font-mono)',
                fontSize:'11px', textDecoration:'none' }}>
              WATCH VIDEO →
            </a>
            <button onClick={() => setSelected(null)}
              style={{ float:'right', background:'transparent', border:'1px solid var(--border)',
                color:'var(--muted)', padding:'6px 14px', cursor:'pointer',
                fontFamily:'var(--font-mono)', fontSize:'11px' }}>
              CLOSE
            </button>
          </div>
        </div>
      )}
    </div>
  );
}