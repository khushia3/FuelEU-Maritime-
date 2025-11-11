import express from 'express';
import { PrismaClient } from '@prisma/client';
import { 
  createRouteController,
  createComplianceController,
  createBankingController,
  createPoolController
} from '../../adapters/inbound/http/controllers';
import {
  PostgresRouteRepository,
  PostgresComplianceRepository,
  PostgresBankingRepository,
  PostgresPoolRepository
} from '../../adapters/outbound/postgres/repositories';

const app = express();
const prisma = new PrismaClient();

// Middleware
app.use(express.json());

// Initialize repositories
const routeRepo = new PostgresRouteRepository(prisma);
const complianceRepo = new PostgresComplianceRepository(prisma);
const bankingRepo = new PostgresBankingRepository(prisma);
const poolRepo = new PostgresPoolRepository(prisma);

// Mount controllers
app.use('/routes', createRouteController(routeRepo));
app.use('/compliance', createComplianceController(complianceRepo));
app.use('/banking', createBankingController(bankingRepo));
app.use('/pools', createPoolController(poolRepo));

// Error handling
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error' });
});

const PORT = process.env.PORT || 3000;

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});