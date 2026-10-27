import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { USERS, ROLES, useAuth, homeFor } from '../auth.jsx';
import { Icon } from '../ui.jsx';
import { HeroArt } from '../art.jsx';

export default function Login() {
  const { user, login } = useAuth();
  const nav = useNavigate();
  const [f, setF] = useState({ u: '', p: '' });
  const [err, setErr] = useState('');
  if (user) return <Navigate to={homeFor(user.role)} replace />;
  const submit = (e) => {
    e.preventDefault();
    const u = login(f.u, f.p);
    if (u?.locked) setErr(`Too many attempts. Try again in ${u.locked} seconds.`);
    else if (!u) setErr('Username or password is incorrect. Check your details and try again.');
    else nav(homeFor(u.role));
  };
  return (
    <section className="login">
      <div className="login-brand">
        <span className="mark"><Icon n="logo" /></span>
        <h2>Guest House Management</h2>
        <p>Sign in with the account issued by the administration office.</p>
        <div className="login-pic"><HeroArt /></div>
      </div>
      <form className="panel" onSubmit={submit}>
        <h2>Sign in</h2>
        <label>Username<input value={f.u} autoComplete="username" onChange={(e) => setF({ ...f, u: e.target.value })} /></label>
        <label>Password<input type="password" value={f.p} autoComplete="current-password" onChange={(e) => setF({ ...f, p: e.target.value })} /></label>
        {err && <p className="notice warn" role="alert">{err}</p>}
        <button className="primary wide" type="submit">Sign in</button>
        <details className="demo">
          <summary>Demo accounts</summary>
          <table><tbody>{USERS.map((x) => (
            <tr key={x.username}><td>{x.username}</td><td>{ROLES[x.role]}</td>
              <td><button type="button" className="ghost" onClick={() => setF({ u: x.username, p: x.password })}>Fill in</button></td></tr>))}
          </tbody></table>
        </details>
      </form>
    </section>
  );
}
