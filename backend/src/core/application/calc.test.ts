import assert from 'assert';
import { energyMJ, complianceBalance, TARGET } from './calc';

assert.strictEqual(energyMJ(1), 41000);
// route-like object
const route: any = { fuelConsumption: 100, ghgIntensity: 90 };
const cb = complianceBalance(route);
// (TARGET - 90) * 100 * 41000
const expected = (TARGET - 90) * 100 * 41000;
assert.strictEqual(cb, expected);
console.log('calc tests ok');
