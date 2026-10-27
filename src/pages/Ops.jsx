import { Fragment, useState } from 'react';
import { useAuth } from '../auth.jsx';
import { useStore } from '../store.jsx';
import { Avatar, Badge } from '../ui.jsx';
import { RANKS, ROOMS, invoiceOf, nights } from '../data.js';
import { toast } from '../toast.jsx';

const today = () => new Date().toISOString().slice(0, 10);
const log = (setAudit, user, b, reason) => setAudit((a) => [{ at: new Date().toLocaleString(), booking: b.name, from: '—', to: '—', reason, user: user.username }, ...a]);
const download = (name, rows) => {
  const csv = rows.map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(',')).join('\n');
  const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' })); a.download = name; a.click();
};

// Check-in / check-out and training-stay extension approvals.
export function Stays({ bookings, update, setAudit }) {
  const { user } = useAuth();
  const { rate, extensions, setExt } = useStore();
  const [open, setOpen] = useState(null);
  const [f, setF] = useState({ to: '', reason: '' });
  const [err, setErr] = useState('');
  const list = bookings.filter((b) => ['Confirmed', 'Checked-in', 'Checked-out'].includes(b.status));
  const request = (b) => {
    if (f.to <= b.to) return setErr('The new departure must be after the current departure date.');
    if (!f.reason.trim()) return setErr('Enter the reason for the extension.');
    setExt((e) => [...e, { id: 'X' + (e.length + 1), bid: b.id, name: b.name, was: b.to, to: f.to, reason: f.reason.trim(), status: 'Pending', by: user.username }]);
    setOpen(null); setF({ to: '', reason: '' }); setErr(''); toast('Extension request sent for approval');
  };
  const decide = (x, ok) => {
    setExt((e) => e.map((y) => (y.id === x.id ? { ...y, status: ok ? 'Approved' : 'Rejected' } : y)));
    if (ok) update(x.bid, { to: x.to });
    toast(ok ? 'Extension approved' : 'Extension rejected');
    log(setAudit, user, x, `Extension ${ok ? 'approved' : 'rejected'}: ${x.was} to ${x.to} (${x.reason})`);
  };
  return (
    <>
      <div className="panel scroll">
        <h3>Check-in and check-out</h3>
        <table>
          <thead><tr><th>Guest</th><th>Room</th><th>Planned stay</th><th>Actual</th><th>Status</th><th>Action</th></tr></thead>
          <tbody>
            {list.map((b) => (
              <Fragment key={b.id}>
                <tr>
                  <td><div className="who"><Avatar name={b.name} /><div><b>{b.name}</b><br /><span className="muted">{b.category}</span></div></div></td>
                  <td>{b.room}</td><td>{b.from} to {b.to}</td><td>{b.actualIn || '—'} / {b.actualOut || '—'}</td>
                  <td><Badge kind={{ Confirmed: 'free', 'Checked-in': 'train', 'Checked-out': 'paid' }[b.status]}>{b.status}</Badge></td>
                  <td className="actions">
                    {b.status === 'Confirmed' && <button className="ghost" onClick={() => update(b.id, { status: 'Checked-in', actualIn: today() })}>Check in</button>}
                    {b.status === 'Checked-in' && <button className="ghost" onClick={() => update(b.id, { status: 'Checked-out', actualOut: today(), rateApplied: rate })}>Check out</button>}
                    {b.sessionId && b.status !== 'Checked-out' && <button className="ghost" onClick={() => { setOpen(open === b.id ? null : b.id); setErr(''); }}>Request extension</button>}
                  </td>
                </tr>
                {open === b.id && <tr><td colSpan="6"><div className="row">
                  <label>New departure date<input type="date" value={f.to} onChange={(e) => setF({ ...f, to: e.target.value })} /></label>
                  <label>Reason<input value={f.reason} onChange={(e) => setF({ ...f, reason: e.target.value })} /></label>
                  <button className="primary" style={{ marginTop: 0 }} onClick={() => request(b)}>Send for approval</button></div>
                  {err && <p className="notice warn">{err}</p>}</td></tr>}
              </Fragment>))}
          </tbody>
        </table>
      </div>
      <div className="panel scroll">
        <h3>Extension requests for training stays</h3>
        {!extensions.length ? <p className="muted">No extension requests. Training stays beyond the standard window need approval here.</p> : (
          <table>
            <thead><tr><th>Guest</th><th>Change</th><th>Reason</th><th>Requested by</th><th>Decision</th></tr></thead>
            <tbody>{extensions.map((x) => (
              <tr key={x.id}><td>{x.name}</td><td>{x.was} to {x.to}</td><td>{x.reason}</td><td>{x.by}</td>
                <td className="actions">{x.status === 'Pending'
                  ? <><button className="ghost" onClick={() => decide(x, true)}>Approve</button><button className="ghost" onClick={() => decide(x, false)}>Reject</button></>
                  : <Badge kind={x.status === 'Approved' ? 'free' : 'paid'}>{x.status}</Badge>}</td></tr>))}</tbody>
          </table>)}
      </div>
    </>);
}

// Invoices exist only for Non-Training stays (duration x fixed rate). Training and VIP stays are never billed.
export function Billing({ bookings, update }) {
  const [sheet, setSheet] = useState(null);
  const { rate } = useStore();
  const inv = bookings.filter((b) => b.category === 'Non-Training' && b.status === 'Checked-out').map((b) => ({ b, ...invoiceOf(b, rate) }));
  const total = inv.reduce((t, i) => t + i.total, 0);
  const inHouse = bookings.filter((b) => b.category === 'Non-Training' && ['Confirmed', 'Checked-in'].includes(b.status)).length;
  return (
    <div className="panel scroll">
      <div className="toolbar"><h3 style={{ margin: 0 }}>Invoices for paid stays</h3>
        <button className="ghost" onClick={() => download('invoices.csv', [['Invoice', 'Guest', 'Rank', 'Check-in', 'Check-out', 'Nights', 'Rate', 'Total', 'Status'],
          ...inv.map((i) => [i.no, i.b.name, i.b.rank, i.b.actualIn || i.b.from, i.b.actualOut || i.b.to, i.nights, i.rate, i.total, i.b.paid ? 'Paid' : 'Unpaid'])])}>Export CSV for accounts</button></div>
      <p className="muted">Room charges only. Mess and food billing is handled by a separate process. {inHouse} paid stay(s) will be invoiced at check-out.</p>
      <table>
        <thead><tr><th>Invoice</th><th>Guest</th><th>Nights</th><th>Rate</th><th>Total</th><th>Status</th><th /></tr></thead>
        <tbody>
          {inv.map((i) => <tr key={i.no}><td>{i.no}</td><td>{i.b.name}</td><td>{i.nights}</td><td>₹{i.rate}</td><td><b>₹{i.total}</b></td>
            <td><Badge kind={i.b.paid ? 'free' : 'vip'}>{i.b.paid ? 'Paid' : 'Unpaid'}</Badge></td>
            <td className="actions">{!i.b.paid && <button className="ghost" onClick={() => update(i.b.id, { paid: true })}>Mark paid</button>}<button className="ghost" onClick={() => setSheet(i)}>Print</button></td></tr>)}
          {!inv.length && <tr><td colSpan="7" className="muted">No invoices yet. They appear when a paid guest checks out.</td></tr>}
        </tbody>
        {!!inv.length && <tfoot><tr><td colSpan="4"><b>Total billed</b></td><td colSpan="3"><b>₹{total}</b></td></tr></tfoot>}
      </table>
      {sheet && <div className="invoice-wrap"><div className="invoice-sheet">
        <h2>Room charge invoice</h2><p>Judicial Academy Guest House</p>
        <table><tbody><tr><td>Invoice</td><td>{sheet.no}</td></tr><tr><td>Guest</td><td>{sheet.b.name} ({sheet.b.rank})</td></tr>
          <tr><td>Stay</td><td>{sheet.b.actualIn || sheet.b.from} to {sheet.b.actualOut || sheet.b.to}</td></tr><tr><td>Nights × rate</td><td>{sheet.nights} × ₹{sheet.rate}</td></tr>
          <tr><td><b>Total</b></td><td><b>₹{sheet.total}</b></td></tr></tbody></table>
        <p className="muted">Mess and food charges are billed separately.</p>
        <div className="actions"><button className="primary" onClick={() => window.print()}>Print</button><button className="ghost" onClick={() => setSheet(null)}>Close</button></div></div></div>}
    </div>);
}

// Monthly report: Training vs Non-Training (paid), with VIP shown separately.
export function Reports({ bookings }) {
  const done = bookings.filter((b) => b.status !== 'Pending');
  const months = [...new Set(done.map((b) => b.from.slice(0, 7)))].sort().reverse();
  const [m, setM] = useState(months[0]);
  const rows = ['Training', 'VIP', 'Non-Training'].map((c) => {
    const s = done.filter((b) => b.category === c && b.from.startsWith(m));
    return { c, stays: s.length, nights: s.reduce((t, b) => t + nights(b.from, b.to), 0),
      billed: c === 'Non-Training' ? s.filter((b) => b.status === 'Checked-out').reduce((t, b) => t + invoiceOf(b, 0).total, 0) : null };
  });
  const max = Math.max(1, ...rows.map((r) => r.stays));
  return (
    <div className="panel scroll">
      <div className="toolbar"><h3 style={{ margin: 0 }}>Monthly stay report</h3>
        <div className="actions"><select aria-label="Month" value={m} onChange={(e) => setM(e.target.value)} style={{ margin: 0 }}>{months.map((x) => <option key={x}>{x}</option>)}</select>
          <button className="ghost" style={{ marginTop: 0 }} onClick={() => download(`report-${m}.csv`, [['Category', 'Stays', 'Guest nights', 'Billed'], ...rows.map((r) => [r.c, r.stays, r.nights, r.billed ?? 'Not billed'])])}>Export CSV</button><button className="ghost" style={{ marginTop: 0 }} onClick={() => window.print()}>Print</button></div></div>
      <table>
        <thead><tr><th>Category</th><th>Stays</th><th>Guest nights</th><th>Billed</th></tr></thead>
        <tbody>{rows.map((r) => <tr key={r.c}><td>{r.c === 'Non-Training' ? 'Non-Training (paid)' : r.c}</td><td>{r.stays}</td><td>{r.nights}</td><td>{r.billed === null ? 'Not billed' : '₹' + r.billed}</td></tr>)}</tbody>
      </table>
      <div className="bars">{rows.map((r) => <div className="bar-row" key={r.c}><span>{r.c}</span><i style={{ width: (r.stays / max) * 100 + '%' }} /><b>{r.stays}</b></div>)}</div>
    </div>);
}

// Reference data the SuperAdmin maintains.
export function Settings() {
  const { rate, setRate } = useStore();
  const [v, setV] = useState(rate);
  const [saved, setSaved] = useState(false);
  return (
    <>
      <div className="panel">
        <h3>Fixed state rate</h3>
        <p className="muted">Charged per night to Non-Training guests. Supplied by the client; the system does not compute it.</p>
        <div className="row"><label>Rate per night (₹)<input type="number" min="0" value={v} onChange={(e) => { setV(+e.target.value); setSaved(false); }} /></label>
          <button className="primary" style={{ marginTop: 0, flex: '0 0 auto' }} onClick={() => { setRate(v); setSaved(true); toast('Rate saved'); }}>Save rate</button></div>
        {saved && <p className="notice ok" role="status">Rate saved. It applies to guests who check out from now on.</p>}
      </div>
      <div className="panel scroll">
        <h3>Rank and room eligibility</h3>
        <table><thead><tr><th>Rank</th><th>Eligible rooms</th><th>Sharing</th></tr></thead>
          <tbody>{RANKS.map((r) => <tr key={r}><td>{r}</td><td>{ROOMS.filter((x) => x.tiers.includes(r)).map((x) => x.id).join(', ')}</td><td>Same rank only</td></tr>)}</tbody></table>
      </div>
    </>);
}
