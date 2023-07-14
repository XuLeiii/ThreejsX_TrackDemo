import * as THREE from "three";

//计算包围盒的一些数据
function box3Compute(mesh) {
  const box3 = new THREE.Box3();
  box3.expandByObject(mesh); //计算group模型的包围盒
  console.log("包围盒极大极小值", box3);

  const size = new THREE.Vector3();
  box3.getSize(size);
  console.log("包围盒长宽高", size);

  const center = new THREE.Vector3();
  box3.getCenter(center); //计算包围盒几何体中心坐标
  console.log("几何中心", center);

  return box3.getCenter(center); //计算包围盒几何体中心坐标,此处用于点击网格视角切换，可随时注释。
}
// 经纬度转墨卡托
function lon2xy(longitude, latitude) {
  var E = longitude;
  var N = latitude;
  var x = (E * 20037508.34) / 180;
  var y = Math.log(Math.tan(((90 + N) * Math.PI) / 360)) / (Math.PI / 180);
  y = (y * 20037508.34) / 180;
  return {
    x: x, //墨卡托x坐标——对应经度
    y: y, //墨卡托y坐标——对应维度
  };
}
// 墨卡托转经纬度
function xy2lon(x, y) {
  var E = (x / 20037508.34) * 180;
  var N = (y / 20037508.34) * 180;
  N =
    (180 / Math.PI) *
    (2 * Math.atan(Math.exp((N * Math.PI) / 180)) - Math.PI / 2);
  return {
    longitude: E, // 经度
    latitude: N, // 纬度
  };
}

export { box3Compute, lon2xy, xy2lon };
