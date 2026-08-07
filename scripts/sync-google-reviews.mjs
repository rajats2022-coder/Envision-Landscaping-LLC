#!/usr/bin/env node

import { homedir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { mkdir, readFile, writeFile } from 'node:fs/promises';

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const outputPath = join(root, 'data', 'google-reviews.json');
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

for (const envPath of envPaths) await loadDotEnv(envPath);

const accountId =
  process.env.ENVISION_GOOGLE_BUSINESS_PROFILE_ACCOUNT_ID ||
  '112847676151231508867';
const locationId =
  process.env.ENVISION_GOOGLE_BUSINESS_PROFILE_LOCATION_ID ||
  '635646874931218439';
const accountName = accountId.startsWith('accounts/')
  ? accountId
  : `accounts/${accountId}`;
const locationName = locationId.startsWith('accounts/')
  ? locationId
  : `${accountName}/${locationId.startsWith('locations/') ? locationId : `locations/${locationId}`}`;

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
    throw new Error(`Google Business Profile request failed (${response.status}).`);
  }
  return body ? JSON.parse(body) : {};
}

async function accessToken() {
  if (process.env.GOOGLE_BUSINESS_PROFILE_ACCESS_TOKEN) {
    return process.env.GOOGLE_BUSINESS_PROFILE_ACCESS_TOKEN;
  }

  const clientId = process.env.GOOGLE_OAUTH_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_OAUTH_CLIENT_SECRET;
  const refreshToken = process.env.GOOGLE_OAUTH_REFRESH_TOKEN;

  if (!clientId || !clientSecret || !refreshToken) {
    throw new Error('Google OAuth credentials are not configured for the S4 manager account.');
  }

  const payload = await fetchJson('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      refresh_token: refreshToken,
      grant_type: 'refresh_token',
    }),
  });
  return payload.access_token;
}

function ratingNumber(value) {
  if (typeof value === 'number') return value;
  return { ONE: 1, TWO: 2, THREE: 3, FOUR: 4, FIVE: 5 }[
    String(value || '').toUpperCase()
  ] || 5;
}

function normalize(review, index) {
  const author = review?.reviewer?.displayName || 'Google reviewer';
  return {
    id: review?.reviewId || `google-review-${index + 1}`,
    author,
    profilePhotoUrl: review?.reviewer?.profilePhotoUrl || null,
    rating: ratingNumber(review?.starRating),
    text: review?.comment || '',
    createTime: review?.createTime || null,
    updateTime: review?.updateTime || null,
  };
}

async function syncReviews() {
  const token = await accessToken();
  const headers = { Authorization: `Bearer ${token}` };
  const reviews = [];
  let pageToken = '';
  let rating = null;
  let reviewCount = null;

  do {
    const url = new URL(`https://mybusiness.googleapis.com/v4/${locationName}/reviews`);
    url.searchParams.set('pageSize', '50');
    url.searchParams.set('orderBy', 'updateTime desc');
    if (pageToken) url.searchParams.set('pageToken', pageToken);

    const payload = await fetchJson(url, { headers });
    rating ??= payload.averageRating ?? null;
    reviewCount ??= payload.totalReviewCount ?? null;
    reviews.push(...(payload.reviews || []));
    pageToken = payload.nextPageToken || '';
  } while (pageToken);

  const data = {
    source: 'google-business-profile',
    businessName: 'Envision Landscaping',
    locationName,
    rating: Number(rating || 0),
    reviewCount: Number(reviewCount || reviews.length),
    fetchedAt: new Date().toISOString(),
    reviews: reviews.map(normalize),
  };

  await mkdir(dirname(outputPath), { recursive: true });
  await writeFile(outputPath, `${JSON.stringify(data, null, 2)}\n`);
  console.log(
    `Synced ${data.reviews.length} of ${data.reviewCount} Google reviews for ${data.businessName} (${data.rating} average).`,
  );
}

await syncReviews();
