import { Route } from '../domain/types';

export function percentDiff(comparison: number, baseline: number) {
  return ((comparison / baseline) - 1) * 100;
}

type Member = { routeId: string; cb_before: number; cb_after?: number };

// Greedy pool allocator — returns clones with cb_after
export function allocatePool(members: Member[]) {
  const clones = members.map(m => ({ ...m, cb_after: Number(m.cb_before) }));
  const surplus = clones.filter(c => c.cb_after! > 0).sort((a, b) => (b.cb_after! - a.cb_after!));
  const deficit = clones.filter(c => c.cb_after! < 0).sort((a, b) => (a.cb_after! - b.cb_after!));
  for (const s of surplus) {
    for (const d of deficit) {
      if ((s.cb_after || 0) <= 0) break;
      const need = Math.abs(d.cb_after || 0);
      const transfer = Math.min(s.cb_after || 0, need);
      s.cb_after = (s.cb_after || 0) - transfer;
      d.cb_after = (d.cb_after || 0) + transfer;
    }
  }
  return clones;
}

// Simple bank apply: takes ledger and performs apply if available
export function applyBank(ledger: Record<string, number>, fromId: string, toId: string, amount: number) {
  const avail = ledger[fromId] || 0;
  if (amount > avail) throw new Error('amount exceeds banked');
  ledger[fromId] = avail - amount;
  ledger[toId] = (ledger[toId] || 0) + 0; // no ledger change on to in this simple model
  return { fromId, toId, applied: amount };
}

// small helper to compute compliance balance from route
export function complianceBalanceFromRoute(route: Route, target: number) {
  const energy = route.fuelConsumption * 41000;
  return (target - route.ghgIntensity) * energy;
}
