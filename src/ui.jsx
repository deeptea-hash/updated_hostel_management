export const initials = (n) => n.replace(/^Hon\.\s*/, '').split(' ').map((p) => p[0]).slice(0, 2).join('');
export const Avatar = ({ name }) => <span className="avatar" aria-hidden="true">{initials(name)}</span>;
export const Badge = ({ kind, children }) => <span className={'badge ' + kind}>{children}</span>;
const P = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.8, strokeLinecap: 'round', strokeLinejoin: 'round' };
export const Icon = ({ n }) => (
  <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true" {...P}>
    {n === 'bed' && <><path d="M3 18V7M3 14h18v4M21 14v-2a3 3 0 0 0-3-3h-7v5" /><circle cx="7" cy="11" r="1.5" /></>}
    {n === 'queue' && <><path d="M8 6h12M8 12h12M8 18h12" /><path d="M3.5 6h.01M3.5 12h.01M3.5 18h.01" /></>}
    {n === 'rupee' && <path d="M7 5h10M7 9h10M7 5c6 0 6 8 0 8H7l7 6" />}
    {n === 'logo' && <path d="M3 21h18M5 21V10M10 21V10M14 21V10M19 21V10M3 10l9-6 9 6" />}
    {n === 'check' && <path d="M5 12.5l4.5 4.5L19 7.5" />}
  </svg>);
