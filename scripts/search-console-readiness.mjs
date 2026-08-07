#!/usr/bin/env node

import { homedir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { mkdir, readFile, writeFile } from 'node:fs/promises';

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const outputPath = join(root, 'data', 'search-console-readiness.json');
const sharedGoogleManagerEnv = join(
  homedir(),
  'Desktop',
  'S4 AI Agency',
  'S4 AI LLC',
  'Client Database',
  'Mayberry Pressure Washing LLC',
  'site',
  '.env.local',
);
const envPaths = [
  join(root, '.env.local'),
  join(homedir(), '.hermes', '.env'),
  sharedGoogleManagerEnv,
];
const propertyCandidates = [
  'sc-domain:envisionlandscapingllc.com',
  'https://envisionlandscapingllc.com/',
  'https://www.envisionlandscapingllc.com/',
];
const prepareVerification = process.argv.includes('--prepare-verification');

for (const envPath of envPaths) await loadDotEnv(envPath);

async function loadDotEnv(path) {
  try {
    const raw = await readFile(path, 'utf8');
    for (const line of raw.split(/\r?\n/)) {
      const match = line.trim().match(/^([A-Za-z_][A-Za-z0-9_]*)=(.*)$/);
      if (!match || process.env[match[1]] !== undefined) continue;
      process.env[match[1]] = match[2].replace(/^['"]|['"]$/g, '');
    }
  } catch (error) {
    if (error?.code !== 'ENOENT') throw error;
  }
}

async function fetchJson(url, options = {}) {
  const response = await fetch(url, options);
  const body = await response.text();
  if (!response.ok) {
    throw new Error(`Search Console request failed (${response.status}).`);
  }
  return body ? JSON.parse(body) : {};
}

async function accessToken() {
  const body = new URLSearchParams({
    client_id: process.env.GOOGLE_OAUTH_CLIENT_ID || '',
    client_secret: process.env.GOOGLE_OAUTH_CLIENT_SECRET || '',
    refresh_token: process.env.GOOGLE_OAUTH_REFRESH_TOKEN || '',
    grant_type: 'refresh_token',
  });
  if ([...body.values()].some((value) => !value)) {
    throw new Error('Google OAuth credentials are not configured for the S4 manager account.');
  }
  const payload = await fetchJson('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    body,
  });
  return payload.access_token;
}

function isoDate(daysAgo) {
  const date = new Date();
  date.setUTCDate(date.getUTCDate() - daysAgo);
  return date.toISOString().slice(0, 10);
}

async function querySearch(token, propertyUrl, dimensions = []) {
  return fetchJson(
    `https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(propertyUrl)}/searchAnalytics/query`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        startDate: isoDate(31),
        endDate: isoDate(3),
        dimensions,
        rowLimit: 25,
        dataState: 'all',
      }),
    },
  );
}

async function run() {
  const token = await accessToken();
  const headers = { Authorization: `Bearer ${token}` };
  let verificationFile = null;

  if (prepareVerification) {
    const payload = await fetchJson('https://www.googleapis.com/siteVerification/v1/token', {
      method: 'POST',
      headers: { ...headers, 'content-type': 'application/json' },
      body: JSON.stringify({
        site: { type: 'SITE', identifier: 'https://envisionlandscapingllc.com/' },
        verificationMethod: 'FILE',
      }),
    });
    const fileName = String(payload.token || '');
    if (!/^google[A-Za-z0-9_-]+\.html$/.test(fileName)) {
      throw new Error('Google returned an invalid site-verification filename.');
    }
    await writeFile(
      join(root, fileName),
      `google-site-verification: ${fileName}\n`,
    );
    verificationFile = fileName;
  }

  const sites = await fetchJson('https://www.googleapis.com/webmasters/v3/sites', { headers });
  const matchingSites = (sites.siteEntry || []).filter((entry) =>
    propertyCandidates.includes(entry.siteUrl),
  );
  const property = matchingSites[0] || null;

  const report = {
    checkedAt: new Date().toISOString(),
    status: property ? 'connected' : 'needs-verification',
    recommendedProperty: propertyCandidates[0],
    property: property
      ? { siteUrl: property.siteUrl, permissionLevel: property.permissionLevel }
      : null,
    sitemapUrl: 'https://envisionlandscapingllc.com/sitemap.xml',
    verificationFile,
    sitemaps: [],
    performance: null,
  };

  if (property) {
    const encodedProperty = encodeURIComponent(property.siteUrl);
    const [sitemaps, totals, queries, pages] = await Promise.all([
      fetchJson(`https://www.googleapis.com/webmasters/v3/sites/${encodedProperty}/sitemaps`, {
        headers,
      }),
      querySearch(token, property.siteUrl),
      querySearch(token, property.siteUrl, ['query']),
      querySearch(token, property.siteUrl, ['page']),
    ]);
    report.sitemaps = (sitemaps.sitemap || []).map((item) => ({
      path: item.path,
      lastSubmitted: item.lastSubmitted || null,
      isPending: Boolean(item.isPending),
      errors: Number(item.errors || 0),
      warnings: Number(item.warnings || 0),
    }));
    report.performance = {
      period: { startDate: isoDate(31), endDate: isoDate(3) },
      totals: (totals.rows || []).reduce(
        (sum, row) => ({
          clicks: sum.clicks + Number(row.clicks || 0),
          impressions: sum.impressions + Number(row.impressions || 0),
        }),
        { clicks: 0, impressions: 0 },
      ),
      topQueries: (queries.rows || []).map((row) => ({
        query: row.keys?.[0] || '',
        clicks: Number(row.clicks || 0),
        impressions: Number(row.impressions || 0),
        ctr: Number(row.ctr || 0),
        position: Number(row.position || 0),
      })),
      topPages: (pages.rows || []).map((row) => ({
        page: row.keys?.[0] || '',
        clicks: Number(row.clicks || 0),
        impressions: Number(row.impressions || 0),
        ctr: Number(row.ctr || 0),
        position: Number(row.position || 0),
      })),
    };
  }

  await mkdir(dirname(outputPath), { recursive: true });
  await writeFile(outputPath, `${JSON.stringify(report, null, 2)}\n`);
  console.log(
    property
      ? `Search Console connected: ${property.siteUrl} (${property.permissionLevel}).`
      : `Search Console needs verification for ${report.recommendedProperty}${verificationFile ? `; prepared ${verificationFile}` : ''}.`,
  );
}

await run();
