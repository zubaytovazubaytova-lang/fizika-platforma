const { chromium } = require('playwright-core');
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1700, height: 1000 }, deviceScaleFactor: 4 });
  await page.goto('http://localhost:3000/register', { waitUntil: 'networkidle', timeout: 60000 });
  await page.waitForSelector('input', { timeout: 30000 });
  await page.waitForTimeout(800);
  const inputs = await page.locator('input').all();
  const email = `bikecheck9_${Date.now()}@test.local`;
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
  await page.waitForTimeout(600);
  await page.locator('button, div[role="option"], li').filter({ hasText: /Velosiped/ }).last().click();
  await page.waitForTimeout(2000);

  const startBtn = page.locator('button').filter({ hasText: /Start/i }).first();
  console.log('start btn count', await startBtn.count(), 'enabled', await startBtn.isEnabled().catch(()=>'?'));
  await startBtn.click({ force: true });
  await page.waitForTimeout(2000);
  const pauseBtn = page.locator('button').filter({ hasText: /Pauza/i }).first();
  console.log('pause enabled?', await pauseBtn.isEnabled().catch(()=>'?'));
  await pauseBtn.click({ timeout: 8000 }).catch(e => console.log('pause click failed:', e.message.split('\n')[0]));
  await page.waitForTimeout(400);

  const cw = box.width, ch = box.height;
  const cx = box.x + cw*0.37, cy = box.y + ch*0.75;

  // small horizontal drag-orbits in steps, screenshot each, to find a clean side angle
  for (let step = 0; step < 6; step++) {
    await page.mouse.move(cx, cy);
    await page.mouse.down();
    await page.mouse.move(cx + 70, cy, { steps: 8 });
    await page.mouse.up();
    await page.waitForTimeout(300);
    await canvas.screenshot({ path: `d16_orbit${step}.png` });
  }
  await browser.close();
})().catch(e => { console.error('ERR', e); process.exit(1); });
