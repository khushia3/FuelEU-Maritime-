import express from 'express';
import { getRoutes } from '../../outbound/inmem';
import { complianceBalance } from '../../../core/application/calc';
import { allocatePool } from '../../../core/application/algorithms';

const router = express.Router();

// Simple greedy pool allocator
router.post('/', (req, res) => {
  const { members } = req.body; // [{routeId, cb_before}]
  if(!Array.isArray(members)) return res.status(400).json({error:'members required'});
  // compute sum
  const sum = members.reduce((s: any, m: any) => s + Number(m.cb_before), 0);
  if (sum < 0) return res.status(400).json({ error: 'pool sum negative' });
  const clones = allocatePool(members);
  // Validate rules: deficit cannot exit worse, surplus cannot exit negative
  for (const orig of members) {
    const after = clones.find(c => c.routeId === orig.routeId)!.cb_after;
    if (orig.cb_before < 0 && after! < orig.cb_before) return res.status(400).json({ error: 'deficit ship worsened' });
    if (orig.cb_before > 0 && after! < 0) return res.status(400).json({ error: 'surplus became negative' });
  }
  res.json({ ok: true, sum, members: clones });
});

export default router;
