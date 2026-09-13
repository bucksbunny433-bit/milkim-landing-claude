#!/usr/bin/env node
/**
 * Static server for measurement.
 *
 * Exists for one reason: the budgets in CLAUDE.md section 4 are stated for
 * TRANSFERRED, COMPRESSED bytes, and the throwaway static servers on PATH do not
 * compress. Measuring against them overstates HTML and CSS by 4-5x and produces
 * failures that are not real - which is exactly what happened before this existed.
 *
 * Serves a directory with gzip on text types, the way real hosting does.
 *
 *   node .claude/skills/milkim-visual/scripts/serve.mjs dist 4173
 */

import { createServer } from 'node:http';
import { createReadStream, existsSync, statSync } from 'node:fs';
import { gzipSync } from 'node:zlib';
import { readFile } from 'node:fs/promises';
import path from 'node:path';

const root = path.resolve(process.argv[2] ?? 'dist');
const port = Number(process.argv[3] ?? 4173);

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.avif': 'image/avif',
  '.webp': 'image/webp',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.woff2': 'font/woff2',
  '.ico': 'image/x-icon',
  '.webmanifest': 'application/manifest+json',
  '.mp4': 'video/mp4',
  '.webm': 'video/webm',
};

// Compress what real hosting compresses. Fonts, images and video are already
// compressed - gzipping them wastes CPU and can make them larger.
const COMPRESSIBLE = new Set(['.html', '.css', '.js', '.mjs', '.json', '.svg', '.webmanifest']);

function resolve(urlPath) {
  const clean = decodeURIComponent(urlPath.split('?')[0]);
  // Never escape the root, whatever the request says.
  const candidate = path.join(root, path.normalize(clean).replace(/^(\.\.[/\\])+/, ''));
  if (!candidate.startsWith(root)) return null;
  if (existsSync(candidate) && statSync(candidate).isDirectory()) {
    return path.join(candidate, 'index.html');
  }
  if (existsSync(candidate)) return candidate;
  if (existsSync(`${candidate}.html`)) return `${candidate}.html`;
  return null;
}

createServer(async (req, res) => {
  const file = resolve(req.url ?? '/');
  if (!file || !existsSync(file)) {
    res.writeHead(404, { 'content-type': 'text/plain; charset=utf-8' });
    res.end('404');
    return;
  }

  const ext = path.extname(file).toLowerCase();
  const type = TYPES[ext] ?? 'application/octet-stream';
  const accepts = String(req.headers['accept-encoding'] ?? '').includes('gzip');

  if (COMPRESSIBLE.has(ext) && accepts) {
    const body = gzipSync(await readFile(file), { level: 9 });
    res.writeHead(200, {
      'content-type': type,
      'content-encoding': 'gzip',
      'content-length': body.length,
      'cache-control': 'no-store',
      vary: 'accept-encoding',
    });
    res.end(body);
    return;
  }

  res.writeHead(200, {
    'content-type': type,
    'content-length': statSync(file).size,
    'cache-control': 'no-store',
  });
  createReadStream(file).pipe(res);
}).listen(port, () => {
  console.log(`serving ${root} with gzip on http://127.0.0.1:${port}`);
});
