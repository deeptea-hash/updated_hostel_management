import { useEffect, useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { ROLES, useAuth } from './auth.jsx';
import { useStore } from './store.jsx';
import { Avatar, Icon } from './ui.jsx';
import { NavIcon, TABS } from './nav.jsx';

// Application shell for signed-in users: sidebar, top bar, search (Ctrl+K), notifications, dark mode.
export default function Shell({ bookings, children }) {
  const { user, logout } = useAuth();
  const { extensions } = useStore();
  const nav = useNavigate();
  const [dark, setDark] = useState(() => localStorage.getItem('mode') === 'dark');
  const [open, setOpen] = useState(false), [cmd, setCmd] = useState(false), [bell, setBell] = useState(false), [q, setQ] = useState('');
  useEffect(() => { localStorage.setItem('mode', dark ? 'dark' : 'light'); }, [dark]);
  useEffect(() => {
    const k = (e) => { if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); setCmd(true); } if (e.key === 'Escape') { setCmd(false); setBell(false); } };
    window.addEventListener('keydown', k); return () => window.removeEventListener('keydown', k);
  }, []);
  const staff = user.role !== 'guest';
  const items = staff ? TABS.filter((t) => t.roles.includes(user.role)).map((t) => ({ ...t, to: '/admin/' + t.id })) : [{ id: 'portal', label: 'My stay', icon: 'portal', to: '/portal' }];
  const alerts = staff ? [
    [bookings.filter((b) => b.status === 'Pending' && !b.held).length, 'bookings awaiting a room', '/admin/allocation', ['superadmin', 'frontdesk']],
    [extensions.filter((x) => x.status === 'Pending').length, 'extension requests to review', '/admin/stays', ['superadmin', 'frontdesk']],
    [bookings.filter((b) => b.category === 'Non-Training' && b.status === 'Checked-out' && !b.paid).length, 'unpaid invoices', '/admin/billing', ['superadmin', 'accounts']],
  ].filter((a) => a[0] && a[3].includes(user.role)) : [];
  const ql = q.toLowerCase();
  const results = [...items.filter((i) => i.label.toLowerCase().includes(ql)).map((i) => ({ label: 'Go to ' + i.label, to: i.to })),
    ...(q && staff && user.role !== 'accounts' ? bookings.filter((b) => (b.name + b.rank).toLowerCase().includes(ql)).map((b) => ({ label: `${b.name} · ${b.rank}`, to: '/admin/guests' })) : [])].slice(0, 8);
  const go = (to) => { nav(to); setCmd(false); setQ(''); };
  return (
    <div className={'app' + (dark ? ' dark' : '')}>
      <aside className={'sidebar' + (open ? ' open' : '')}>
        <Link to="/" className="sb-brand"><span className="mark"><Icon n="logo" /></span><div><b>Guest House</b><small>Management console</small></div></Link>
        <nav aria-label="Sections">{items.map((i) => <NavLink key={i.id} to={i.to} onClick={() => setOpen(false)}><NavIcon n={i.icon} />{i.label}</NavLink>)}</nav>
        <div className="sb-user"><Avatar name={user.name} /><div><b>{user.name}</b><small>{ROLES[user.role]}</small></div>
          <button aria-label="Sign out" title="Sign out" onClick={logout}><NavIcon n="out" /></button></div>
      </aside>
      <div className="main-col">
        <header className="appbar">
          <button className="burger" onClick={() => setOpen(!open)} aria-label="Toggle menu">☰</button>
          <button className="search" onClick={() => setCmd(true)}><NavIcon n="search" />Search pages and guests<kbd>Ctrl K</kbd></button>
          <div className="tools">
            <Link to="/" className="chip">Public site</Link>
            <button className="icon-btn" onClick={() => setDark(!dark)} aria-label="Toggle dark mode">{dark ? '☀' : '☾'}</button>
            <div className="bell-wrap">
              <button className="icon-btn" aria-label="Notifications" onClick={() => setBell(!bell)}><NavIcon n="bell" />
                {alerts.length > 0 && <span className="dot-badge">{alerts.reduce((t, a) => t + a[0], 0)}</span>}</button>
              {bell && <div className="pop" role="dialog" aria-label="Notifications"><h4>Needs attention</h4>
                {alerts.length ? alerts.map((a) => <button key={a[1]} onClick={() => { setBell(false); nav(a[2]); }}><b>{a[0]}</b> {a[1]}</button>) : <p className="muted">All caught up.</p>}</div>}
            </div>
          </div>
        </header>
        <main id="main" className="content" tabIndex="-1">{children}</main>
      </div>
      {cmd && <div className="scrim" onClick={() => setCmd(false)}><div className="cmd" role="dialog" aria-label="Search" onClick={(e) => e.stopPropagation()}>
        <input autoFocus placeholder="Search pages and guests…" value={q} onChange={(e) => setQ(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && results[0] && go(results[0].to)} />
        <ul>{results.map((r) => <li key={r.label}><button onClick={() => go(r.to)}>{r.label}</button></li>)}{!results.length && <li className="muted">No matches.</li>}</ul></div></div>}
    </div>);
}
