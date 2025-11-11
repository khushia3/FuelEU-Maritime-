import request from 'supertest';
import app from '../../src/infrastructure/server';

(async () => {
  // GET /routes
  const r = await request(app).get('/routes').expect(200);
  if (!Array.isArray(r.body)) throw new Error('/routes did not return an array');
  if (r.body.length < 1) throw new Error('expected seed routes');

  // POST /routes/:id/baseline (set baseline to id '2')
  const set = await request(app).post('/routes/2/baseline').expect(200);
  if (!set.body.ok) throw new Error('set baseline failed');
  if (set.body.route.id !== '2') throw new Error('baseline id mismatch');

  // GET /compliance/cb?routeId=R001
  const cb = await request(app).get('/compliance/cb').query({ routeId: 'R001' }).expect(200);
  if (typeof cb.body.cb !== 'number') throw new Error('cb missing or not a number');

  console.log('integration tests ok');
})();
