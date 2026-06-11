const { chromium } = require('playwright-core');
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1700, height: 1000 }, deviceScaleFactor: 4 });
  await page.goto('http://localhost:3000/register', { waitUntil: 'networkidle', timeout: 60000 });
  await page.waitForSelector('input', { timeout: 30000 });
  await page.waitForTimeout(800);
  const inputs0 = await page.locator('input').all();
  const email = `bikecheck19_${Date.now()}@test.local`;
  await inputs0[0].fill('Bike'); await inputs0[1].fill('Check'); await inputs0[2].fill(email);
  await inputs0[3].fill('BikeCheck123!'); await inputs0[4].fill('BikeCheck123!');
  await page.locator('button').filter({ hasText: /Ro.?yxatdan o.?tish/i }).first().click();
  await page.waitForTimeout(3500);

  await page.goto('http://localhost:3000/simulations', { waitUntil: 'networkidle', timeout: 60000 });
  await page.waitForTimeout(2500);
  const search = page.locator('input[placeholder*="qidir" i]').first();
  await search.click(); await page.waitForTimeout(400);
  await page.keyboard.type('tezlik'); await page.waitForTimeout(900);
  await page.locator('button, a, li, div[role="button"], div[role="option"]').filter({ hasText: /tezlik/i }).last().click();
  await page.waitForTimeout(4000);
  const canvas = page.locator('canvas').first();
  const box = await canvas.boundingBox();
  await page.locator('button').filter({ hasText: /Jism/i }).first().click();
  await page.waitForTimeout(800);
  await page.locator('button, div[role="option"], li').filter({ hasText: /Velosiped/ }).last().click();
  await page.waitForTimeout(2000);

  // find masala input(s) near Yeching button
  const allInputs = await page.locator('input').all();
  for (const inp of allInputs) {
    const ph = await inp.getAttribute('placeholder');
    const tp = await inp.getAttribute('type');
    const visible = await inp.isVisible();
    if (visible) console.log('input:', ph, tp);
  }
  await browser.close();
})().catch(e => { console.error('ERR', e); process.exit(1); });
