import * as THREE from "three";
import { FontLoader } from "three/addons/loaders/FontLoader.js";
import { TextGeometry } from "three/addons/geometries/TextGeometry.js";
import { MapMeshGroup } from "./generateMapMesh";
//传入要生成的字和字体的位置
/**
 * 生成地图上省会名字的网格体
 * @param {String} fontContent 文字名称
 * @param {Object} fontPosition 省会中心坐标
 */
function generateFont(fontContent, fontPosition) {
  const textLoader = new FontLoader();
  textLoader.load("BaseModel/Fonts/DengXian_Bold_name.json", function (font) {
    let text = new TextGeometry(fontContent, {
      font: font,
      size: 5000,
      height: 2500,
      curveSegments: 1,
    });
    let textmaterial1 = new THREE.MeshBasicMaterial({
      // wireframe: true,
      color: 0xffffff,
    });
    let textmaterial2 = new THREE.MeshBasicMaterial({
      // wireframe: true,
      color: 0x0070ff,
    });
    let textMesh = new THREE.Mesh(text, [textmaterial1, textmaterial2]);
    text.translate(-10000, 0, 0);
    textMesh.position.copy(fontPosition);
    MapMeshGroup.add(textMesh);
    return MapMeshGroup;
  });
}

export { MapMeshGroup, generateFont };
