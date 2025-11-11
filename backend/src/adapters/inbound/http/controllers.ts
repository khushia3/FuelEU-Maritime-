import express, { Request, Response } from 'express';
import { IRouteRepository, IComplianceRepository, IBankingRepository, IPoolRepository } from '../../../core/ports/repositories';
import { computeComplianceBalance, validatePoolAllocation, allocatePoolBalances } from '../../../core/application/compliance';

export function createRouteController(routeRepo: IRouteRepository) {
  const router = express.Router();

  router.get('/', async (req: Request, res: Response) => {
    const routes = await routeRepo.findAll();
    res.json(routes);
  });

  router.post('/:id/baseline', async (req: Request, res: Response) => {
    const { id } = req.params;
    const route = await routeRepo.setBaseline(id);
    res.json(route);
  });

  router.get('/comparison', async (req: Request, res: Response) => {
    const routes = await routeRepo.findAll();
    const baseline = routes.find(r => r.isBaseline);
    if (!baseline) {
      return res.status(400).json({ error: 'No baseline set' });
    }

    const target = 89.3368; // gCO₂e/MJ for 2025
    const comparisons = routes.map(route => ({
      routeId: route.routeId,
      baseline: baseline.ghgIntensity,
      comparison: route.ghgIntensity,
      percentDiff: ((route.ghgIntensity - baseline.ghgIntensity) / baseline.ghgIntensity) * 100,
      compliant: route.ghgIntensity <= target
    }));

    res.json({
      target,
      rows: comparisons
    });
  });

  return router;
}

export function createComplianceController(complianceRepo: IComplianceRepository) {
  const router = express.Router();

  router.get('/cb', async (req: Request, res: Response) => {
    const { shipId, year } = req.query;
    if (!shipId || !year) {
      return res.status(400).json({ error: 'Missing shipId or year' });
    }

    const balance = await complianceRepo.getBalance(
      String(shipId),
      Number(year)
    );
    res.json(balance || { shipId, year, cbGco2eq: 0 });
  });

  return router;
}

export function createBankingController(bankingRepo: IBankingRepository) {
  const router = express.Router();

  router.get('/records', async (req: Request, res: Response) => {
    const { shipId, year } = req.query;
    if (!shipId || !year) {
      return res.status(400).json({ error: 'Missing shipId or year' });
    }

    const entries = await bankingRepo.findByShipAndYear(
      String(shipId),
      Number(year)
    );

    const banked = entries.reduce((sum, e) => sum + e.amountGco2eq, 0);
    res.json({
      banked,
      available: banked,
      transactions: entries
    });
  });

  router.post('/bank', async (req: Request, res: Response) => {
    const { shipId, year, amount } = req.body;
    if (!shipId || !year || !amount) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const entry = await bankingRepo.createEntry({
      shipId,
      year,
      amountGco2eq: Number(amount)
    });
    res.json(entry);
  });

  return router;
}

export function createPoolController(poolRepo: IPoolRepository) {
  const router = express.Router();

  router.post('/', async (req: Request, res: Response) => {
    const { year, members } = req.body;
    if (!year || !members || !Array.isArray(members)) {
      return res.status(400).json({ error: 'Invalid request body' });
    }

    const totalCB = members.reduce((sum, m) => sum + m.cbBefore, 0);
    if (totalCB < 0) {
      return res.status(400).json({ error: 'Total CB must be non-negative' });
    }

    const allocatedMembers = allocatePoolBalances(members);
    const validation = validatePoolAllocation(allocatedMembers);

    if (!validation.valid) {
      return res.status(400).json({ error: validation.reason });
    }

    const pool = await poolRepo.create(year, allocatedMembers);
    res.json(pool);
  });

  return router;
}