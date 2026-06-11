const { chromium } = require('playwright-core');
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1700, height: 1000 } });
  await page.goto('http://localhost:3000/simulations', { waitUntil: 'networkidle', timeout: 60000 });
  await page.waitForTimeout(2000);
  const txt = await page.locator('body').innerText();
  console.log(txt.includes('Build Error') ? 'STILL BROKEN' : 'OK - no build error banner');
  await page.screenshot({ path: 'dverify.png' });
  await browser.close();
})().catch(e => { console.error('ERR', e); process.exit(1); });
