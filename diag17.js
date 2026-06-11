const { chromium } = require('playwright-core');
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1700, height: 1000 }, deviceScaleFactor: 4 });
  await page.goto('http://localhost:3000/register', { waitUntil: 'networkidle', timeout: 60000 });
  await page.waitForSelector('input', { timeout: 30000 });
  await page.waitForTimeout(800);
  const inputs = await page.locator('input').all();
  const email = `bikecheck10_${Date.now()}@test.local`;
  await inputs[0].fill('Bike'); await inputs[1].fill('Check'); await inputs[2].fill(email);
  await inputs[3].fill('BikeCheck123!'); await inputs[4].fill('BikeCheck123!');
  await page.locator('button').filter({ hasText: /Ro.?yxatdan o.?tish/i }).first().click();
  await page.waitForTimeout(3500);
  console.log('post-reg url', page.url());

  await page.goto('http://localhost:3000/simulations', { waitUntil: 'networkidle', timeout: 60000 });
  await page.waitForTimeout(2500);
  console.log('sim url', page.url());
  const search = page.locator('input[placeholder*="qidir" i]').first();
  await search.click(); await page.waitForTimeout(400);
  await page.keyboard.type('tezlik'); await page.waitForTimeout(900);
  const tezBtn = page.locator('button, a, li, div[role="button"], div[role="option"]').filter({ hasText: /tezlik/i }).last();
  console.log('tezlik match count', await tezBtn.count());
  await tezBtn.click();
  await page.waitForTimeout(4000);
  console.log('after tezlik click url', page.url());
  const canvas = page.locator('canvas');
  console.log('canvas count', await canvas.count());

  const jismBtn = page.locator('button').filter({ hasText: /Jism/i }).first();
  console.log('jism count', await jismBtn.count());
  await jismBtn.click({ timeout: 10000 }).catch(e=>console.log('jism click err', e.message.split('\n')[0]));
  await page.waitForTimeout(800);
  const veloBtn = page.locator('button, div[role="option"], li').filter({ hasText: /Velosiped/ }).last();
  console.log('velo count', await veloBtn.count());
  await veloBtn.click({ timeout: 10000 }).catch(e=>console.log('velo click err', e.message.split('\n')[0]));
  await page.waitForTimeout(2000);

  const startBtn = page.locator('button').filter({ hasText: /Start/i }).first();
  console.log('start count', await startBtn.count());
  await page.screenshot({ path: 'd17_state.png' });
  await browser.close();
})().catch(e => { console.error('ERR', e); process.exit(1); });
