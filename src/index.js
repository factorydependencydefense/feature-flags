import get from 'lodash/get.js';
import keyBy from 'lodash/keyBy.js';
import merge from 'lodash/merge.js';

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
