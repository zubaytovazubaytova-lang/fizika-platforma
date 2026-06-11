const fs = require('fs');
const buf = fs.readFileSync('frontend/public/models/bicycle.glb');
// GLB header: magic(4) version(4) length(4); then chunks: length(4) type(4) data
let off = 12;
let json, bin;
while (off < buf.length) {
  const chunkLen = buf.readUInt32LE(off);
  const chunkType = buf.toString('ascii', off+4, off+8);
  const data = buf.subarray(off+8, off+8+chunkLen);
  if (chunkType === 'JSON') json = JSON.parse(data.toString('utf8'));
  else if (chunkType === 'BIN\0') bin = data;
  off += 8 + chunkLen;
}

function accessorData(accIdx) {
  const acc = json.accessors[accIdx];
  const bv = json.bufferViews[acc.bufferView];
  const compSize = { 5126: 4, 5125: 4, 5123: 2, 5122: 2, 5121: 1, 5120: 1 }[acc.componentType];
  const numComp = { SCALAR:1, VEC2:2, VEC3:3, VEC4:4 }[acc.type];
  const start = (bv.byteOffset||0) + (acc.byteOffset||0);
  const out = [];
  const stride = bv.byteStride || (numComp*compSize);
  for (let i=0;i<acc.count;i++){
    const base = start + i*stride;
    const vals=[];
    for (let c=0;c<numComp;c++){
      let v;
      if (acc.componentType===5126) v = bin.readFloatLE(base + c*4);
      else if (acc.componentType===5125) v = bin.readUInt32LE(base + c*4);
      else if (acc.componentType===5123) v = bin.readUInt16LE(base + c*2);
      else if (acc.componentType===5122) v = bin.readInt16LE(base + c*2);
      vals.push(v);
    }
    out.push(vals);
  }
  return out;
}

json.meshes.forEach((mesh, mi) => {
  console.log(`\n=== Mesh[${mi}] "${mesh.name}" ===`);
  mesh.primitives.forEach((prim, pi) => {
    const positions = accessorData(prim.attributes.POSITION);
    const indices = prim.indices != null ? accessorData(prim.indices).map(v=>v[0]) : positions.map((_,i)=>i);
    const matIdx = prim.material;
    const mat = json.materials[matIdx];
    let minX=Infinity,maxX=-Infinity,minY=Infinity,maxY=-Infinity,minZ=Infinity,maxZ=-Infinity;
    for (const idx of indices) {
      const [x,y,z] = positions[idx];
      if(x<minX)minX=x; if(x>maxX)maxX=x;
      if(y<minY)minY=y; if(y>maxY)maxY=y;
      if(z<minZ)minZ=z; if(z>maxZ)maxZ=z;
    }
    console.log(`  prim[${pi}] material="${mat ? mat.name : matIdx}" verts=${indices.length}`);
    console.log(`    bbox X[${minX.toFixed(3)}, ${maxX.toFixed(3)}]  Y[${minY.toFixed(3)}, ${maxY.toFixed(3)}]  Z[${minZ.toFixed(3)}, ${maxZ.toFixed(3)}]`);
  });
});
