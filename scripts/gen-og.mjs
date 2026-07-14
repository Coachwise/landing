// Renders the Open Graph card (static/img/og.png) — the image every link
// preview and search result shows. Run from landing/ after a brand change:
//
//   node scripts/gen-og.mjs
//
// Like app/scripts/gen-icons.mjs it drives the Chromium that Playwright already
// downloaded, because there is no rsvg/inkscape on the dev boxes.
import { execSync } from 'node:child_process';
import { readFileSync, mkdirSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
import os from 'node:os';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');

// This site has no npm dependencies of its own. Borrow the Playwright that the
// app already installs rather than giving a Hugo project a node_modules tree.
const req = createRequire(import.meta.url);
const { chromium } = req(resolve(root, '../app/node_modules/playwright'));
const mark = readFileSync(join(root, 'static/img/mark.svg'), 'utf8');
const font = readFileSync(join(root, 'static/fonts/Lalezar-latin.woff2')).toString('base64');
const body = readFileSync(join(root, 'static/fonts/Vazirmatn-var.woff2')).toString('base64');

const NAVY = '#0E0E55';
const YELLOW = '#eab308';
const ICE = '#EEF2F7';

const html = `<style>
  @font-face { font-family: "Lalezar"; src: url(data:font/woff2;base64,${font}) format("woff2"); }
  @font-face { font-family: "Vazirmatn"; src: url(data:font/woff2;base64,${body}) format("woff2-variations"); font-weight: 300 800; }
  html,body { margin:0; width:1200px; height:630px; }
  body {
    background: ${NAVY};
    color: ${ICE};
    display: flex; flex-direction: column; justify-content: center;
    /* Bottom padding keeps the subtitle clear of the ridge silhouette. */
    padding: 0 88px 96px;
    font-family: "Vazirmatn", system-ui, sans-serif;
    position: relative; overflow: hidden;
  }
  /* The ridgeline, same shape the site divides on. */
  .ridge { position:absolute; inset-inline:0; bottom:0; height:190px; width:1200px; }
  .ridge path { fill: #070734; }
  svg.mark { width: 112px; height: 112px; color: ${YELLOW}; }
  h1 { font-family: "Lalezar", sans-serif; font-weight: 400; font-size: 76px; line-height: 1.1; margin: 34px 0 20px; letter-spacing: -0.01em; }
  p { font-size: 30px; margin: 0; color: #B9C6DA; }
  .accent { color: ${YELLOW}; }
</style>
<svg class="ridge" viewBox="0 0 1440 90" preserveAspectRatio="none"><path d="M0,82 L300,52 L560,16 L700,46 L840,24 L1120,62 L1440,38 L1440,90 L0,90 Z"/></svg>
${mark.replace('<svg', '<svg class="mark"').replace(/fill="#0E0E55"/, 'fill="currentColor"')}
<h1>They see the summit.<br><span class="accent">You make the climb.</span></h1>
<p>Strength training and climbing, in one app — coachwise.app</p>`;

function findChromium() {
  const base = join(os.homedir(), '.cache', 'ms-playwright');
  const found = execSync(`find ${base} -name chrome -path '*/chrome-linux64/*' 2>/dev/null | head -1`, {
    encoding: 'utf8',
  }).trim();
  return found || undefined;
}

const browser = await chromium.launch({ executablePath: findChromium() });
const page = await browser.newPage({ viewport: { width: 1200, height: 630 } });
await page.setContent(html);
const out = join(root, 'static/img/og.png');
mkdirSync(dirname(out), { recursive: true });
await page.screenshot({ path: out });
await browser.close();
console.log('wrote static/img/og.png (1200×630)');
