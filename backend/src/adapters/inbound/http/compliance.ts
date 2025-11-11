import express from 'express';
import { getRoutes } from '../../outbound/inmem';
import { complianceBalance } from '../../../core/application/calc';

const router = express.Router();

// compute cb for a ship (by routeId) and year
router.get('/cb', (req, res) => {
  const { routeId, year } = req.query;
  const all = getRoutes();
  const route = all.find(r => r.routeId === routeId && (!year || String(r.year) === String(year)));
  if(!route) return res.status(404).json({error:'not found'});
  const cb = complianceBalance(route);
  res.json({ routeId: route.routeId, year: route.year, cb });
});

// adjusted-cb returns per-ship simple adjusted value (mocked: here same as cb)
router.get('/adjusted-cb', (req, res) => {
  const { year } = req.query;
  const all = getRoutes().filter(r => !year || String(r.year) === String(year));
  const rows = all.map(r => ({ routeId: r.routeId, cb_before: complianceBalance(r), cb_after: complianceBalance(r) }));
  res.json({ year: year || 'all', rows });
});

export default router;
