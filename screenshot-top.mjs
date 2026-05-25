import { createRequire } from 'module';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const require = createRequire(import.meta.url);
const { chromium } = require('C:/Users/User/AppData/Local/ms-playwright-go/1.57.0/package');

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dir = path.join(__dirname, 'temporary screenshots');
if (!fs.existsSync(dir)) fs.mkdirSync(dir);

const existing = fs.readdirSync(dir).filter(f => f.startsWith('screenshot-') && f.endsWith('.png'));
const nums = existing.map(f => parseInt(f.match(/screenshot-(\d+)/)?.[1] ?? '0')).filter(Boolean);
const n = nums.length ? Math.max(...nums) + 1 : 1;
const out = path.join(dir, `screenshot-${n}-top.png`);

const browser = await chromium.launch({
  executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
  headless: true,
});
const page = await browser.newPage();
await page.setViewportSize({ width: 1440, height: 900 });
await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
await page.waitForTimeout(800);
await page.screenshot({ path: out, clip: { x: 0, y: 0, width: 1440, height: 900 } });
await browser.close();

console.log(`Saved: ${out}`);
