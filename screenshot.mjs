import { spawn } from 'node:child_process';
import { mkdir, mkdtemp, readdir, rm } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { tmpdir } from 'node:os';
import { fileURLToPath } from 'node:url';

const root = dirname(fileURLToPath(import.meta.url));
const chrome = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const outDir = join(root, 'temporary screenshots');
const baseUrl = process.argv[2] || 'http://localhost:3017';
const label = process.argv[3] || 'desktop';

await mkdir(outDir, { recursive: true });
const files = await readdir(outDir).catch(() => []);
const numbers = files
  .map((file) => Number(file.match(/screenshot-(\d+)/)?.[1]))
  .filter(Number.isFinite);
const next = numbers.length ? Math.max(...numbers) + 1 : 1;
const name = `screenshot-${next}-${label}.png`;
const outPath = join(outDir, name);
const profile = await mkdtemp(join(tmpdir(), 'envision-desktop-shot-'));

const child = spawn(
  chrome,
  [
    '--headless=new',
    '--disable-gpu',
    '--no-sandbox',
    `--user-data-dir=${profile}`,
    '--hide-scrollbars',
    '--window-size=1440,900',
    '--virtual-time-budget=1400',
    `--screenshot=${outPath}`,
    baseUrl,
  ],
  { stdio: 'inherit' },
);

const code = await new Promise((resolve) => child.on('close', resolve));
await rm(profile, { recursive: true, force: true });
if (code !== 0) throw new Error(`Chrome screenshot failed with exit code ${code}`);
console.log(`Screenshot saved: ${name}`);
