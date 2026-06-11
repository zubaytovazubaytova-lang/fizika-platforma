const fs = require('fs');
const buf = fs.readFileSync('frontend/public/models/bicycle.glb');
// GLB header: magic(4) version(4) length(4), then chunks: length(4) type(4) data
let offset = 12;
let json = null;
while (offset < buf.length) {
  const chunkLen = buf.readUInt32LE(offset);
  const chunkType = buf.toString('ascii', offset+4, offset+8);
  const chunkData = buf.slice(offset+8, offset+8+chunkLen);
  if (chunkType === 'JSON') json = JSON.parse(chunkData.toString('utf8'));
  offset += 8 + chunkLen;
}
console.log('Scene nodes (top-level):');
const scene = json.scenes[json.scene || 0];
for (const nodeIdx of scene.nodes) {
  printNode(nodeIdx, 0);
}
function printNode(idx, depth) {
  const n = json.nodes[idx];
  const indent = '  '.repeat(depth);
  const t = n.translation || [0,0,0];
  const r = n.rotation || [0,0,0,1];
  const s = n.scale || [1,1,1];
  console.log(`${indent}[${idx}] "${n.name}" T=${t.map(x=>x.toFixed(4))} R=${r.map(x=>x.toFixed(4))} S=${s.map(x=>x.toFixed(4))} mesh=${n.mesh!==undefined?n.mesh:'-'}`);
  if (n.children) for (const c of n.children) printNode(c, depth+1);
}

// Compute world-space bounding boxes for named meshes via accessor min/max + node transform (assume no rotation for simplicity check)
console.log('\nMesh accessor bounding boxes (local space):');
for (const node of json.nodes) {
  if (node.mesh === undefined) continue;
  const mesh = json.meshes[node.mesh];
  let min=[Infinity,Infinity,Infinity], max=[-Infinity,-Infinity,-Infinity];
  for (const prim of mesh.primitives) {
    const accIdx = prim.attributes.POSITION;
    const acc = json.accessors[accIdx];
    if (acc.min && acc.max) {
      for (let i=0;i<3;i++){ min[i]=Math.min(min[i],acc.min[i]); max[i]=Math.max(max[i],acc.max[i]); }
    }
  }
  const t = node.translation || [0,0,0];
  const center = [ (min[0]+max[0])/2 + t[0], (min[1]+max[1])/2 + t[1], (min[2]+max[2])/2 + t[2] ];
  console.log(`  "${node.name}": local min=${min.map(x=>x.toFixed(3))} max=${max.map(x=>x.toFixed(3))}`);
  console.log(`     -> approx world center (local-center + translation) = ${center.map(x=>x.toFixed(3))}`);
}
