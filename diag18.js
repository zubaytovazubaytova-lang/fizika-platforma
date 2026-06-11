const { chromium } = require('playwright-core');
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1700, height: 1000 } });
  await page.goto('http://localhost:3000/simulations', { waitUntil: 'networkidle', timeout: 60000 });
  await page.waitForTimeout(2000);
  const issueBtn = page.locator('button, div').filter({ hasText: /Issue/ }).first();
  if (await issueBtn.count()) { await issueBtn.click(); await page.waitForTimeout(800); }
  await page.screenshot({ path: 'd18_issue.png' });
  console.log((await page.locator('body').innerText()).slice(0,1500));
  await browser.close();
})().catch(e => { console.error('ERR', e); process.exit(1); });
