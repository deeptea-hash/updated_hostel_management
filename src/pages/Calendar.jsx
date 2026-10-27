import { useState } from 'react';
import { ROOMS } from '../data.js';
const DAY = 864e5, iso = (t) => new Date(t).toISOString().slice(0, 10);
// Room-by-day occupancy grid for allotted stays.
export default function Calendar({ bookings }) {
  const live = bookings.filter((b) => b.status !== 'Pending' && b.room);
  const [start, setStart] = useState(live.length ? Math.min(...live.map((b) => new Date(b.from).getTime())) : Date.now());
  const days = Array.from({ length: 14 }, (_, i) => start + i * DAY);
  const at = (room, t) => live.find((b) => b.room === room && b.from <= iso(t) && iso(t) < b.to);
  return (
    <div className="panel scroll">
      <div className="toolbar"><h3 style={{ margin: 0 }}>Room calendar</h3>
        <div className="actions"><button className="ghost" onClick={() => setStart(start - 7 * DAY)}>← Week</button><button className="ghost" onClick={() => setStart(start + 7 * DAY)}>Week →</button></div></div>
      <div className="cal" style={{ gridTemplateColumns: '90px repeat(14, minmax(34px, 1fr))' }}>
        <span />{days.map((t) => <span key={t} className="cal-h">{iso(t).slice(8)}<small>{new Date(t).toLocaleDateString('en-IN', { weekday: 'narrow' })}</small></span>)}
        {ROOMS.map((r) => [<b key={r.id} className="cal-r">{r.id}<small>{r.type}</small></b>, ...days.map((t) => {
          const b = at(r.id, t);
          return <span key={r.id + t} className={'cal-c' + (b ? ' ' + b.category.replace(/\W/g, '').toLowerCase() : '')} title={b ? `${b.name} (${b.from} to ${b.to})` : 'Vacant'} />;
        })])}
      </div>
      <ul className="legend cal-legend"><li><i className="c-training" />Training</li><li><i className="c-vip" />VIP</li><li><i className="c-nontraining" />Non-Training</li></ul>
    </div>);
}
