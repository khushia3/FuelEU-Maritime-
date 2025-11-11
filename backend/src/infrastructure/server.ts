import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import routesRouter from '../adapters/inbound/http/routes';
import complianceRouter from '../adapters/inbound/http/compliance';
import bankingRouter from '../adapters/inbound/http/banking';
import poolsRouter from '../adapters/inbound/http/pools';

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.use('/routes', routesRouter); // also handles /comparison endpoints
app.use('/compliance', complianceRouter);
app.use('/banking', bankingRouter);
app.use('/pools', poolsRouter);

const PORT = process.env.PORT || 4000;

// start server when run directly
if (require.main === module) {
	app.listen(PORT, () => console.log('Backend running on', PORT));
}

export default app;
