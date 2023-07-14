import * as THREE from "three";
function generateMaterial(shapeGeometry) {
  let pos = shapeGeometry.attributes.position; //传入网格体的位置属性
  let count = pos.count;
  let xwidth = 11610512.75; //包围盒宽
  let ywidth = 4571117.8125; //包围盒高
  let xmin = 8182244.5; //包围盒最小xmin值
  let ymin = 2054361.125; //包围盒最小ymin值
  let uv = []; //[x,y,x,y,x,y]
  for (let i = 0; i < count; i++) {
    let u = (pos.getX(i) - xmin) / xwidth;
    let v = (pos.getY(i) - ymin) / ywidth;
    uv.push(u);
    uv.push(v);
  }
  shapeGeometry.setAttribute(
    "uv",
    new THREE.BufferAttribute(new Float32Array(uv), 2)
  );
  const texture = new THREE.TextureLoader().load("/BaseModel/img/bcg.png");
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(50, 50);
  texture.offset.set(1, 1.5);
  const upMaterial = new THREE.MeshLambertMaterial({
    // wireframe: true,
    color: 0x00a2ff,
    map: texture,
    opacity: 1,
    transparent: true,
    side: THREE.DoubleSide,
  });
  const sideMaterial = new THREE.MeshLambertMaterial({
    // wireframe: true,
    color: 0x00a2ff,
    opacity: 1,
    transparent: true,
    side: THREE.DoubleSide,
  });
  const shapeMesh = new THREE.Mesh(shapeGeometry, [upMaterial, sideMaterial]);
  return shapeMesh;
}

export { generateMaterial };
