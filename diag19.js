const { chromium } = require('playwright-core');
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1700, height: 1000 } });
  await page.goto('http://localhost:3000/register', { waitUntil: 'networkidle', timeout: 60000 });
  await page.waitForSelector('input', { timeout: 30000 });
  await page.waitForTimeout(800);
  const inputs = await page.locator('input').all();
  const email = `bikecheck11_${Date.now()}@test.local`;
  await inputs[0].fill('Bike'); await inputs[1].fill('Check'); await inputs[2].fill(email);
  await inputs[3].fill('BikeCheck123!'); await inputs[4].fill('BikeCheck123!');
  await page.locator('button').filter({ hasText: /Ro.?yxatdan o.?tish/i }).first().click();
  await page.waitForTimeout(3500);
  await page.goto('http://localhost:3000/simulations', { waitUntil: 'networkidle', timeout: 60000 });
  await page.waitForTimeout(2500);

  // Click the red issue badge (bottom-left "N  1 Issue")
  const badge = page.locator('text=/Issue/').first();
  console.log('badge count', await badge.count());
  if (await badge.count()) {
    await badge.click();
    await page.waitForTimeout(1000);
    console.log((await page.locator('body').innerText()).slice(0, 2500));
  } else {
    console.log('no issue badge currently');
  }
  await page.screenshot({ path: 'd19_issue.png' });
  await browser.close();
})().catch(e => { console.error('ERR', e); process.exit(1); });
