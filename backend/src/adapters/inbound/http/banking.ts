import express from 'express';
import { getRoutes } from '../../outbound/inmem';
import { complianceBalance } from '../../../core/application/calc';

const router = express.Router();

// In-memory bank ledger per routeId
const bankLedger: Record<string, number> = {};

router.get('/records', (req, res) => {
  const { routeId, year } = req.query;
  const balance = bankLedger[String(routeId)] || 0;
  res.json({ routeId, year, banked: balance });
});

router.post('/bank', (req, res) => {
  const { routeId, amount } = req.body;
  const available = complianceBalance(getRoutes().find(r => r.routeId === routeId)!);
  if(available <= 0) return res.status(400).json({error:'no positive CB to bank'});
  const amt = Number(amount) || available;
  bankLedger[routeId] = (bankLedger[routeId] || 0) + amt;
  res.json({ ok:true, routeId, banked: bankLedger[routeId] });
});

router.post('/apply', (req, res) => {
  const { fromRouteId, toRouteId, amount } = req.body;
  const avail = bankLedger[fromRouteId] || 0;
  const amt = Number(amount);
  if(amt > avail) return res.status(400).json({error:'amount exceeds banked'});
  bankLedger[fromRouteId] = avail - amt;
  // For demo we won't modify other records; return kpi-like object
  const cb_before = complianceBalance(getRoutes().find(r => r.routeId === toRouteId)!);
  const applied = amt;
  const cb_after = cb_before + applied;
  res.json({ ok:true, fromRouteId, toRouteId, cb_before, applied, cb_after });
});

export default router;
