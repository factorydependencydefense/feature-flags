import assert from 'node:assert/strict';
import test from 'node:test';
import { indexByName, resolveFlags } from '../../src/index.js';

test('resolveFlags must not let a constructor.prototype override reach Object.prototype', () => {
  try {
    resolveFlags(JSON.parse('{"constructor":{"prototype":{"ffSecTopLevel":"PWN"}}}'));
    assert.equal({}.ffSecTopLevel, undefined);
  } finally {
    delete Object.prototype.ffSecTopLevel;
  }
});

test('resolveFlags must not let a constructor.prototype override nested under a known flag reach Object.prototype', () => {
  try {
    resolveFlags(JSON.parse('{"newCheckout":{"constructor":{"prototype":{"ffSecNested":"PWN"}}}}'));
    assert.equal({}.ffSecNested, undefined);
  } finally {
    delete Object.prototype.ffSecNested;
  }
});

test('resolveFlags must not let a __proto__ override reach Object.prototype', () => {
  try {
    resolveFlags(JSON.parse('{"__proto__":{"ffSecProtoKey":"PWN"}}'));
    assert.equal({}.ffSecProtoKey, undefined);
  } finally {
    delete Object.prototype.ffSecProtoKey;
  }
});

test('indexByName must not let a __proto__ flag name reach Object.prototype', () => {
  try {
    indexByName(JSON.parse('[{"name":"__proto__","ffSecKeyBy":"PWN"}]'));
    assert.equal({}.ffSecKeyBy, undefined);
  } finally {
    delete Object.prototype.ffSecKeyBy;
  }
});
