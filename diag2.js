const { chromium } = require('playwright-core');
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1700, height: 1000 } });
  await page.goto('http://localhost:3000/login', { waitUntil: 'networkidle', timeout: 60000 });
  await page.locator('input[type="email"]').first().fill('wheelcheck3@test.local');
  await page.locator('input[type="password"]').first().fill('WheelCheck123!');
  await page.locator('button:has-text("Kirish")').first().click();
  await page.waitForTimeout(2500);
  await page.goto('http://localhost:3000/simulations', { waitUntil: 'networkidle', timeout: 60000 });
  await page.waitForTimeout(2000);
  const search = page.locator('input[placeholder*="qidir" i]').first();
  await search.click(); await page.waitForTimeout(500);
  await page.keyboard.type('tezlik'); await page.waitForTimeout(1000);
  await page.locator('button, a, li, div[role="button"], div[role="option"]').filter({ hasText: /tezlik/i }).last().click();
  await page.waitForTimeout(4000);
  await page.locator('button').filter({ hasText: /Jism/i }).first().click();
  await page.waitForTimeout(600);
  await page.locator('button, div[role="option"], li').filter({ hasText: /Velosiped/ }).last().click();
  await page.waitForTimeout(2000);

  const result = await page.evaluate(() => {
    // find the THREE scene via the canvas's __r3f fiber root (react-three-fiber attaches state)
    const canvas = document.querySelector('canvas');
    let scene = null;
    // r3f stores root state on the canvas element via a Map keyed internally; try common globals
    if (window.__THREE_DEVTOOLS__) {}
    // Walk fiber tree from canvas to find the THREE.Scene
    const key = Object.keys(canvas).find(k => k.startsWith('__reactFiber') || k.startsWith('__reactContainer'));
    function findScene(fiber, depth) {
      if (!fiber || depth > 60) return null;
      if (fiber.stateNode && fiber.stateNode.isScene) return fiber.stateNode;
      if (fiber.stateNode && fiber.stateNode.scene && fiber.stateNode.scene.isScene) return fiber.stateNode.scene;
      let r = findScene(fiber.child, depth+1);
      if (r) return r;
      return findScene(fiber.sibling, depth+1);
    }
    let root = canvas[key];
    scene = findScene(root, 0);
    if (!scene) return { error: 'scene not found', keys: Object.keys(canvas) };

    const out = [];
    scene.traverse(obj => {
      if (obj.name === 'BikeFrame' || obj.name === 'Pedals') {
        const box = new (window.THREE || obj.constructor).Box3 ? null : null;
        out.push({
          name: obj.name,
          type: obj.type,
          position: obj.position && obj.position.toArray ? obj.position.toArray() : null,
          worldPos: (() => { const v = obj.getWorldPosition ? obj.getWorldPosition({x:0,y:0,z:0,set(){return this}, ...{} }) : null; return null; })(),
        });
        // compute geometry bounding box per material group if it's a mesh
        if (obj.geometry) {
          const geo = obj.geometry;
          geo.computeBoundingBox();
          const bb = geo.boundingBox;
          const posAttr = geo.attributes.position;
          const groups = geo.groups && geo.groups.length ? geo.groups : [{start:0,count:posAttr.count,materialIndex:0}];
          const mats = Array.isArray(obj.material) ? obj.material : [obj.material];
          const groupInfo = groups.map(g => {
            let minX=Infinity,maxX=-Infinity,minY=Infinity,maxY=-Infinity,minZ=Infinity,maxZ=-Infinity;
            const idxAttr = geo.index;
            const startIdx = g.start, endIdx = g.start + g.count;
            for (let i = startIdx; i < endIdx; i++) {
              const vi = idxAttr ? idxAttr.getX(i) : i;
              const x = posAttr.getX(vi), y = posAttr.getY(vi), z = posAttr.getZ(vi);
              if (x<minX)minX=x; if(x>maxX)maxX=x;
              if (y<minY)minY=y; if(y>maxY)maxY=y;
              if (z<minZ)minZ=z; if(z>maxZ)maxZ=z;
            }
            const mat = mats[g.materialIndex];
            return {
              materialIndex: g.materialIndex,
              materialName: mat ? mat.name : null,
              materialColor: mat && mat.color ? mat.color.getHexString() : null,
              bbox: { x:[minX,maxX], y:[minY,maxY], z:[minZ,maxZ] }
            };
          });
          out[out.length-1].fullBBox = { x:[bb.min.x,bb.max.x], y:[bb.min.y,bb.max.y], z:[bb.min.z,bb.max.z] };
          out[out.length-1].groups = groupInfo;
        }
      }
    });
    return out;
  });
  console.log(JSON.stringify(result, null, 1));
  await browser.close();
})().catch(e => { console.error('ERR', e); process.exit(1); });
