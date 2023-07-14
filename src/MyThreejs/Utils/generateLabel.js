import { CSS3DSprite } from "three/addons/renderers/CSS3DRenderer.js";
import * as THREE from "three";
import { lon2xy } from "./toolsBox";
import { MapMeshGroup } from "../Mesh/generateMapMesh";
let LabelGroup = new THREE.Group();
//动态生成红、黄标签节点,并为黄标签绑定事件。
function tags(markerJson) {
  let LabelDom = document.getElementById("label");
  let redParentDom = document.createElement("div");
  let yellowParentDom = document.createElement("div");
  redParentDom.setAttribute("class", "redParentDom");
  yellowParentDom.setAttribute("class", "yellowParentDom");
  let id = 0; //黄色地标id
  let idList = []; //数组对象，用于存储黄色地标对应的位置信息。在触发事件时使用。
  markerJson.mapdata.forEach((item) => {
    item.latlng.forEach((val) => {
      //动态生成红色标记点
      let redChildDom = document.createElement("img");
      redChildDom.src = "/BaseModel/img/redMarker.png";
      redChildDom.style.visibility = "visible";
      redChildDom.style.pointerEvents = "none";
      redParentDom.appendChild(redChildDom);
      let redLabel = new CSS3DSprite(redChildDom);
      redLabel.scale.set(250, 250, 250);
      let xy = lon2xy(val.startLatlng[0], val.startLatlng[1]);
      let pos = new THREE.Vector3(xy.x, xy.y, 20000);
      redLabel.position.copy(pos);
      LabelGroup.add(redLabel);
      //动态生成黄色标记点
      val.endLatlng.forEach((val) => {
        let yellowChildDom = document.createElement("img");
        yellowChildDom.src = "/BaseModel/img/yellowMarker.png";
        yellowChildDom.style.visibility = "visible";
        yellowChildDom.style.pointerEvents = "none";
        yellowChildDom.classList.add(`yellowLabel${id++}`);
        yellowChildDom.classList.add("yellowLabel");
        yellowParentDom.appendChild(yellowChildDom);
        let yellowLabel = new CSS3DSprite(yellowChildDom);
        yellowLabel.scale.set(250, 250, 250);
        let xy = lon2xy(val.latlng[0], val.latlng[1]);
        let pos = new THREE.Vector3(xy.x, xy.y, 20000);
        yellowLabel.position.copy(pos);
        LabelGroup.add(yellowLabel);
        //生成idList
        let obj = {};
        obj.name = yellowChildDom.className.split(" ")[0];
        obj.latlng = [xy.x, xy.y];
        idList.push(obj);
      });
    });
  });
  MapMeshGroup.add(LabelGroup);
  LabelDom.appendChild(redParentDom);
  LabelDom.appendChild(yellowParentDom);

  //黄标签绑定事件
  let yellowLabelEvent = document.getElementsByClassName("yellowLabel");
  let infoDom = document.getElementById("info");
  // infoDom.style.pointerEvents = none;
  Array.from(yellowLabelEvent).forEach((dom) => {
    dom.onmouseover = function (e) {
      let labelName = e.target.className.split(" ")[0];
      console.log(labelName);
      let chooseEle = idList.find((item) => {
        return item.name === labelName;
      });
      let pos = new THREE.Vector3(chooseEle.latlng[0], chooseEle.latlng[1], 28000);
      let infoLabel = new CSS3DSprite(infoDom);
      infoLabel.scale.set(150, 150, 150);
      infoLabel.position.copy(pos);
      LabelGroup.add(infoLabel);
      infoDom.style.visibility = "visible";
    };
    dom.onmouseleave = function () {
      infoDom.style.visibility = "hidden";
    };
  });
}
//1.触发黄色定位事件，显示info标签，获取该标签的位置属性(获取不到)
//
//2.为每个黄色地标，动态生成info标签，并固定位置，触发黄色地标事件，显示info标签。(不知道是哪个黄色地标触发的事件)除非为每个黄色地标都绑定自己的事件？

export { tags };
