import * as THREE from "three";
import { cameraPositionSet } from "../RenderCamera/renderCamera";
import { generateFont } from "./generateFontMesh";
import { generateMaterial } from "../Material/generateMaterial";
import { lon2xy } from "../Utils/toolsBox";
import { LineMaterial } from "three/examples/jsm/lines/LineMaterial.js";
import { Line2 } from "three/examples/jsm/lines/Line2.js";
import { LineGeometry } from "three/examples/jsm/lines/LineGeometry.js";

//生成模型
let Group = new THREE.Group();
let MapMeshGroup = new THREE.Group();
async function generateMapMesh() {
  const loaderfile = new THREE.FileLoader();
  loaderfile.setResponseType("json");
  await new Promise((resolve) => {
    loaderfile.load("/BaseModel/GEOJSON/mapData.json", async (data) => {
      data.features.forEach((item) => {
        if (item.geometry.type === "Polygon") {
          item.geometry.coordinates = [item.geometry.coordinates];
        }
        let xy = lon2xy(item.properties.centroid[0], item.properties.centroid[1]); //每个网格体自带的中心点数据
        item.geometry.coordinates.forEach((point) => {
          let pointArry = []; //点数组
          let shapeArr = []; //形状数组
          point[0].forEach((val) => {
            let xy = lon2xy(val[0], val[1]);
            pointArry.push(new THREE.Vector2(xy.x, xy.y));
          });
          // 1.模型
          const shape = new THREE.Shape(pointArry); //传入矢量空间点坐标,生成二维形状平面缓冲几何体。
          shapeArr.push(shape);
          const shapeGeometry = new THREE.ExtrudeGeometry(shapeArr, {
            depth: 20000,
            bevelEnabled: false,
          });
          let shapeMesh = generateMaterial(shapeGeometry); //生成具有网格体的数组
          shapeMesh.userData.name = item.properties.name; //为网格体添加名称属性name
          shapeMesh.userData.center = lon2xy(item.properties.center[0], item.properties.center[1]);
          MapMeshGroup.add(shapeMesh);
          Group.add(MapMeshGroup);
          Group.position.set(xy.x, xy.y, 0); //在世界坐标中移动
          MapMeshGroup.position.set(-xy.x, -xy.y, 0); //Group
          Group.rotation.x = -Math.PI / 2;
          //2.线框
          let lineArry = [];
          point[0].forEach((val) => {
            let xy = lon2xy(val[0], val[1]);
            lineArry.push(xy.x, xy.y, 20500);
          });
          const lineGeometry = new THREE.BufferGeometry();
          const vertices = new Float32Array(lineArry);
          const attribute = new THREE.BufferAttribute(vertices, 3); //三个点为一个空间坐标点
          lineGeometry.attributes.position = attribute; //将空间坐标点赋值为lineGeometry
          const material = new THREE.LineBasicMaterial({
            color: 0x67cde2,
            linewidth: 100,
          });
          const lineMesh = new THREE.LineLoop(lineGeometry, material);
          MapMeshGroup.add(lineMesh);
        });
        // 4.地名文字
        let pos = new THREE.Vector3(xy.x, xy.y, 20000);
        generateFont(item.properties.name, pos);
      });
      resolve();
    });
  });
  cameraPositionSet(Group);
}

//生成飞线
let points2 = null;
let index = 20; //取点索引位置
let num = 10; //从曲线上获取点数量(脉冲线长度)
let trackAttributeArr = [];
let speed = 0.1; //脉冲速度
function generateTrack(markerJson, lineOptions, trackOptions) {
  let lineFlyGroup = new THREE.Group();
  let trackFlyGroup = new THREE.Group();
  let lineColor = lineOptions.color; //轨迹线颜色
  let lineWidth = lineOptions.width; //轨迹线宽
  let lineHeight = lineOptions.height; //轨迹线中点坐标高度(m)
  let trackColor_Start = trackOptions.startColor; //飞线头部颜色
  let trackColor_End = trackOptions.endColor; //飞线尾部颜色
  let trackWidth = trackOptions.width; //飞线线宽
  markerJson.mapdata.forEach((item) => {
    item.latlng.forEach((val) => {
      let xy = lon2xy(val.startLatlng[0], val.startLatlng[1]); //起始点经纬度坐标转墨卡托坐标
      val.endLatlng.forEach((itemVal) => {
        let mn = lon2xy(itemVal.latlng[0], itemVal.latlng[1]); //终点坐标
        let curve = new THREE.CatmullRomCurve3([new THREE.Vector3(xy.x, xy.y, 20000), new THREE.Vector3((xy.x + mn.x) / 2, (xy.y + mn.y) / 2, lineHeight), new THREE.Vector3(mn.x, mn.y, 20000)], false, "catmullrom", 0.5);
        let points = curve.getSpacedPoints(100);
        let pointArr1 = [];
        points.forEach((v3) => {
          pointArr1.push(v3.x, v3.y, v3.z);
        });
        let geometry = new LineGeometry(); //创建一个缓冲类型几何体
        geometry.setPositions(pointArr1);
        var material = new LineMaterial({
          color: lineColor, //设置线条颜色值
          linewidth: lineWidth, // 设置线宽
          vertexColors: false,
        });
        material.resolution.set(window.innerWidth, window.innerHeight); //材质输入Three.js渲染canvas画布的宽高度
        let line = new Line2(geometry, material); //线条模型对象
        lineFlyGroup.add(line);
        //飞线

        let pointArr2 = [];
        points2 = points.slice(index, index + num); //从曲线上获取一段
        let curve1 = new THREE.CatmullRomCurve3(points2);
        let newPoints2 = curve1.getSpacedPoints(100); //获取更多的点数
        newPoints2.forEach((v) => {
          pointArr2.push(v.x, v.y, v.z);
        });
        let geometry2 = new LineGeometry();
        geometry2.setPositions(pointArr2);

        // 批量计算所有顶点颜色数据
        var posNum = points2.length - 2;
        var colorArr = [];
        for (var i = 0; i < points2.length; i++) {
          var color1 = new THREE.Color(trackColor_End); //飞线尾部颜色
          var color2 = new THREE.Color(trackColor_Start); //飞线头部颜色
          var color = null;
          if (i < posNum) {
            color = color1.lerp(color2, i / posNum);
          } else {
            color = color2.lerp(color1, (i - posNum) / (points2.length - posNum));
          }
          colorArr.push(color.r, color.g, color.b);
        }
        // 设定每个顶点对应的颜色值
        geometry2.setColors(colorArr);
        var material2 = new LineMaterial({
          linewidth: trackWidth, // 设置线宽
          vertexColors: false, // 注释color设置，启用顶点颜色渲染
        });
        material2.resolution.set(window.innerWidth, window.innerHeight);
        let line2 = new Line2(geometry2, material2);
        trackFlyGroup.add(line2);
        //创建飞线属性组，便于动画遍历
        let trackAttribute = new Object();
        trackAttribute.latlng = points;
        trackAttribute.geometry = geometry2;
        trackAttributeArr.push(trackAttribute);
      });
    });
  });
  MapMeshGroup.add(lineFlyGroup);
  MapMeshGroup.add(trackFlyGroup);
  Group.add(MapMeshGroup);
}

//飞线动画
function flyAnimate() {
  trackAttributeArr.forEach((item) => {
    let points = item.latlng;
    let indexMax = points.length - num; //飞线取点索引范围
    if (index > indexMax) index = 0;
    index += speed;
    points2 = points.slice(index, index + num); //从曲线上获取一段
    let pointArr = [];
    points2.forEach(function (v3) {
      pointArr.push(v3.x, v3.y, v3.z);
    });
    item.geometry.setPositions(pointArr);
  });
}

export { Group, generateTrack, flyAnimate, MapMeshGroup, generateMapMesh };
