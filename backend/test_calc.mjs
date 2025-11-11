import assert from 'assert';
import {fileURLToPath} from 'url';
const mod = await import('../src/core/application/calc.js');
assert.ok(mod.TARGET);
console.log('calc ok');
