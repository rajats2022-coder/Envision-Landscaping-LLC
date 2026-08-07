import { spawn } from 'node:child_process';
import { mkdir, mkdtemp, readdir, rm, writeFile } from 'node:fs/promises';
import { createServer } from 'node:net';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = dirname(fileURLToPath(import.meta.url));
const chrome = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const outDir = join(root, 'temporary screenshots');
const baseUrl = process.argv[2] || 'http://localhost:3017';
const label = process.argv[3] || 'mobile';

await mkdir(outDir, { recursive: true });
const files = await readdir(outDir).catch(() => []);
const numbers = files
  .map((file) => Number(file.match(/screenshot-(\d+)/)?.[1]))
  .filter(Number.isFinite);
const next = numbers.length ? Math.max(...numbers) + 1 : 1;
const name = `screenshot-${next}-${label}.png`;
const outPath = join(outDir, name);
const profile = await mkdtemp(join(tmpdir(), 'envision-mobile-shot-'));

const debugPort = await new Promise((resolve, reject) => {
  const server = createServer();
  server.on('error', reject);
  server.listen(0, '127.0.0.1', () => {
    const address = server.address();
    server.close(() => resolve(address.port));
  });
});

const child = spawn(
  chrome,
  [
    '--headless=new',
    '--disable-gpu',
    '--disable-extensions',
    '--no-first-run',
    '--no-sandbox',
    `--remote-debugging-port=${debugPort}`,
    '--remote-allow-origins=*',
    `--user-data-dir=${profile}`,
    'about:blank',
  ],
  { stdio: 'ignore' },
);

const send = (() => {
  let nextId = 0;
  const pending = new Map();
  let socket;

  const connect = async (url) => {
    socket = new WebSocket(url);
    await new Promise((resolve, reject) => {
      socket.addEventListener('open', resolve, { once: true });
      socket.addEventListener('error', reject, { once: true });
    });
    socket.addEventListener('message', (event) => {
      const message = JSON.parse(event.data);
      if (!message.id || !pending.has(message.id)) return;
      const { resolve, reject } = pending.get(message.id);
      pending.delete(message.id);
      if (message.error) reject(new Error(message.error.message));
      else resolve(message.result);
    });
    return socket;
  };

  const command = (method, params = {}) =>
    new Promise((resolve, reject) => {
      const id = (nextId += 1);
      pending.set(id, { resolve, reject });
      socket.send(JSON.stringify({ id, method, params }));
    });

  command.connect = connect;
  command.close = () => socket?.close();
  return command;
})();

try {
  let target;
  for (let attempt = 0; attempt < 50; attempt += 1) {
    try {
      const targets = await fetch(`http://127.0.0.1:${debugPort}/json/list`).then((response) =>
        response.json(),
      );
      target = targets.find((candidate) => candidate.type === 'page');
      if (target) break;
    } catch {}
    await new Promise((resolve) => setTimeout(resolve, 100));
  }

  if (!target) throw new Error('Chrome DevTools did not become ready');

  await send.connect(target.webSocketDebuggerUrl);
  await send('Page.enable');
  await send('Emulation.setDeviceMetricsOverride', {
    width: 430,
    height: 932,
    deviceScaleFactor: 1,
    mobile: true,
    screenWidth: 430,
    screenHeight: 932,
  });
  await send('Emulation.setUserAgentOverride', {
    userAgent:
      'Mozilla/5.0 (iPhone; CPU iPhone OS 19_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/19.0 Mobile/15E148 Safari/604.1',
  });
  await send('Page.navigate', { url: baseUrl });
  for (let attempt = 0; attempt < 40; attempt += 1) {
    const ready = await send('Runtime.evaluate', {
      expression:
        "document.readyState === 'complete' && getComputedStyle(document.querySelector('h1')).opacity === '1'",
      returnByValue: true,
    }).catch(() => null);
    if (ready?.result?.value === true) break;
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
  const pageHash = new URL(baseUrl).hash;
  if (!pageHash) {
    await send('Runtime.evaluate', { expression: 'window.scrollTo(0, 0)' });
  } else {
    await send('Runtime.evaluate', {
      expression: `(() => { const target = document.querySelector(${JSON.stringify(pageHash)}); if (target) { document.documentElement.style.scrollBehavior = 'auto'; window.scrollTo(0, target.getBoundingClientRect().top + window.scrollY); } })()`,
    });
    await new Promise((resolve) => setTimeout(resolve, 450));
    await send('Runtime.evaluate', {
      expression: `(() => { const target = document.querySelector(${JSON.stringify(pageHash)}); if (target) window.scrollTo(0, target.getBoundingClientRect().top + window.scrollY); })()`,
    });
  }
  await new Promise((resolve) => setTimeout(resolve, 350));

  const result = await send('Page.captureScreenshot', {
    format: 'png',
    fromSurface: true,
    captureBeyondViewport: false,
  });
  await writeFile(outPath, Buffer.from(result.data, 'base64'));
  console.log(`Screenshot saved: ${name}`);
} finally {
  send.close();
  child.kill('SIGTERM');
  await rm(profile, { recursive: true, force: true });
}
