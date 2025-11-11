import assert from 'assert';
import { percentDiff, allocatePool, applyBank } from './algorithms';

// percentDiff
assert.strictEqual(Math.round(percentDiff(100, 50)), 100);
assert.strictEqual(Math.round(percentDiff(50, 100)), -50);

// allocatePool
const members = [
  { routeId: 'A', cb_before: 100 },
  { routeId: 'B', cb_before: -60 },
  { routeId: 'C', cb_before: -20 },
];
const out = allocatePool(members as any);
const sumBefore = members.reduce((s, m) => s + m.cb_before, 0);
const sumAfter = out.reduce((s: any, m: any) => s + (m.cb_after || 0), 0);
assert.strictEqual(sumBefore, sumAfter);
const b = out.find((o: any) => o.routeId === 'B');
const c = out.find((o: any) => o.routeId === 'C');
assert.ok(b, 'member B not found');
assert.ok(c, 'member C not found');
// deficits should be improved (less negative)
assert.ok((b!.cb_after as number) >= -60);
assert.ok((c!.cb_after as number) >= -20);

// applyBank
const ledger: Record<string, number> = { A: 50 };
const res = applyBank(ledger, 'A', 'B', 30);
assert.strictEqual(res.applied, 30);
assert.strictEqual(ledger.A, 20);

console.log('algorithms tests ok');
