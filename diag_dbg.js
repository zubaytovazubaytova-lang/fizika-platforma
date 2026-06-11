const { chromium } = require('playwright-core');
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1700, height: 1000 } });
  await page.goto('http://localhost:3000/register', { waitUntil: 'networkidle', timeout: 60000 });
  await page.waitForTimeout(1500);
  console.log('url:', page.url());
  console.log((await page.locator('body').innerText()).slice(0, 500));
  await page.screenshot({ path: 'ddbg.png' });
  await browser.close();
})().catch(e => { console.error('ERR', e); process.exit(1); });
