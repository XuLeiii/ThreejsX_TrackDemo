import * as THREE from "three";
//灯光
const lightTarget = new THREE.Object3D();
lightTarget.position.set(
  12893146.2299874,
  3781388.330929123,
  41671.16579884489
);
// 设置目标位置
const directionalLight1 = new THREE.DirectionalLight(0xffffff, 1);
directionalLight1.position.set(21610512.75, 4571117.8125, 10000000);
directionalLight1.target = lightTarget;

const directionalLight2 = new THREE.DirectionalLight(0xffffff, 1);
directionalLight2.position.set(5610512.75, 4571117.8125, 7000000);
directionalLight2.target = lightTarget;

const directionalLight3 = new THREE.DirectionalLight(0xffffff, 0.5);
directionalLight3.position.set(11610512.75, 8571117.8125, 0);
directionalLight3.target = lightTarget;

const directionalLight4 = new THREE.DirectionalLight(0xffffff, 0.5);
directionalLight4.position.set(11610512.75, -8571117.8125, 0);
directionalLight4.target = lightTarget;

export {
  lightTarget,
  directionalLight1,
  directionalLight2,
  directionalLight3,
  directionalLight4,
};
