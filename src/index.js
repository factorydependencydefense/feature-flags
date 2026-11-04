import get from '@factorydependencydefense/lodash-lite/get.js';
import keyBy from '@factorydependencydefense/lodash-lite/keyBy.js';
import merge from '@factorydependencydefense/lodash-lite/merge.js';

const defaults = {
  newCheckout: { enabled: false, rollout: 0 },
  auditLog: { enabled: true, rollout: 100 },
};

export function resolveFlags(environmentOverrides) {
  return merge({}, defaults, environmentOverrides);
}

export function isEnabled(flags, name) {
  return get(flags, [name, 'enabled'], false) === true;
}

export function indexByName(flagList) {
  return keyBy(flagList, 'name');
}

export function rolloutFor(flags, name) {
  return get(flags, [name, 'rollout'], 0);
}
