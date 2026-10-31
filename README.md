# feature-flags

Feature flag resolution with per-environment overrides. Part of the dependency-defense demo fleet.

```bash
npm ci
npm test
npm run build
```

## Tests

`npm test` runs `test/*.test.js`: `test/flags.test.js` plus `test/preservation.test.js`, which pin the
whole resolved flag set for `resolveFlags`, `isEnabled`, `rolloutFor` and `indexByName` with
legitimate inputs. They must stay green across a lodash upgrade, so a remediation PR can use them as
proof it changed no behaviour.

There is no characterization suite here, because no vulnerable behaviour is observable through this
package's API (see below).

`npm run test:security` runs `test/security/**/*.test.js` and is deliberately **not** part of
`npm test`. It asserts that untrusted environment overrides cannot reach `Object.prototype`.

All 4 security tests are **green today**. `resolveFlags` calls `merge({}, defaults, overrides)`, and
the pinned lodash only walks into `Object.prototype` through a `constructor.prototype` payload when
the untrusted source is the *first* source. Here it is the second, so the payload is contained as an
own `constructor` key on the result instead. The advisory is real for the pinned lodash version but
is not reachable through this API; these tests exist to document the invariant and catch a regression
if the call shape changes.

What these tests do **not** cover: the planted unused dependencies (`dayjs`, `left-pad`), the bundled
`dist/index.js`, dynamic `require`, and any network or filesystem path.
