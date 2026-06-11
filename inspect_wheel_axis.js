const fs = require('fs');
const buf = fs.readFileSync('frontend/public/models/bicycle.glb');
let offset = 12, json = null, binChunk = null;
while (offset < buf.length) {
  const chunkLen = buf.readUInt32LE(offset);
  const chunkType = buf.toString('ascii', offset+4, offset+8);
  const chunkData = buf.slice(offset+8, offset+8+chunkLen);
  if (chunkType === 'JSON') json = JSON.parse(chunkData.toString('utf8'));
  if (chunkType === 'BIN\0') binChunk = chunkData;
  offset += 8 + chunkLen;
}
function readPositions(meshIdx) {
  const mesh = json.meshes[meshIdx];
  const accIdx = mesh.primitives[0].attributes.POSITION;
  const acc = json.accessors[accIdx];
  const bv = json.bufferViews[acc.bufferView];
  const start = (bv.byteOffset||0) + (acc.byteOffset||0);
  const count = acc.count;
  const pts = [];
  for (let i=0;i<count;i++){
    const o = start + i*12;
    pts.push([binChunk.readFloatLE(o), binChunk.readFloatLE(o+4), binChunk.readFloatLE(o+8)]);
  }
  return pts;
}
function analyze(name, meshIdx) {
  const pts = readPositions(meshIdx);
  // compute centroid
  const c = [0,0,0];
  for (const p of pts) { c[0]+=p[0]; c[1]+=p[1]; c[2]+=p[2]; }
  c[0]/=pts.length; c[1]/=pts.length; c[2]/=pts.length;
  // variance along each axis (in centered coords)
  let varX=0, varY=0, varZ=0;
  for (const p of pts) {
    varX += (p[0]-c[0])**2; varY += (p[1]-c[1])**2; varZ += (p[2]-c[2])**2;
  }
  varX/=pts.length; varY/=pts.length; varZ/=pts.length;
  console.log(`${name}: centroid=${c.map(x=>x.toFixed(3))}  variance X=${varX.toFixed(4)} Y=${varY.toFixed(4)} Z=${varZ.toFixed(4)}`);
  console.log(`   -> thinnest axis (= disc normal = axle/spin axis) is ${['X','Y','Z'][[varX,varY,varZ].indexOf(Math.min(varX,varY,varZ))]}`);
}
const nodes = json.nodes;
for (const n of nodes) {
  if (n.name === 'WheelFront' || n.name === 'WheelRear') analyze(n.name, n.mesh);
}
