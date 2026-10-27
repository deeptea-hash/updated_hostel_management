import { useEffect, useState } from 'react';
import { Link, NavLink, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { seedBookings } from './data.js';
import { homeFor, useAuth } from './auth.jsx';
import { Icon } from './ui.jsx';
import { Skyline } from './art.jsx';
import Shell from './shell.jsx';
import { toast } from './toast.jsx';
import Login from './pages/Login.jsx';
import Portal from './pages/Portal.jsx';
import Admin from './pages/Admin.jsx';
import { Contact, Home, Rules } from './pages/Public.jsx';

function Guard({ roles, children }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (!roles.includes(user.role)) return <Navigate to={homeFor(user.role)} replace />;
  return children;
}
const NAMES = { '/': 'Home', '/rules': 'Stay rules', '/contact': 'Contact us', '/login': 'Sign in', '/portal': 'My stay', '/admin': 'Operations console' };

export default function App() {
  const { user, logout } = useAuth();
  const { pathname, hash } = useLocation();
  const [bookings, setBookings] = useState(seedBookings);
  const [audit, setAudit] = useState([]);
  const [size, setSize] = useState(() => +localStorage.getItem('fs') || 16);
  const [contrast, setContrast] = useState(() => localStorage.getItem('contrast') === '1');
  const update = (id, patch) => {
    const x = bookings.find((y) => y.id === id);
    setBookings((bs) => bs.map((b) => (b.id === id ? { ...b, ...patch } : b)));
    const msg = patch.status === 'Checked-in' ? `${x?.name} checked in` : patch.status === 'Checked-out' ? `${x?.name} checked out` : patch.status === 'Confirmed' ? `Room ${patch.room} assigned to ${x?.name}`
      : patch.paid ? 'Invoice marked as paid' : 'held' in patch ? (patch.held ? 'Request held' : 'Hold released') : patch.arrivalConfirmed ? 'Dates confirmed' : 'to' in patch ? null : 'Saved';
    if (msg) toast(msg);
  };
  const add = (b) => { setBookings((bs) => [...bs, { ...b, id: 'B' + (bs.length + 1), status: 'Pending', room: null }]); toast(`${b.name} registered`); };
  useEffect(() => { document.documentElement.style.fontSize = size + 'px'; localStorage.setItem('fs', size); }, [size]);
  useEffect(() => { document.documentElement.dataset.theme = contrast ? 'contrast' : 'default'; localStorage.setItem('contrast', contrast ? '1' : '0'); }, [contrast]);
  useEffect(() => { if (hash) document.getElementById(hash.slice(1))?.scrollIntoView(); }, [pathname, hash]);
  const routes = (
    <Routes>
          <Route path="/" element={<Home />} /><Route path="/rules" element={<Rules />} /><Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route path="/portal" element={<Guard roles={['guest']}><Portal bookings={bookings} update={update} /></Guard>} />
          <Route path="/admin/*" element={<Guard roles={['superadmin', 'frontdesk', 'accounts']}>
            <Admin bookings={bookings} update={update} add={add} audit={audit} setAudit={setAudit} /></Guard>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
  );
  if (user && /^\/(admin|portal)/.test(pathname)) return <Shell bookings={bookings}>{routes}</Shell>;
  const here = NAMES['/' + pathname.split('/')[1]] || 'Home';
  return (
    <>
      <a className="skip" href="#main">Skip to main content</a>
      <div className="util"><div>
        <Link to="/contact#accessibility">Screen reader access</Link>
        <span role="group" aria-label="Text size">
          <button onClick={() => setSize(Math.min(22, size + 2))} aria-label="Increase text size">A+</button>
          <button onClick={() => setSize(16)} aria-label="Normal text size">A</button>
          <button onClick={() => setSize(Math.max(12, size - 2))} aria-label="Decrease text size">A-</button></span>
        <button onClick={() => setContrast(!contrast)} aria-pressed={contrast}>{contrast ? 'Default theme' : 'High contrast'}</button>
        <Link to="/contact">Contact</Link>
      </div></div>
      <header className="gov-head"><div>
        <span className="crest" aria-hidden="true"><Icon n="logo" /></span>
        <div><h1>Judicial Academy Guest House</h1><p>Hostel and Guest House Management System</p></div>
      </div></header>
      <nav className="mainnav" aria-label="Main"><div>
        <NavLink to="/" end>Home</NavLink><NavLink to="/rules">Stay rules</NavLink><NavLink to="/contact">Contact us</NavLink>
        {user ? <><NavLink to={homeFor(user.role)}>{user.role === 'guest' ? 'My stay' : 'Operations console'}</NavLink>
          <button className="cta" onClick={logout}>Sign out ({user.name})</button></>
          : <NavLink className="cta" to="/login">Login</NavLink>}
      </div></nav>
      <nav className="crumbs" aria-label="Breadcrumb"><Link to="/">Home</Link>{pathname !== '/' && <><span>»</span><span aria-current="page">{here}</span></>}</nav>
      <main id="main" className="wrap" tabIndex="-1">
        {routes}
      </main>
      <div className="skyline" aria-hidden="true"><Skyline /></div>
      <footer className="site-foot"><div>
        <nav aria-label="Footer"><Link to="/contact">Feedback</Link><Link to="/contact">How to reach us</Link><Link to="/contact">Contact us</Link>
          <Link to="/contact#privacy">Privacy policy</Link><Link to="/contact#disclaimer">Disclaimer</Link><Link to="/contact#help">Help</Link></nav>
        <p>Last updated: {new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })} · Content owned and maintained by the Judicial Academy · Demo data</p>
      </div></footer>
    </>
  );
}
