import { Fragment, useState } from 'react';
import { RANKS, SESSIONS, nights, stdWindow } from '../data.js';
import { useAuth } from '../auth.jsx';
import { Avatar, Badge } from '../ui.jsx';

const VIP_RANKS = ['Supreme Court Judge', 'High Court Judge', 'Faculty'];
const blank = { sessionId: '', name: '', rank: 'District Judge', category: 'Training', phone: '', email: '', idType: 'Government ID', idNo: '', org: '', purpose: '', from: '', to: '', notes: '', companions: [] };

export default function Guests({ bookings, add, setAudit }) {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [f, setF] = useState(blank);
  const [c, setC] = useState('');
  const [errs, setErrs] = useState({});
  const [q, setQ] = useState('');
  const [sel, setSel] = useState(null);
  const [done, setDone] = useState('');
  const [filter, setFilter] = useState('All'), [sort, setSort] = useState('name'), [page, setPage] = useState(0);
  const cat = VIP_RANKS.includes(f.rank) ? 'VIP' : f.category === 'VIP' ? 'Training' : f.category;
  const set = (k, v) => setF((p) => ({ ...p, [k]: v }));
  const field = (k, label, type = 'text', dis = false) => (
    <label>{label}<input type={type} value={f[k]} disabled={dis} onChange={(e) => set(k, e.target.value)} />{errs[k] && <span className="err">{errs[k]}</span>}</label>);
  const addC = () => { if (c.trim()) { set('companions', [...f.companions, c.trim()]); setC(''); } };
  const submit = (e) => {
    e.preventDefault();
    const x = {};
    if (!f.name.trim()) x.name = "Enter the guest's full name.";
    if (cat === 'Training' && !f.sessionId) x.sessionId = 'Choose the training session.';
    if (!/^\d{10}$/.test(f.phone)) x.phone = 'Enter a 10-digit mobile number.';
    if (f.email && !/^\S+@\S+\.\S+$/.test(f.email)) x.email = 'Enter a valid email address.';
    if (!f.idNo.trim()) x.idNo = 'Enter the ID number.';
    if (!f.from) x.from = 'Choose an arrival date.';
    if (!f.to) x.to = 'Choose a departure date.';
    else if (f.to <= f.from) x.to = 'Departure must be after arrival.';
    else if (cat === 'Non-Training' && nights(f.from, f.to) > 3) x.to = 'Non-training stays are limited to 3 nights.';
    setErrs(x);
    if (Object.keys(x).length) return;
    add({ ...f, name: f.name.trim(), category: cat, sessionId: cat === 'Training' ? f.sessionId : '' });
    setDone(`${f.name.trim()} is registered. The booking is now in the Allocation queue.`);
    setF(blank); setOpen(false);
  };
  const toggle = (b) => {
    if (sel !== b.id) setAudit((a) => [{ at: new Date().toLocaleString(), booking: b.name, from: '—', to: '—', reason: 'Viewed guest details (PII)', user: user.username }, ...a]);
    setSel(sel === b.id ? null : b.id);
  };
  const cur = bookings.find((b) => b.id === sel);
  const all = bookings.filter((b) => (b.name + b.rank + (b.phone || '')).toLowerCase().includes(q.toLowerCase()) && (filter === 'All' || (filter === 'Pending' ? b.status === 'Pending' : b.category === filter)))
    .sort((a, b) => (sort === 'name' ? a.name.localeCompare(b.name) : sort === 'stay' ? a.from.localeCompare(b.from) : a.category.localeCompare(b.category)));
  const pages = Math.max(1, Math.ceil(all.length / 6)), pg = Math.min(page, pages - 1), rows = all.slice(pg * 6, pg * 6 + 6);
  const pager = <div className="pager"><span className="muted">{all.length} guest(s)</span><div className="actions"><button className="ghost" disabled={pg === 0} onClick={() => setPage(pg - 1)}>Previous</button>
    <span>Page {pg + 1} of {pages}</span><button className="ghost" disabled={pg >= pages - 1} onClick={() => setPage(pg + 1)}>Next</button></div></div>;
  const th = (k, label) => <th><button className="th" onClick={() => setSort(k)}>{label}{sort === k ? ' ↑' : ''}</button></th>;
  return (
    <>
      <div className="toolbar">
        <input placeholder="Search by name, rank or phone" aria-label="Search guests" value={q} onChange={(e) => setQ(e.target.value)} />
        <button className="primary" style={{ marginTop: 0 }} onClick={() => { setOpen(!open); setDone(''); }}>{open ? 'Close form' : 'Register new guest'}</button>
      </div>
      {done && <p className="notice ok" role="status">{done}</p>}
      <div className="filters" role="group" aria-label="Filter guests">{['All', 'VIP', 'Training', 'Non-Training', 'Pending'].map((f) => <button key={f} className={'fchip' + (filter === f ? ' on' : '')} onClick={() => { setFilter(f); setPage(0); }}>{f}</button>)}</div>
      {open && (
        <form className="panel" onSubmit={submit} noValidate>
          <h3>Guest details</h3>
          <div className="form-grid">
            {field('name', 'Full name')}
            <label>Rank or designation<select value={f.rank} onChange={(e) => set('rank', e.target.value)}>{RANKS.map((r) => <option key={r}>{r}</option>)}</select></label>
            <label>Category<select value={cat} disabled={cat === 'VIP'} onChange={(e) => set('category', e.target.value)}>
              {cat === 'VIP' ? <option>VIP</option> : <><option>Training</option><option>Non-Training</option></>}</select></label>
            {field('org', 'Court or organisation')}
            {cat === 'Training' && <label className="full">Training session
              <select value={f.sessionId} onChange={(e) => { const s = SESSIONS.find((x) => x.id === e.target.value); setF((p) => ({ ...p, sessionId: e.target.value, ...(s ? stdWindow(s) : {}) })); }}>
                <option value="">Select session…</option>{SESSIONS.map((s) => <option key={s.id} value={s.id}>{s.title} ({s.start} to {s.end})</option>)}</select>
              {errs.sessionId && <span className="err">{errs.sessionId}</span>}
              <small className="muted">Dates are set to the standard window: the day before the session to the day after it ends.</small></label>}
            {field('phone', 'Mobile number', 'tel')}
            {field('email', 'Email (optional)', 'email')}
          </div>
          <h3>Identity</h3>
          <div className="form-grid">
            <label>ID type<select value={f.idType} onChange={(e) => set('idType', e.target.value)}>
              {['Government ID', 'Aadhaar', 'Passport', 'Driving licence', 'Official ID card'].map((t) => <option key={t}>{t}</option>)}</select></label>
            {field('idNo', 'ID number')}
          </div>
          <h3>Stay</h3>
          <div className="form-grid">
            {field('from', 'Arrival date', 'date', cat === 'Training')}
            {field('to', 'Departure date', 'date', cat === 'Training')}
            <label className="full">Purpose of visit<input value={f.purpose} onChange={(e) => set('purpose', e.target.value)} /></label>
          </div>
          <h3>Accompanying family or attendants</h3>
          <ul className="chips">{f.companions.map((n, i) => <li key={i}>{n}<button type="button" className="x" aria-label={`Remove ${n}`} onClick={() => set('companions', f.companions.filter((_, j) => j !== i))}>×</button></li>)}
            {!f.companions.length && <li className="muted">None added.</li>}</ul>
          <div className="row">
            <label>Name<input value={c} onChange={(e) => setC(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addC())} /></label>
            <button type="button" className="ghost" onClick={addC}>Add person</button>
          </div>
          <label>Special requirements<textarea rows="2" value={f.notes} onChange={(e) => set('notes', e.target.value)} /></label>
          <button className="primary" type="submit">Register guest</button>
        </form>)}
      <div className="panel scroll">
        <table>
          <thead><tr>{th('name', 'Guest')}{th('cat', 'Category')}{th('stay', 'Stay')}<th>Companions</th><th>Status</th></tr></thead>
          <tbody>
            {rows.map((b) => (
              <Fragment key={b.id}>
                <tr className="click" tabIndex={0} onClick={() => toggle(b)} onKeyDown={(e) => e.key === 'Enter' && toggle(b)}>
                  <td><div className="who"><Avatar name={b.name} /><div><b>{b.name}</b><br /><span className="muted">{b.rank}</span></div></div></td>
                  <td><Badge kind={{ VIP: 'vip', Training: 'train', 'Non-Training': 'paid' }[b.category]}>{b.category}</Badge></td>
                  <td>{b.from} to {b.to}</td><td>{b.companions.length}</td>
                  <td><Badge kind={({ Confirmed: 'free', 'Checked-in': 'train', 'Checked-out': 'paid' })[b.status] || 'vip'}>{b.status}</Badge></td>
                </tr>
                
              </Fragment>))}
            {!rows.length && <tr><td colSpan="5" className="muted">No guests match your search.</td></tr>}
          </tbody>
        </table>
        {pager}
      </div>
      {cur && <>
        <div className="drawer-scrim" onClick={() => setSel(null)} />
        <aside className="drawer" role="dialog" aria-label="Guest details">
          <button className="ghost close" onClick={() => setSel(null)}>Close</button>
          <div className="who big"><Avatar name={cur.name} /><div><h3>{cur.name}</h3><span className="muted">{cur.rank}</span></div></div>
          <p><Badge kind={{ VIP: 'vip', Training: 'train', 'Non-Training': 'paid' }[cur.category]}>{cur.category}</Badge>{' '}
            <Badge kind={({ Confirmed: 'free', 'Checked-in': 'train', 'Checked-out': 'paid' })[cur.status] || 'vip'}>{cur.status}</Badge></p>
          <dl className="details one">
            {[['Stay', `${cur.from} to ${cur.to}`], ['Mobile', cur.phone], ['Email', cur.email], [cur.idType || 'ID', cur.idNo ? '•••• ' + String(cur.idNo).slice(-4) : ''], ['Organisation', cur.org], ['Purpose', cur.purpose], ['Room', cur.room || 'Not allocated'],
              ['Companions', cur.companions.join(', ')], ['Special requirements', cur.notes]].map(([k, v]) => <div key={k}><dt>{k}</dt><dd>{v || '—'}</dd></div>)}
          </dl>
        </aside></>}
    </>);
}
