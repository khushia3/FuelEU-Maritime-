import express from 'express';
import { getRoutes, setBaseline } from '../../outbound/inmem';
import { TARGET } from '../../../core/application/calc';

const router = express.Router();

router.get('/', (req, res) => {
  const all = getRoutes();
  res.json(all);
});

router.post('/:id/baseline', (req, res) => {
  const updated = setBaseline(req.params.id);
  if(!updated) return res.status(404).json({error:'route not found'});
  res.json(updated);
});

router.get('/comparison', (req, res) => {
  const all = getRoutes();
  const baseline = all.find(r => r.isBaseline);
  if(!baseline) return res.status(400).json({error:'no baseline set'});
  const rows = all.filter(r => r.id !== baseline.id).map(r => {
    const percentDiff = ((r.ghgIntensity / baseline.ghgIntensity) - 1) * 100;
    return { 
      routeId: r.routeId,
      baseline: baseline.ghgIntensity,
      comparison: r.ghgIntensity,
      percentDiff,
      compliant: r.ghgIntensity <= TARGET
    };
  });
  res.json({ target: TARGET, baselineId: baseline.routeId, rows });
});

export default router;
