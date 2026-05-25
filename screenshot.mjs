import { createRequire } from 'module';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const require = createRequire(import.meta.url);
const { chromium } = require('C:/Users/User/AppData/Local/ms-playwright-go/1.57.0/package');

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const url   = process.argv[2] || 'http://localhost:3000';
const label = process.argv[3] ? `-${process.argv[3]}` : '';

const dir = path.join(__dirname, 'temporary screenshots');
if (!fs.existsSync(dir)) fs.mkdirSync(dir);

const existing = fs.readdirSync(dir).filter(f => f.startsWith('screenshot-') && f.endsWith('.png'));
const nums = existing.map(f => parseInt(f.match(/screenshot-(\d+)/)?.[1] ?? '0')).filter(Boolean);
const n = nums.length ? Math.max(...nums) + 1 : 1;
const out = path.join(dir, `screenshot-${n}${label}.png`);

const browser = await chromium.launch({
  executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
  headless: true,
});
const page = await browser.newPage();
await page.setViewportSize({ width: 1440, height: 900 });
await page.goto(url, { waitUntil: 'networkidle' });
await page.waitForTimeout(800);
await page.screenshot({ path: out, fullPage: true });
await browser.close();

console.log(`Saved: ${out}`);
