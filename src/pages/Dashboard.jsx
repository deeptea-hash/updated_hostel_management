import { Link } from 'react-router-dom';
import { useAuth } from '../auth.jsx';
import { useStore } from '../store.jsx';
import { Avatar, Badge } from '../ui.jsx';
import { Donut } from '../art.jsx';
import { NavIcon } from '../nav.jsx';
import { ROOMS, invoiceOf, occupants } from '../data.js';

const ms = (d) => new Date(d).getTime();
function series(bookings) {
  const live = bookings.filter((b) => b.status !== 'Pending' && b.room);
  if (!live.length) return [];
  const end = Math.max(...live.map((b) => ms(b.to))), start = Math.max(Math.min(...live.map((b) => ms(b.from))), end - 13 * 864e5), out = [];
  for (let t = start; t <= end; t += 864e5)
    out.push([new Date(t).toISOString().slice(5, 10), new Set(live.filter((b) => ms(b.from) <= t && t < ms(b.to)).map((b) => b.room)).size]);
  return out;
}
function Area({ data }) {
  if (data.length < 2) return <p className="muted">Not enough stay data yet.</p>;
  const W = 400, H = 130, n = data.length - 1, y = (v) => H - (v / ROOMS.length) * (H - 10) - 4;
  const pts = data.map(([, v], i) => [(i / n) * W, y(v)]), line = pts.map((p) => p.join(',')).join(' ');
  return (
    <svg viewBox={`0 0 ${W} ${H + 18}`} className="area" role="img" aria-label="Rooms occupied per day">
      {[0, 0.5, 1].map((g) => <line key={g} x1="0" x2={W} y1={y(g * ROOMS.length)} y2={y(g * ROOMS.length)} className="grid-line" />)}
      <polygon points={`0,${H} ${line} ${W},${H}`} className="area-fill" /><polyline points={line} className="area-line" fill="none" />
      {pts.map((p, i) => <circle key={i} cx={p[0]} cy={p[1]} r="3.5" className="area-dot"><title>{data[i][0]}: {data[i][1]} rooms</title></circle>)}
      <text x="0" y={H + 14} className="axis">{data[0][0]}</text><text x={W} y={H + 14} textAnchor="end" className="axis">{data[n][0]}</text>
    </svg>);
}

export default function Dashboard({ bookings, audit }) {
  const { user } = useAuth();
  const { extensions } = useStore();
  const used = ROOMS.filter((r) => occupants(r.id, bookings).length).length, pct = Math.round((used / ROOMS.length) * 100);
  const pending = bookings.filter((b) => b.status === 'Pending');
  const unpaid = bookings.filter((b) => b.category === 'Non-Training' && b.status === 'Checked-out' && !b.paid);
  const owed = unpaid.reduce((t, b) => t + invoiceOf(b, 0).total, 0);
  const live = bookings.filter((b) => b.status !== 'Pending');
  const cats = ['Training', 'VIP', 'Non-Training'].map((c) => [c, live.filter((b) => b.category === c).length]), max = Math.max(1, ...cats.map((c) => c[1]));
  const attention = [
    [pending.filter((b) => !b.held).length, 'bookings awaiting a room', '/admin/allocation', ['superadmin', 'frontdesk']],
    [extensions.filter((x) => x.status === 'Pending').length, 'extension requests to review', '/admin/stays', ['superadmin', 'frontdesk']],
    [unpaid.length, 'unpaid invoices', '/admin/billing', ['superadmin', 'accounts']],
  ].filter((a) => a[0] && a[3].includes(user.role));
  const kpi = (icon, label, value, tone) => <div className={'kpi ' + tone}><span className="kpi-ico"><NavIcon n={icon} /></span><span className="kpi-label">{label}</span><b>{value}</b></div>;
  return (
    <>
      <section className="kpis">
        {kpi('rooms', 'Occupancy', pct + '%', 'k1')}{kpi('allocation', 'Awaiting a room', pending.length, 'k2')}
        {kpi('stays', 'Checked in now', bookings.filter((b) => b.status === 'Checked-in').length, 'k3')}{kpi('billing', 'Unpaid invoices', '₹' + owed, 'k4')}
      </section>
      <section className="dash">
        <div className="panel"><h3>Rooms occupied per day</h3><Area data={series(bookings)} /></div>
        <div className="panel chart-col"><h3>Room occupancy</h3><Donut pct={pct} /><p className="muted">{used} of {ROOMS.length} rooms in use</p>
          {cats.map(([c, n]) => <div className="bar-row" key={c}><span>{c}</span><i style={{ width: (n / max) * 100 + '%' }} /><b>{n}</b></div>)}</div>
      </section>
      <section className="dash3">
        <div className="panel"><h3>Needs attention</h3>
          {attention.length ? <ul className="rowlist">{attention.map((a) => <li key={a[1]}><span><b>{a[0]}</b> {a[1]}</span><Link to={a[2]}>Open →</Link></li>)}</ul> : <p className="muted">Nothing is waiting. Well done.</p>}</div>
        <div className="panel"><h3>Arrivals queue</h3>
          {live.concat(pending).filter((b) => ['Pending', 'Confirmed'].includes(b.status)).slice(0, 5).map((b) => <div className="who tight" key={b.id}><Avatar name={b.name} />
            <div><b>{b.name}</b><br /><span className="muted">{b.from} · {b.category}</span></div><Badge kind={b.status === 'Confirmed' ? 'free' : 'vip'}>{b.status}</Badge></div>)}</div>
        <div className="panel"><h3>Recent activity</h3>
          {audit.length ? <ul className="rowlist">{audit.slice(0, 5).map((a, i) => <li key={i}><span><b>{a.booking}</b><br /><span className="muted">{a.reason}</span></span><small className="muted">{a.user}</small></li>)}</ul> : <p className="muted">Overrides and record views will appear here.</p>}</div>
      </section>
    </>);
}
