const { chromium } = require('playwright-core');
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1700, height: 1000 }, deviceScaleFactor: 4 });
  await page.goto('http://localhost:3000/register', { waitUntil: 'networkidle', timeout: 60000 });
  await page.waitForSelector('input', { timeout: 30000 });
  await page.waitForTimeout(800);
  const inputs = await page.locator('input').all();
  const email = `bikecheck20_${Date.now()}@test.local`;
  await inputs[0].fill('Bike'); await inputs[1].fill('Check'); await inputs[2].fill(email);
  await inputs[3].fill('BikeCheck123!'); await inputs[4].fill('BikeCheck123!');
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

  // click the "Velosiped 5 m/s..." example chip
  const chip = page.locator('button[title*="Velosiped"]').first();
  console.log('chip count', await chip.count());
  await chip.click();
  await page.waitForTimeout(400);
  const yechBtn = page.locator('button').filter({ hasText: /Yeching/i }).first();
  console.log('yeching enabled?', await yechBtn.isEnabled());
  await yechBtn.click();
  await page.waitForTimeout(1500);
  console.log('running now? checking Pauza enabled:', await page.locator('button').filter({hasText:/Pauza/i}).first().isEnabled());

  // zoom on the moving bike near flag A start (it just started)
  const cw = box.width, ch = box.height;
  const cx = box.x + cw*0.20, cy = box.y + ch*0.71;
  await page.mouse.move(cx, cy);
  for (let i=0;i<3;i++){ await page.mouse.wheel(0, -100); await page.waitForTimeout(150); }
  await page.waitForTimeout(200);

  // capture a burst of frames to inspect wheel spin motion
  for (let i=0;i<6;i++){
    await page.screenshot({ path: `d28_spin${i}.png`,
      clip: { x: box.x + cw*0.0, y: box.y + ch*0.60, width: cw*0.30, height: ch*0.35 } });
    await page.waitForTimeout(220);
  }
  await browser.close();
})().catch(e => { console.error('ERR', e); process.exit(1); });
