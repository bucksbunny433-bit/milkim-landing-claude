#!/usr/bin/env node
/**
 * Milkim budget verifier.
 *
 * Loads a URL at 375px under the exact throttling profile from CLAUDE.md section 4,
 * measures Core Web Vitals and transferred weight, then re-loads the page twice more:
 * once with prefers-reduced-motion, once with JavaScript disabled.
 *
 * Needs no npm install - it resolves the globally installed Playwright and the
 * Chromium in /opt/pw-browsers.
 *
 *   node .claude/skills/milkim-visual/scripts/verify.mjs http://localhost:4321
 */

import { createRequire } from 'node:module';
import { mkdirSync } from 'node:fs';
import path from 'node:path';

const GLOBAL_MODULES = '/opt/node22/lib/node_modules';
const CHROMIUM = '/opt/pw-browsers/chromium/chrome-linux/chrome';
const OUT = '.verify';

// Budgets - keep in sync with CLAUDE.md section 4. [target, hardCap]
const BUDGET = {
  lcp: [2000, 2500],          // ms
  fcp: [1500, 1800],          // ms
  cls: [0.05, 0.1],           // unitless
  totalKB: [600, 750],
  htmlKB: [25, 35],
  cssKB: [30, 40],
  jsKB: [40, 60],
  fontKB: [120, 150],
  imageKB: [180, 250],        // first view; the hero LCP image dominates this
  requests: [25, 30],
};

function loadPlaywright() {
  const require = createRequire(path.join(GLOBAL_MODULES, 'noop.js'));
  try {
    return require('playwright');
  } catch {
    return createRequire(import.meta.url)('playwright');
  }
}

const url = process.argv[2];
if (!url) {
  console.error('usage: node verify.mjs <url>');
  process.exit(2);
}

const { chromium, devices } = loadPlaywright();
mkdirSync(OUT, { recursive: true });

async function launch() {
  try {
    return await chromium.launch({ executablePath: CHROMIUM });
  } catch {
    return await chromium.launch();
  }
}

const MOBILE = { ...devices['Pixel 5'], viewport: { width: 375, height: 812 }, deviceScaleFactor: 2 };

function classify(res) {
  const type = res.request().resourceType();
  if (type === 'document') return 'html';
  if (type === 'stylesheet') return 'css';
  if (type === 'script') return 'js';
  if (type === 'font') return 'font';
  if (type === 'image') return 'image';
  if (type === 'media') return 'media';
  return 'other';
}

async function throttle(ctx, page) {
  const cdp = await ctx.newCDPSession(page);
  await cdp.send('Network.enable');
  await cdp.send('Network.emulateNetworkConditions', {
    offline: false,
    latency: 150,
    downloadThroughput: (1.6 * 1024 * 1024) / 8,
    uploadThroughput: (750 * 1024) / 8,
  });
  await cdp.send('Emulation.setCPUThrottlingRate', { rate: 4 });
}

async function measure(browser) {
  const ctx = await browser.newContext(MOBILE);
  const page = await ctx.newPage();
  await throttle(ctx, page);

  const bytes = { html: 0, css: 0, js: 0, font: 0, image: 0, media: 0, other: 0 };
  let requests = 0;

  page.on('response', async (res) => {
    requests += 1;
    try {
      const sizes = await res.request().sizes();
      bytes[classify(res)] += sizes.responseBodySize + sizes.responseHeadersSize;
    } catch {
      /* redirects and aborted requests report no sizes */
    }
  });

  await page.goto(url, { waitUntil: 'load', timeout: 90_000 });
  // Settle: let lazy work, late fonts and any post-load motion finish.
  await page.waitForTimeout(3000);
  // Nudge the LCP observer to finalise the way a real interaction would.
  await page.evaluate(() => new Promise((r) => requestAnimationFrame(() => r())));

  const vitals = await page.evaluate(
    () =>
      new Promise((resolve) => {
        let lcp = 0;
        let cls = 0;
        const fcpEntry = performance.getEntriesByName('first-contentful-paint')[0];
        new PerformanceObserver((list) => {
          for (const e of list.getEntries()) lcp = e.startTime;
        }).observe({ type: 'largest-contentful-paint', buffered: true });
        new PerformanceObserver((list) => {
          for (const e of list.getEntries()) if (!e.hadRecentInput) cls += e.value;
        }).observe({ type: 'layout-shift', buffered: true });
        setTimeout(
          () => resolve({ lcp: Math.round(lcp), cls: +cls.toFixed(4), fcp: Math.round(fcpEntry ? fcpEntry.startTime : 0) }),
          500,
        );
      }),
  );

  await page.screenshot({ path: path.join(OUT, 'mobile-375.png'), fullPage: true });
  await ctx.close();
  return { vitals, bytes, requests };
}

async function variant(browser, name, opts) {
  const ctx = await browser.newContext({ ...MOBILE, ...opts.context });
  const page = await ctx.newPage();
  if (opts.reducedMotion) await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto(url, { waitUntil: 'load', timeout: 90_000 });
  await page.waitForTimeout(1500);

  const text = await page.evaluate(() => (document.body.innerText || '').replace(/\s+/g, ' ').trim().length);
  const imgs = await page.evaluate(() =>
    [...document.images].filter((i) => i.getBoundingClientRect().width > 0).length,
  );
  await page.screenshot({ path: path.join(OUT, `${name}.png`), fullPage: true });
  await ctx.close();
  return { textChars: text, visibleImages: imgs };
}

const kb = (n) => +(n / 1024).toFixed(1);

function row(label, value, [target, cap], unit = '') {
  const ok = value <= target;
  const soft = !ok && value <= cap;
  const mark = ok ? 'PASS' : soft ? 'WARN' : 'FAIL';
  const pad = (s, n) => String(s).padEnd(n);
  console.log(
    `  ${pad(mark, 5)} ${pad(label, 26)} ${pad(value + unit, 12)} budget ${target}${unit}  cap ${cap}${unit}`,
  );
  return ok ? 0 : soft ? 1 : 2;
}

const browser = await launch();
let worst = 0;
const bump = (n) => {
  worst = Math.max(worst, n);
};

console.log(`\nMilkim budget check - ${url}`);
console.log('Profile: 375px, DPR 2, 4G 1.6 Mbit/s, RTT 150ms, CPU x4\n');

const { vitals, bytes, requests } = await measure(browser);

console.log('Core Web Vitals');
bump(row('LCP', vitals.lcp, BUDGET.lcp, 'ms'));
bump(row('FCP', vitals.fcp, BUDGET.fcp, 'ms'));
bump(row('CLS', vitals.cls, BUDGET.cls));

const total = Object.values(bytes).reduce((a, b) => a + b, 0);
console.log('\nTransferred weight, first view');
bump(row('total', kb(total), BUDGET.totalKB, 'KB'));
bump(row('html', kb(bytes.html), BUDGET.htmlKB, 'KB'));
bump(row('css', kb(bytes.css), BUDGET.cssKB, 'KB'));
bump(row('js', kb(bytes.js), BUDGET.jsKB, 'KB'));
bump(row('fonts', kb(bytes.font), BUDGET.fontKB, 'KB'));
bump(row('images', kb(bytes.image), BUDGET.imageKB, 'KB'));
bump(row('requests', requests, BUDGET.requests));
if (bytes.media) console.log(`  INFO  media                      ${kb(bytes.media)}KB  (video - check the 1.8MB hero cap)`);

const reduced = await variant(browser, 'reduced-motion', { reducedMotion: true });
const nojs = await variant(browser, 'no-js', { context: { javaScriptEnabled: false } });

console.log('\nHard-rule checks');
console.log(`  INFO  reduced-motion render     ${reduced.textChars} chars, ${reduced.visibleImages} images  -> .verify/reduced-motion.png`);
const jsOk = nojs.textChars > 0 && nojs.textChars >= reduced.textChars * 0.8;
console.log(
  `  ${jsOk ? 'PASS ' : 'FAIL '} readable without JS       ${nojs.textChars} chars, ${nojs.visibleImages} images  -> .verify/no-js.png`,
);
if (!jsOk) bump(2);

console.log(`\nScreenshots in ${OUT}/\n`);
await browser.close();
process.exit(worst === 2 ? 1 : 0);
