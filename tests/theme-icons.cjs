const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const assert = require('node:assert/strict');
const base = process.env.TEST_BASE_URL || 'http://127.0.0.1:3005';
(async () => {
  const browser = await chromium.launch({ headless: true, channel: 'chrome' });
  try {
    for (const width of [390, 1440]) {
      for (const saved of [null, 'light', 'dark', 'invalid', 'blocked']) {
        const context = await browser.newContext({ viewport: { width, height: 900 }, colorScheme: 'light' });
        if (saved) await context.addInitScript(value => {
          if (value === 'blocked') Object.defineProperty(Storage.prototype, 'getItem', { value: () => { throw new Error('Storage unavailable'); } });
          else localStorage.setItem('glowwithvani-theme', value);
        }, saved);
        const page = await context.newPage();
        await page.goto(base, { waitUntil: 'networkidle' });
        assert.equal(await page.locator('html').getAttribute('data-theme'), saved === 'light' ? 'light' : 'dark');
        assert.ok(await page.locator('svg.link-arrow-icon').count() > 0);
        assert.equal(await page.locator('.studio-hero .link-arrow-icon').first().evaluate(el => getComputedStyle(el).width), '18px');
        assert.equal(await page.locator('main').evaluate(el => /[↗→]/.test(el.textContent)), false);
        await context.close();
      }
    }
    const context = await browser.newContext({ javaScriptEnabled: false, colorScheme: 'light' });
    const page = await context.newPage();
    await page.goto(base);
    assert.equal(await page.locator('html').getAttribute('data-theme'), 'dark');
    await context.close();
    console.log('PASS: matching SVG icons on mobile/desktop; dark default, saved light/dark, invalid/blocked storage, and no-JavaScript fallback.');
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exit(1); });
