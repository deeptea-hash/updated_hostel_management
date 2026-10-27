import { useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import Dashboard from './Dashboard.jsx';
import Calendar from './Calendar.jsx';
import { TABS } from '../nav.jsx';
import Guests from './Guests.jsx';
import { Stays, Billing, Reports, Settings } from './Ops.jsx';
import { useStore } from '../store.jsx';
import { Avatar, Badge, Icon } from '../ui.jsx';
import { Charts, RoomArt } from '../art.jsx';
import { ROLES, USERS, useAuth } from '../auth.jsx';
import { ROOMS, STATE_RATE, nights, occupants, propose } from '../data.js';

export default function Admin({ bookings, update, add, audit, setAudit }) {
  const { user } = useAuth();
  const tabs = TABS.filter((t) => t.roles.includes(user.role));
  const cur = tabs.find((t) => t.id === useLocation().pathname.split('/')[2]);
  if (!cur) return <Navigate to={'/admin/' + tabs[0].id} replace />;
  const tab = cur.id;
  return (
    <>
      <div className="page-head"><h2>{cur.label}</h2><p className="muted">{cur.desc}</p></div>
      {user.role === 'accounts' && ['rooms', 'audit'].includes(tab) && <p className="notice ok">You have read-only access. Room allocation is handled by the front desk.</p>}
      {tab === 'overview' && <Dashboard bookings={bookings} audit={audit} />}
      {tab === 'guests' && <Guests bookings={bookings} add={add} setAudit={setAudit} />}
      {tab === 'allocation' && <Queue {...{ bookings, update, setAudit }} />}
      {tab === 'stays' && <Stays {...{ bookings, update, setAudit }} />}
      {tab === 'billing' && <Billing {...{ bookings, update }} />}
      {tab === 'reports' && <Reports bookings={bookings} />}
      {tab === 'calendar' && <Calendar bookings={bookings} />}
      {tab === 'rooms' && <Rooms bookings={bookings} />}
      {tab === 'audit' && <Audit audit={audit} />}
      {tab === 'settings' && <Settings />}
      {tab === 'users' && <Users />}
    </>
  );
}

function Queue({ bookings, update, setAudit }) {
  const { user } = useAuth();
  const [choice, setChoice] = useState({}), [reason, setReason] = useState({});
  const { rate } = useStore();
  const pending = bookings.filter((b) => b.status === 'Pending').sort((a, c) => (c.category === 'VIP') - (a.category === 'VIP'));
  if (!pending.length) return <p className="panel muted">Every booking has a room. New requests will appear here.</p>;
  return pending.map((b) => {
    const proposed = propose(b, bookings);
    const room = choice[b.id] ?? proposed ?? '';
    const r = ROOMS.find((x) => x.id === room);
    const clash = r && occupants(r.id, bookings, b.id, b).some((o) => o.rank !== b.rank);
    const override = room !== (proposed ?? '');
    const needReason = override || clash;
    const ok = room && (!needReason || (reason[b.id] || '').trim()) && !b.held;
    const confirm = () => {
      update(b.id, { room, status: 'Confirmed' });
      if (needReason) setAudit((a) => [{ at: new Date().toLocaleString(), booking: b.name, from: proposed ?? 'none', to: room, reason: reason[b.id], user: user.username }, ...a]);
    };
    return (
      <article key={b.id} className="panel">
        <div className="who"><Avatar name={b.name} /><div><h3>{b.name}</h3><span className="muted">{b.rank}</span></div>
          <Badge kind={{ VIP: 'vip', Training: 'train', 'Non-Training': 'paid' }[b.category]}>{b.category}</Badge></div>
        <p>{b.from} to {b.to} · {b.companions.length} accompanying{b.category === 'Non-Training' ? ` · est. ₹${nights(b.from, b.to) * rate}` : ''}</p>
        <p className={'notice ' + (proposed ? 'ok' : 'warn')}>{proposed ? `Proposed: room ${proposed}` : 'No same-rank match. Choose a room or hold this request.'}</p>
        <label>Assign room
          <select value={room} onChange={(e) => setChoice({ ...choice, [b.id]: e.target.value })}>
            <option value="">Select…</option>
            {ROOMS.map((x) => <option key={x.id} value={x.id}>{x.id} ({x.type})</option>)}
          </select>
        </label>
        {clash && <p className="notice warn">This room holds a guest of a different rank. Sharing needs the same rank, so a reason is required.</p>}
        {needReason && <label>Reason for override<input value={reason[b.id] || ''} onChange={(e) => setReason({ ...reason, [b.id]: e.target.value })} /></label>}
        {b.held && <p className="notice warn">On hold. Release the hold to assign a room.</p>}
        <div className="actions"><button className="primary" disabled={!ok} onClick={confirm}>Confirm assignment</button>
          <button className="ghost" style={{ marginTop: 16 }} onClick={() => update(b.id, { held: !b.held })}>{b.held ? 'Release hold' : 'Hold request'}</button></div>
      </article>);
  });
}

function Rooms({ bookings }) {
  return (
    <div className="grid">{ROOMS.map((r) => {
      const occ = occupants(r.id, bookings);
      return <div key={r.id} className={'room ' + (occ.length ? 'busy' : '')}>
        <RoomArt suite={r.type === 'Suite'} /><b>{r.id}</b><span>{r.type} · {r.beds} bed{r.beds > 1 ? 's' : ''}</span>
        <small>{r.tiers.join(', ')}</small>
        <Badge kind={occ.length ? 'paid' : 'free'}>{occ.length ? 'Occupied' : 'Vacant'}</Badge><em>{occ.map((o) => o.name).join(', ')}</em></div>;
    })}</div>);
}

function Audit({ audit }) {
  if (!audit.length) return <p className="panel muted">No overrides recorded yet.</p>;
  return <div className="panel scroll"><table><thead><tr><th>When</th><th>Guest</th><th>From</th><th>To</th><th>Reason</th><th>Staff</th></tr></thead>
    <tbody>{audit.map((a, i) => <tr key={i}><td>{a.at}</td><td>{a.booking}</td><td>{a.from}</td><td>{a.to}</td><td>{a.reason}</td><td>{a.user}</td></tr>)}</tbody></table></div>;
}

function Users() {
  return <div className="panel scroll"><table><thead><tr><th>Name</th><th>Username</th><th>Role</th></tr></thead>
    <tbody>{USERS.map((u) => <tr key={u.username}><td>{u.name}</td><td>{u.username}</td>
      <td><Badge kind={u.role === 'guest' ? 'free' : 'paid'}>{ROLES[u.role]}</Badge></td></tr>)}</tbody></table></div>;
}
