import { useState } from 'react';
import { Avatar, Icon } from '../ui.jsx';
import { nights } from '../data.js';
import { useAuth } from '../auth.jsx';

// Guest-facing view: never receives room, category or rate fields.
export default function Portal({ bookings, update }) {
  const { user } = useAuth();
  const id = user.bookingId;
  const b = bookings.find((x) => x.id === id);
  const [name, setName] = useState('');
  const [form, setForm] = useState({ from: b.from, to: b.to });
  const add = () => { if (name.trim()) { update(id, { companions: [...b.companions, name.trim()] }); setName(''); } };
  const confirmed = ['Confirmed', 'Checked-in'].includes(b.status);
  const steps = [
    ['Confirm your dates', !!b.arrivalConfirmed || confirmed],
    ['Declare who is travelling with you', b.companions.length > 0],
    ['Receive your stay confirmation', confirmed],
  ];
  return (
    <section className="portal">
      <aside className="welcome">
        <Avatar name={b.name} />
        <h2>Welcome, {b.name}</h2>
        <p className="lead">Please confirm your arrival so the front desk can prepare your stay.</p>
        <dl>
          <dt>Stay</dt><dd>{form.from} to {form.to}</dd>
          <dt>Length</dt><dd>{nights(form.from, form.to)} night(s)</dd>
          <dt>Availability</dt><dd><span className="dot" /> Rooms available</dd>
        </dl>
        <ol className="steps">
          {steps.map(([t, done]) => <li key={t} className={done ? 'done' : ''}><span>{done ? <Icon n="check" /> : null}</span>{t}</li>)}
        </ol>
      </aside>
      <div className="panel form">
        <h2>Arrival details</h2>
        <div className="row">
          <label>Arrival<input type="date" value={form.from} onChange={(e) => setForm({ ...form, from: e.target.value })} /></label>
          <label>Departure<input type="date" value={form.to} onChange={(e) => setForm({ ...form, to: e.target.value })} /></label>
        </div>
        <h3>Family members or attendants</h3>
        <ul className="chips">{b.companions.map((c, i) => <li key={i}><Avatar name={c} />{c}</li>)}
          {!b.companions.length && <li className="muted">No one declared yet.</li>}</ul>
        <div className="row">
          <label>Full name<input value={name} onChange={(e) => setName(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && add()} /></label>
          <button className="ghost" onClick={add}>Add person</button>
        </div>
        <button className="primary wide" onClick={() => update(id, { ...form, arrivalConfirmed: true })}>Confirm dates</button>
        {confirmed && <p className="notice ok">Your stay is confirmed. The front desk will welcome you on arrival.</p>}
      </div>
    </section>
  );
}
