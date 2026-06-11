const { chromium } = require('playwright-core');
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1700, height: 1000 }, deviceScaleFactor: 2 });
  await page.goto('http://localhost:3000/login', { waitUntil: 'networkidle', timeout: 60000 });
  await page.locator('input[type="email"]').first().fill('wheelcheck3@test.local');
  await page.locator('input[type="password"]').first().fill('WheelCheck123!');
  await page.locator('button:has-text("Kirish")').first().click();
  await page.waitForTimeout(3000);
  console.log('after login url:', page.url());
  await page.goto('http://localhost:3000/simulations', { waitUntil: 'networkidle', timeout: 60000 });
  await page.waitForTimeout(3000);
  console.log('sim url:', page.url());
  await page.screenshot({ path: 'd8_debug.png', fullPage: false });
  const inputs = await page.locator('input').all();
  for (const inp of inputs) {
    console.log('input placeholder:', await inp.getAttribute('placeholder'));
  }
  await browser.close();
})().catch(e => { console.error('ERR', e); process.exit(1); });
