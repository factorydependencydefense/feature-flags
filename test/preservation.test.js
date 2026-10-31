import assert from 'node:assert/strict';
import test from 'node:test';
import { indexByName, isEnabled, resolveFlags, rolloutFor } from '../src/index.js';

test('resolveFlags returns the whole resolved flag set', () => {
  assert.deepEqual(resolveFlags({ newCheckout: { enabled: true } }), {
    newCheckout: { enabled: true, rollout: 0 },
    auditLog: { enabled: true, rollout: 100 },
  });
});

test('resolveFlags with no overrides returns the defaults', () => {
  assert.deepEqual(resolveFlags({}), {
    newCheckout: { enabled: false, rollout: 0 },
    auditLog: { enabled: true, rollout: 100 },
  });
});

test('resolveFlags does not let one call leak into the next', () => {
  resolveFlags({ newCheckout: { enabled: true, rollout: 100 }, auditLog: { enabled: false } });
  assert.deepEqual(resolveFlags({}), {
    newCheckout: { enabled: false, rollout: 0 },
    auditLog: { enabled: true, rollout: 100 },
  });
});

test('isEnabled reads the nested enabled flag with a false fallback', () => {
  const flags = resolveFlags({ newCheckout: { enabled: true } });
  assert.equal(isEnabled(flags, 'newCheckout'), true);
  assert.equal(isEnabled(flags, 'auditLog'), true);
  assert.equal(isEnabled(flags, 'missing'), false);
});

test('rolloutFor reads the nested rollout with a zero fallback', () => {
  const flags = resolveFlags({ newCheckout: { rollout: 25 } });
  assert.equal(rolloutFor(flags, 'newCheckout'), 25);
  assert.equal(rolloutFor(flags, 'auditLog'), 100);
  assert.equal(rolloutFor(flags, 'missing'), 0);
});

test('indexByName keys a flag list by name', () => {
  assert.deepEqual(indexByName([{ name: 'a', rollout: 1 }, { name: 'b', rollout: 2 }]), {
    a: { name: 'a', rollout: 1 },
    b: { name: 'b', rollout: 2 },
  });
});
