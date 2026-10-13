const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const { execFileSync } = require('node:child_process');
(async () => {
  const root = path.resolve(__dirname, '..');
  const evidence = process.env.EVIDENCE_PATH;
  if (!evidence) throw new Error('Set EVIDENCE_PATH to a new screenshot directory');
  fs.mkdirSync(evidence, { recursive: true });
  const browser = await chromium.launch({ headless: true, args: ['--disable-quic'], ...(process.env.BROWSER_EXECUTABLE ? { executablePath: process.env.BROWSER_EXECUTABLE } : {}) });
  try {
    const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
    page.setDefaultTimeout(60000); page.setDefaultNavigationTimeout(60000);
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    page.on('response', response => { if (response.status() >= 400) errors.push(`${response.status()} ${response.url()}`); });
    const url = process.env.SITE_URL || 'http://127.0.0.1:4173/';
    await page.goto(`${url}?lang=fa`, { waitUntil: 'domcontentloaded' });
    await page.evaluate(() => document.fonts.ready);
    assert.ok(await page.locator('html').evaluate(el => el.classList.contains('motion')));
    async function revealAll() {
      const height = await page.evaluate(() => document.documentElement.scrollHeight);
      for (let y = 0; y < height; y += 350) { await page.evaluate(y => window.scrollTo({ top: y, behavior: 'instant' }), y); await page.waitForTimeout(100); }
      await page.waitForTimeout(1200);
      assert.ok(await page.locator('#game-grid').evaluate(el => el.classList.contains('in')));
      assert.ok(await page.locator('.about-copy').evaluate(el => parseFloat(getComputedStyle(el).opacity) > .95));
      await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
      await page.waitForTimeout(1000);
    }
    for (const lang of ['fa', 'en']) {
      await page.locator(`[data-language=${lang}]`).click();
      await page.waitForFunction(lang => document.documentElement.lang === lang, lang);
      for (const width of [320, 390, 1440]) {
        await page.setViewportSize({ width, height: 1000 });
        await revealAll();
        await page.waitForFunction(() => [...document.querySelectorAll('.hero-visual img,.game-art')].every(img => img.complete && img.naturalWidth > 0));
        assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
        if (width !== 320) await page.screenshot({ path: path.join(evidence, `${width === 1440 ? 'desktop' : 'mobile'}-${lang}.png`), fullPage: true });
      }
      await page.locator('.game-link').first().click();
      await page.waitForFunction(() => document.querySelector('dialog').open);
      await page.keyboard.press('Escape');
      await page.waitForFunction(() => !document.querySelector('dialog').open);
    }
    await page.locator('.hero .primary').click();
    await page.waitForTimeout(1500);
    assert.equal(await page.locator('.spark').count(), 0);
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.reload({ waitUntil: 'domcontentloaded' });
    assert.ok(await page.locator('html').evaluate(el => !el.classList.contains('motion')));
    assert.equal(await page.locator('.scroll-progress').count(), 0);
    assert.ok(await page.locator('.game-card').first().evaluate(el => getComputedStyle(el).opacity === '1'));
    assert.deepEqual(errors, []);
    fs.writeFileSync(path.join(evidence, 'verification.json'), JSON.stringify({ url, revision: execFileSync('git', ['rev-parse', 'HEAD'], { cwd: root, encoding: 'utf8' }).trim(), testedAt: new Date().toISOString(), checks: ['Scroll reveals remain visible in both languages', 'No horizontal overflow at 320/390/1440', 'Dialog and Escape work', 'Confetti is removed after animation', 'Reduced motion leaves content visible and disables motion', 'No browser errors'] }, null, 2));
    console.log('Motion, language, mobile, dialog and reduced-motion checks passed.');
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exit(1); });
