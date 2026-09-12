import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const root = new URL('../', import.meta.url);
const config = JSON.parse(readFileSync(new URL('vercel.json', root), 'utf8'));
const canonicalOrigin = 'https://envisionlandscapingllc.com';
const [hostRule, ...legacyRules] = config.redirects;

// Configuration contract only: the local static server does not emulate Vercel.
// Actual host matching, TLS and redirect responses require deployment readback.
assert.deepEqual(hostRule, {
  source: '/:path*',
  has: [{ type: 'host', value: 'www.envisionlandscapingllc.com' }],
  destination: `${canonicalOrigin}/:path*`,
  permanent: true,
});
assert.equal(config.cleanUrls, true);
assert.equal(config.trailingSlash, false);
assert.equal(legacyRules.length, 16, 'Preserve the existing legacy redirect inventory');
assert.equal(new Set(legacyRules.map(rule => rule.source)).size, legacyRules.length);

for (const rule of legacyRules) {
  assert.equal(rule.permanent, true, rule.source);
  assert.ok(rule.source.startsWith('/'), rule.source);
  assert.ok(rule.destination.startsWith('/'), rule.source);
  const destination = new URL(rule.destination, canonicalOrigin);
  assert.equal(destination.origin, canonicalOrigin);
  assert.notEqual(destination.pathname, rule.source, `Redirect loop: ${rule.source}`);
  assert.ok(!legacyRules.some(next => next.source === destination.pathname), `Legacy redirect chain: ${rule.source}`);
  const pagePath = destination.pathname === '/' ? 'index.html' : `${destination.pathname.slice(1)}.html`;
  assert.ok(existsSync(fileURLToPath(new URL(pagePath, root))), `Missing destination: ${pagePath}`);
}

assert.equal(
  legacyRules.find(rule => rule.source === '/services/holiday-lighting')?.destination,
  '/services/christmas-light-installation',
);
for (const source of ['/services/commercial-lawn-care', '/services/commercial-lawn-care-services', '/services/hardscaping-pavers']) {
  assert.equal(legacyRules.find(rule => rule.source === source)?.destination, '/services');
}

console.log('Redirect configuration passed: exact www host, canonical destination, and 16 legacy routes. DNS/TLS/live edge behavior not tested.');
