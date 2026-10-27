const D = {
  overview: 'M3 3h7v9H3zM14 3h7v5h-7zM14 12h7v9h-7zM3 16h7v5H3z',
  guests: 'M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8M22 21v-2a4 4 0 0 0-3-3.9M16 3.1a4 4 0 0 1 0 7.8',
  allocation: 'M9 6h11M9 12h11M9 18h11M4 6l1 1 2-2M4 12l1 1 2-2M4 18l1 1 2-2',
  stays: 'M15.5 7.5l3 3L22 7l-3-3M15.5 7.5L11.4 11.6a5.5 5.5 0 1 0 3 3l4.1-4.1',
  billing: 'M4 2v20l3-2 3 2 3-2 3 2 3-2V2zM8 8h8M8 12h8',
  reports: 'M3 3v18h18M7 15l4-5 3 3 5-7',
  rooms: 'M3 18V7M3 14h18v4M21 14v-2a3 3 0 0 0-3-3h-7v5',
  calendar: 'M3 5h18v16H3zM3 10h18M8 3v4M16 3v4',
  audit: 'M12 2l8 3v6c0 5-3.5 9-8 11-4.5-2-8-6-8-11V5zM9 12l2 2 4-4',
  settings: 'M4 6h10M18 6h2M4 12h4M12 12h8M4 18h12M14 4v4M8 10v4M16 16v4',
  users: 'M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8',
  portal: 'M3 11l9-8 9 8v10H3zM9 21v-6h6v6',
  search: 'M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16zM21 21l-4.3-4.3',
  bell: 'M18 8a6 6 0 0 0-12 0c0 7-3 8-3 8h18s-3-1-3-8M13.7 21a2 2 0 0 1-3.4 0',
  out: 'M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9',
};
export const NavIcon = ({ n }) => <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={D[n]} /></svg>;
const S = ['superadmin', 'frontdesk', 'accounts'], F = ['superadmin', 'frontdesk'];
export const TABS = [
  { id: 'overview', label: 'Overview', icon: 'overview', roles: S, desc: 'Live occupancy and the work waiting for you.' },
  { id: 'guests', label: 'Guests', icon: 'guests', roles: F, desc: 'Register guests and look up their details.' },
  { id: 'allocation', label: 'Allocation queue', icon: 'allocation', roles: F, desc: 'Assign rooms by rank. Overrides are logged.' },
  { id: 'stays', label: 'Stays', icon: 'stays', roles: F, desc: 'Check guests in and out, and review extension requests.' },
  { id: 'calendar', label: 'Calendar', icon: 'calendar', roles: S, desc: 'Room availability across the next two weeks.' },
  { id: 'billing', label: 'Billing', icon: 'billing', roles: ['superadmin', 'accounts'], desc: 'Invoices for paid stays, ready for accounts.' },
  { id: 'reports', label: 'Reports', icon: 'reports', roles: S, desc: 'Monthly training and non-training volumes.' },
  { id: 'rooms', label: 'Rooms', icon: 'rooms', roles: S, desc: 'Every room and who is staying in it.' },
  { id: 'audit', label: 'Audit log', icon: 'audit', roles: S, desc: 'Every override and record access, with who and why.' },
  { id: 'settings', label: 'Settings', icon: 'settings', roles: ['superadmin'], desc: 'Reference data such as the fixed state rate.' },
  { id: 'users', label: 'Users', icon: 'users', roles: ['superadmin'], desc: 'Staff and guest accounts.' },
];
