import assert from 'node:assert/strict';
import test from 'node:test';
import { indexByName, isEnabled, resolveFlags, rolloutFor } from '../src/index.js';

test('resolveFlags merges overrides over defaults', () => {
  const flags = resolveFlags({ newCheckout: { enabled: true } });
  assert.equal(flags.newCheckout.enabled, true);
  assert.equal(flags.newCheckout.rollout, 0);
  assert.equal(flags.auditLog.enabled, true);
});

test('isEnabled is false for unknown flags', () => {
  assert.equal(isEnabled(resolveFlags({}), 'nope'), false);
  assert.equal(isEnabled(resolveFlags({}), 'auditLog'), true);
});

test('rolloutFor reads the nested rollout', () => {
  assert.equal(rolloutFor(resolveFlags({ newCheckout: { rollout: 25 } }), 'newCheckout'), 25);
  assert.equal(rolloutFor(resolveFlags({}), 'missing'), 0);
});

test('indexByName keys a flag list', () => {
  const byName = indexByName([{ name: 'a' }, { name: 'b' }]);
  assert.deepEqual(Object.keys(byName), ['a', 'b']);
});
