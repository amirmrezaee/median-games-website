const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const { createHash } = require('node:crypto');
(async () => {
  const root = path.resolve(__dirname, '..');
  const evidence = process.env.EVIDENCE_PATH || path.join(root, 'Documents', 'Screenshots', '2026-10-13-v1');
  fs.mkdirSync(evidence, { recursive: true });
  const browser = await chromium.launch({ headless: true, ...(process.env.BROWSER_EXECUTABLE ? { executablePath: process.env.BROWSER_EXECUTABLE } : {}) });
  const page = await browser.newPage({ viewport: { width: 1440, height: 1050 } });
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  page.on('response', response => { if (response.status() >= 400) errors.push(`${response.status()} ${response.url()}`); });
  const baseUrl = process.env.SITE_URL || 'http://127.0.0.1:4173/';
  await page.goto(`${baseUrl}?lang=fa`);
  await page.evaluate(() => document.fonts.ready);
  await page.locator('.game-art').last().scrollIntoViewIfNeeded();
  await page.waitForFunction(() => [...document.images].every(image => image.complete && image.naturalWidth > 0));
  await page.evaluate(() => window.scrollTo(0, 0));
  assert.equal(await page.locator('html').getAttribute('dir'), 'rtl');
  assert.equal(await page.locator('.game-card').count(), 3);
  await page.screenshot({ path: path.join(evidence, 'desktop-fa.png'), fullPage: true });
  await page.locator('.game-link').first().click();
  await page.waitForFunction(() => document.querySelector('dialog').open);
  assert.equal(await page.locator('#dialog-title').textContent(), 'بازی اول');
  await page.keyboard.press('Escape');
  assert.equal(await page.locator('dialog').evaluate(element => element.open), false);
  await page.locator('[data-language=en]').click();
  assert.equal(await page.locator('html').getAttribute('dir'), 'ltr');
  assert.equal(await page.locator('#games-title').textContent(), 'Our games');
  await page.reload();
  assert.equal(await page.locator('html').getAttribute('lang'), 'en');
  await page.screenshot({ path: path.join(evidence, 'desktop-en.png'), fullPage: true });
  const layouts = [];
  for (const lang of ['fa', 'en']) {
    await page.locator(`[data-language=${lang}]`).click();
    for (const width of [320, 390, 768, 1024, 1440]) {
      await page.setViewportSize({ width, height: 900 });
      await page.waitForTimeout(100);
      const size = await page.evaluate(() => ({ viewport: innerWidth, content: document.documentElement.scrollWidth }));
      assert.ok(size.content <= size.viewport, `${lang} overflow at ${width}: ${size.content}`);
      layouts.push({ lang, ...size });
      if (width === 390) { await page.evaluate(() => window.scrollTo(0, 0)); await page.screenshot({ path: path.join(evidence, `mobile-${lang}.png`), fullPage: true }); }
    }
  }
  assert.deepEqual(errors, []);
  const source = Object.fromEntries(['index.html', 'styles.css', 'app.js', 'games.js', 'assets/hero.webp', 'assets/puzzle.webp', 'assets/racing.webp'].map(name => [name, createHash('sha256').update(fs.readFileSync(path.join(root, name))).digest('hex')]));
  const result = { testedAt: new Date().toISOString(), siteUrl: baseUrl, source, checks: ['Local assets loaded', 'No browser errors', 'Persian RTL', 'English LTR', 'Language persists after reload', 'Game dialog opens and closes with Escape', 'No horizontal overflow at five widths in both languages'], layouts };
  fs.writeFileSync(path.join(evidence, 'verification.json'), JSON.stringify(result, null, 2));
  console.log(JSON.stringify(result, null, 2));
  await browser.close();
})().catch(error => { console.error(error); process.exit(1); });
