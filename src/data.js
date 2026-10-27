// Mock data + allocation rules. Replace with REST calls to the NestJS API later.
export const ROOMS = [
  { id: 'S1', type: 'Suite', beds: 1, tiers: ['Supreme Court Judge', 'High Court Judge', 'Faculty'] },
  { id: 'S2', type: 'Suite', beds: 1, tiers: ['Supreme Court Judge', 'High Court Judge', 'Faculty'] },
  { id: '101', type: 'Standard', beds: 2, tiers: ['District Judge'] },
  { id: '102', type: 'Standard', beds: 2, tiers: ['District Judge', 'Civil Judge'] },
  { id: '103', type: 'Standard', beds: 2, tiers: ['Civil Judge'] },
];
export const seedBookings = [
  { id: 'B1', name: 'Hon. A. Sharma', rank: 'High Court Judge', category: 'VIP', from: '2026-10-05', to: '2026-10-07', companions: [], status: 'Pending', room: null },
  { id: 'B2', name: 'R. Menon', rank: 'District Judge', category: 'Training', sessionId: 'T1', from: '2026-10-06', to: '2026-10-10', companions: [], status: 'Pending', room: null },
  { id: 'B3', name: 'K. Iyer', rank: 'District Judge', category: 'Training', sessionId: 'T1', from: '2026-10-06', to: '2026-10-10', companions: [], status: 'Pending', room: null },
  { id: 'B4', name: 'P. Das', rank: 'Civil Judge', category: 'Non-Training', from: '2026-10-04', to: '2026-10-06', companions: [], status: 'Confirmed', room: '103' },
  { id: 'B5', name: 'S. Nair', rank: 'District Judge', category: 'Non-Training', from: '2026-09-12', to: '2026-09-14', companions: [], status: 'Checked-out', room: '101', actualIn: '2026-09-12', actualOut: '2026-09-14', rateApplied: 1200 },
  { id: 'B6', name: 'L. George', rank: 'Civil Judge', category: 'Training', sessionId: 'T0', from: '2026-09-02', to: '2026-09-05', companions: [], status: 'Checked-out', room: '103', actualIn: '2026-09-02', actualOut: '2026-09-05' },
];
export const STATE_RATE = 1200; // per night, client-supplied reference data

// Pass the booking as 4th argument to count only stays whose dates overlap it.
export const occupants = (roomId, bookings, exceptId, w) =>
  bookings.filter((b) => b.room === roomId && ['Confirmed', 'Checked-in'].includes(b.status) && b.id !== exceptId && (!w || (b.from < w.to && w.from < b.to)));

// Rank-driven proposal: VIPs try suites first; sharing only with the exact same rank.
export function propose(b, bookings) {
  const fits = ROOMS.filter((r) => {
    if (!r.tiers.includes(b.rank)) return false;
    const occ = occupants(r.id, bookings, b.id, b);
    return occ.length < r.beds && occ.every((o) => o.rank === b.rank);
  });
  fits.sort((a, c) => (b.category === 'VIP' ? (a.type === 'Suite' ? -1 : 1) - (c.type === 'Suite' ? -1 : 1) : 0));
  return fits[0]?.id ?? null;
}
export const nights = (f, t) => Math.max(1, Math.round((new Date(t) - new Date(f)) / 864e5));
export const RANKS = ['Supreme Court Judge', 'High Court Judge', 'Faculty', 'District Judge', 'Civil Judge'];
export const invoiceOf = (b, rate) => {
  const n = nights(b.actualIn || b.from, b.actualOut || b.to), r = b.rateApplied ?? rate;
  return { no: 'INV-' + b.id.slice(1).padStart(4, '0'), nights: n, rate: r, total: n * r };
};
export const SESSIONS = [{ id: 'T1', title: 'Judicial Skills Workshop', start: '2026-10-07', end: '2026-10-09' }];
const addDays = (d, n) => new Date(new Date(d).getTime() + n * 864e5).toISOString().slice(0, 10);
// Standard window: from the day before training begins to the day after it ends.
export const stdWindow = (s) => ({ from: addDays(s.start, -1), to: addDays(s.end, 1) });
