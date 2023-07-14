import * as THREE from "three";
import { lightTarget, directionalLight1, directionalLight2, directionalLight3, directionalLight4 } from "./Light/Light.js";
import { Group } from "./Mesh/generateMapMesh.js";
import { MapMeshGroup, generateMapMesh } from "./Mesh/generateMapMesh";
import { $getJson } from "./Utils/http.js";
import { generateTrack } from "./Mesh/generateMapMesh.js";
import { tags } from "./Utils/generateLabel.js";
//创建场景
const scene = new THREE.Scene();

//加网格体
generateMapMesh();
scene.add(Group, MapMeshGroup);

//加灯光
scene.add(lightTarget);
MapMeshGroup.add(directionalLight1);
MapMeshGroup.add(directionalLight2);
MapMeshGroup.add(directionalLight3);
MapMeshGroup.add(directionalLight4);

//加飞线
const getH5StaticJson = (data) => {
  return $getJson("/marker.json", data);
};
getH5StaticJson({}).then((res) => {
  let PoistionJson = res.data;
  generateTrack(
    PoistionJson,
    //轨迹线配置
    {
      color: 0x00ccc0, //轨迹线颜色
      width: 1.5, //线宽
      height: 40000, //起始点与终点的中点坐标的线高
    },
    // 飞线配置
    {
      // 0x00fbca
      startColor: 0xffffff, //飞线头部颜色
      endColor: 0xffffff, //飞线尾部颜色
      width: 1.5, //飞线线宽
    }
  );
  tags(PoistionJson);
});

export { scene };
