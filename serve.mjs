import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { extname, join, normalize } from 'node:path';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = dirname(fileURLToPath(import.meta.url));
const port = Number(process.env.ENVISION_PORT || 3017);

const mime = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.mjs': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
  '.txt': 'text/plain; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8',
};

createServer(async (request, response) => {
  try {
    const rawPath = decodeURIComponent((request.url || '/').split('?')[0]);
    let pathname = rawPath === '/' ? '/index.html' : rawPath.replace(/\/+$/, '');
    if (!extname(pathname)) pathname += '.html';

    const safePath = normalize(pathname).replace(/^(\.\.[/\\])+/, '');
    const filePath = join(root, safePath);
    if (!filePath.startsWith(root)) throw new Error('Invalid path');

    const body = await readFile(filePath);
    response.writeHead(200, {
      'Content-Type': mime[extname(filePath).toLowerCase()] || 'application/octet-stream',
      'Cache-Control': 'no-store',
    });
    response.end(body);
  } catch {
    try {
      const body = await readFile(join(root, '404.html'));
      response.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
      response.end(body);
    } catch {
      response.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      response.end('Not found');
    }
  }
}).listen(port, '127.0.0.1', () => {
  console.log(`Envision Landscaping site: http://localhost:${port}`);
});
