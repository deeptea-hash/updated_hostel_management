import { useEffect, useState } from 'react';
// toast('Saved') can be called from anywhere; <ToastHost /> renders the messages.
export const toast = (msg, kind = 'ok') => window.dispatchEvent(new CustomEvent('app-toast', { detail: { msg, kind, id: Math.random() } }));
export function ToastHost() {
  const [items, setItems] = useState([]);
  useEffect(() => {
    const h = (e) => { const t = e.detail; setItems((x) => [...x, t]); setTimeout(() => setItems((x) => x.filter((y) => y.id !== t.id)), 3500); };
    window.addEventListener('app-toast', h); return () => window.removeEventListener('app-toast', h);
  }, []);
  return <div className="toasts" role="status" aria-live="polite">{items.map((t) => <div key={t.id} className={'toast ' + t.kind}>{t.msg}</div>)}</div>;
}
