import { describe, expect, it } from 'vitest';
import { invoiceOf, nights, propose, stdWindow } from './data.js';

const stay = (id, rank, room, from, to, category = 'Training') => ({ id, rank, room, from, to, category, status: 'Confirmed' });
describe('allocation rules', () => {
  it('gives VIPs a suite first', () => expect(propose(stay('n', 'High Court Judge', null, '2026-10-02', '2026-10-04', 'VIP'), [])).toBe('S1'));
  it('lets two guests of the same rank share', () =>
    expect(propose(stay('n', 'District Judge', null, '2026-10-02', '2026-10-04'), [stay('x', 'District Judge', '101', '2026-10-01', '2026-10-05')])).toBe('101'));
  it('never pairs different ranks', () =>
    expect(propose(stay('n', 'District Judge', null, '2026-10-02', '2026-10-04'), [stay('x', 'Civil Judge', '101', '2026-10-01', '2026-10-05')])).toBe('102'));
  it('blocks overlapping dates in a one-bed suite', () => {
    const taken = [stay('x', 'High Court Judge', 'S1', '2026-10-01', '2026-10-05', 'VIP')];
    expect(propose(stay('n', 'High Court Judge', null, '2026-10-03', '2026-10-06', 'VIP'), taken)).toBe('S2');
    expect(propose(stay('n', 'High Court Judge', null, '2026-10-05', '2026-10-08', 'VIP'), taken)).toBe('S1');
  });
});
describe('stay and billing rules', () => {
  it('bills nights x the rate applied at check-out', () => expect(invoiceOf({ id: 'B5', actualIn: '2026-09-12', actualOut: '2026-09-14', rateApplied: 1200 }, 0)).toMatchObject({ no: 'INV-0005', nights: 2, total: 2400 }));
  it('charges at least one night', () => expect(nights('2026-10-01', '2026-10-01')).toBe(1));
  it('sets the training window from the day before to the day after', () => expect(stdWindow({ start: '2026-10-07', end: '2026-10-09' })).toEqual({ from: '2026-10-06', to: '2026-10-10' }));
});
