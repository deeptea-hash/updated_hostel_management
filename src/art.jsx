import { useState } from 'react';
// Original SVG illustrations (no external images). <Photo> swaps in a real photo from /public/images when one exists.
export function Photo({ src, alt, children }) {
  const [bad, setBad] = useState(false);
  return bad ? children : <img className="art" src={src} alt={alt} onError={() => setBad(true)} />;
}
export const HeroArt = () => (
  <svg viewBox="0 0 480 320" className="art" role="img" aria-label="Illustration of the academy building">
    <defs><linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#1b4a86" /><stop offset="1" stopColor="#a9cdee" /></linearGradient></defs>
    <rect width="480" height="320" fill="url(#sky)" /><circle cx="410" cy="58" r="32" fill="#f3c969" />
    <path d="M0 240 Q120 215 240 235 T480 230 V320 H0Z" fill="#3b8a5f" opacity=".45" />
    <g fill="#f6f2e8"><path d="M60 140 L240 60 L420 140Z" /><rect x="70" y="140" width="340" height="16" />
      {[0, 1, 2, 3, 4, 5].map((i) => <rect key={i} x={92 + i * 58} y="156" width="20" height="104" rx="3" />)}
      <rect x="55" y="260" width="370" height="12" /><rect x="40" y="272" width="400" height="14" /></g>
    <path d="M60 140 L240 60 L420 140Z" fill="none" stroke="#c79a2b" strokeWidth="4" />
    <circle cx="240" cy="110" r="17" fill="#14305c" /><path d="M240 100v20M231 106h18" stroke="#c79a2b" strokeWidth="3" />
    <rect x="230" y="190" width="34" height="70" fill="#14305c" /><rect x="0" y="286" width="480" height="34" fill="#3b8a5f" />
    {[28, 452].map((x) => <g key={x}><rect x={x - 3} y="236" width="6" height="50" fill="#5b4630" /><circle cx={x} cy="226" r="26" fill="#2c7a50" /></g>)}
  </svg>);
export const RoomArt = ({ suite }) => (
  <svg viewBox="0 0 240 160" className="art room-art" role="img" aria-label={suite ? 'Suite illustration' : 'Standard room illustration'}>
    <rect width="240" height="160" fill={suite ? '#efe6d2' : '#e6ecf5'} /><rect y="118" width="240" height="42" fill={suite ? '#b08a5a' : '#9aa9c0'} />
    <rect x="150" y="24" width="64" height="56" rx="3" fill="#a9d0f0" stroke="#14305c" strokeWidth="4" /><path d="M182 24V80M150 52H214" stroke="#14305c" strokeWidth="3" />
    {suite && <path d="M136 16h14v78h-14zM214 16h14v78h-14z" fill="#c79a2b" />}
    {(suite ? [0] : [0, 1]).map((i) => <g key={i}><rect x={suite ? 20 : 14 + i * 64} y="72" width={suite ? 108 : 54} height="48" rx="4" fill="#14305c" />
      <rect x={suite ? 20 : 14 + i * 64} y="92" width={suite ? 108 : 54} height="30" rx="4" fill="#fff" />
      <rect x={suite ? 28 : 20 + i * 64} y="80" width={suite ? 40 : 40} height="14" rx="5" fill="#dfe7f3" />{suite && <rect x="74" y="80" width="40" height="14" rx="5" fill="#dfe7f3" />}</g>)}
    <rect x={suite ? 136 : 134} y="100" width="14" height="20" fill="#6b5a3a" /><circle cx={suite ? 143 : 141} cy="94" r="8" fill="#f3c969" />
  </svg>);
export const ReceptionArt = () => (
  <svg viewBox="0 0 240 160" className="art" role="img" aria-label="Reception desk illustration">
    <rect width="240" height="160" fill="#e9eef7" /><rect y="120" width="240" height="40" fill="#b9c3d3" />
    <rect x="30" y="24" width="90" height="46" rx="3" fill="#14305c" />{[0, 1, 2, 3].map((i) => <g key={i}><circle cx={48 + i * 22} cy="42" r="5" fill="#c79a2b" /><circle cx={48 + i * 22} cy="58" r="5" fill="#c79a2b" /></g>)}
    <rect x="20" y="96" width="200" height="40" rx="3" fill="#7a5a2e" /><rect x="14" y="90" width="212" height="10" rx="3" fill="#c79a2b" />
    <path d="M158 90a12 12 0 0 1 24 0z" fill="#14305c" /><rect x="168" y="76" width="4" height="4" fill="#14305c" />
    <rect x="196" y="40" width="6" height="50" fill="#5b4630" /><circle cx="199" cy="34" r="18" fill="#2c7a50" /></svg>);
export const GardenArt = () => (
  <svg viewBox="0 0 240 160" className="art" role="img" aria-label="Garden illustration">
    <rect width="240" height="160" fill="#bfe0f5" /><circle cx="196" cy="34" r="20" fill="#f3c969" /><path d="M0 100 Q80 70 160 96 T240 90 V160 H0Z" fill="#6bb585" />
    <rect y="120" width="240" height="40" fill="#3b8a5f" /><path d="M96 160 L116 118 L136 118 L160 160Z" fill="#e4d9bf" />
    {[30, 200].map((x) => <g key={x}><rect x={x - 4} y="78" width="8" height="46" fill="#5b4630" /><circle cx={x} cy="68" r="28" fill="#2c7a50" /></g>)}
    <rect x="150" y="104" width="44" height="6" fill="#7a5a2e" /><rect x="154" y="110" width="4" height="12" fill="#7a5a2e" /><rect x="188" y="110" width="4" height="12" fill="#7a5a2e" /></svg>);
export const Skyline = () => (
  <svg viewBox="0 0 1200 60" preserveAspectRatio="none" width="100%" height="60"><path d="M0 60V40h60V26l30-14 30 14v14h60V30h40v30h80V34h50V18l40-12 40 12v16h60v26h90V36h70V22h60v38h100V30h50V14l35-10 35 10v16h70v30h110V38h60v22z" fill="#14305c" /></svg>);
const P = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.7, strokeLinecap: 'round', strokeLinejoin: 'round' };
export const Pic = ({ n }) => (
  <svg viewBox="0 0 24 24" width="30" height="30" aria-hidden="true" {...P}>
    {n === 'calendar' && <><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M3 10h18M8 3v4M16 3v4" /></>}
    {n === 'users' && <><circle cx="9" cy="8" r="3.5" /><path d="M2.5 20c0-4 3-6 6.5-6s6.5 2 6.5 6" /><circle cx="17.5" cy="9" r="2.5" /><path d="M17 14c3 0 4.5 2 4.5 5" /></>}
    {n === 'scales' && <><path d="M12 3v18M6 21h12M4 7h16M4 7l-2.5 7a3.5 3.5 0 0 0 5 0zM20 7l-2.5 7a3.5 3.5 0 0 0 5 0z" /></>}
    {n === 'lock' && <><rect x="5" y="11" width="14" height="10" rx="2" /><path d="M8 11V8a4 4 0 0 1 8 0v3" /></>}
  </svg>);
export const Donut = ({ pct }) => {
  const c = 2 * Math.PI * 42;
  return (<svg viewBox="0 0 120 120" width="140" height="140" role="img" aria-label={`${pct}% of rooms occupied`}>
    <circle cx="60" cy="60" r="42" fill="none" stroke="#dfe5ee" strokeWidth="14" />
    <circle cx="60" cy="60" r="42" fill="none" stroke="#c79a2b" strokeWidth="14" strokeDasharray={`${(c * pct) / 100} ${c}`} transform="rotate(-90 60 60)" strokeLinecap="round" />
    <text x="60" y="67" textAnchor="middle" fontSize="22" fontWeight="700" fill="currentColor">{pct}%</text></svg>);
};
export function Charts({ bookings, pct, used, total }) {
  const live = bookings.filter((b) => b.status !== 'Pending');
  const rows = ['Training', 'VIP', 'Non-Training'].map((c) => [c, live.filter((b) => b.category === c).length]);
  const max = Math.max(1, ...rows.map((r) => r[1]));
  return (
    <section className="charts">
      <div className="panel chart"><Donut pct={pct} /><div><h3>Room occupancy</h3><p className="muted">{used} of {total} rooms in use</p>
        <ul className="legend"><li><i style={{ background: '#c79a2b' }} />Occupied</li><li><i style={{ background: '#dfe5ee' }} />Vacant</li></ul></div></div>
      <div className="panel"><h3>Stays by category</h3>{rows.map(([c, n]) => <div className="bar-row" key={c}><span>{c}</span><i style={{ width: (n / max) * 100 + '%' }} /><b>{n}</b></div>)}</div>
    </section>);
}
