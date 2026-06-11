const { chromium } = require('playwright-core');
const EMAIL = process.argv[2];
const PASS = 'BikeCheck123!';
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1700, height: 1000 }, deviceScaleFactor: 2 });
  await page.goto('http://localhost:3000/login', { waitUntil: 'networkidle', timeout: 60000 });
  await page.locator('input[type="email"]').first().fill(EMAIL);
  await page.locator('input[type="password"]').first().fill(PASS);
  await page.locator('button:has-text("Kirish")').first().click();
  await page.waitForTimeout(2500);
  await page.goto('http://localhost:3000/simulations', { waitUntil: 'networkidle', timeout: 60000 });
  await page.waitForTimeout(3000);
  console.log('url', page.url());
  await page.screenshot({ path: 'd9_debug.png' });
  const inputs = await page.locator('input').all();
  for (const inp of inputs) console.log('placeholder:', await inp.getAttribute('placeholder'));
  await browser.close();
})().catch(e => { console.error('ERR', e); process.exit(1); });
