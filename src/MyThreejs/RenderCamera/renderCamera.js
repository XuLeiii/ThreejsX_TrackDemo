import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { CSS3DRenderer } from "three/addons/renderers/CSS3DRenderer.js";

//Camera生成
const camera = new THREE.PerspectiveCamera(
  45,
  window.innerWidth / window.innerHeight,
  0.1,
  5000000000
);

//WebGLRenderer渲染器
const renderer = new THREE.WebGLRenderer({
  antialias: true,
  logarithmicDepthBuffer: true, //深度冲突
  alpha: true,
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);

//OrbitControls轨道控制器
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true; //启动阻尼
// controls.enableZoom = false; //禁止缩放
//controls.enablePan = false;//禁止平移
controls.maxAzimuthAngle = (Math.PI / 180) * 30; //水平旋转
controls.minAzimuthAngle = -(Math.PI / 180) * 30;
controls.minPolarAngle = (Math.PI / 180) * -30; //垂直旋转
controls.maxPolarAngle = (Math.PI / 180) * 90;

//CSS3DRenderer渲染器
let labelRenderer = new CSS3DRenderer();
labelRenderer.setSize(window.innerWidth, window.innerHeight);
labelRenderer.domElement.style.position = "absolute";
labelRenderer.domElement.style.pointerEvents = "none";

//渲染画布自适应窗口
window.addEventListener("resize", () => {
  renderer.setSize(window.innerWidth, window.innerHeight); //重设WebGLRenderer渲染器画布尺寸
  labelRenderer.setSize(window.innerWidth, window.innerHeight); //重设CSS3DRenderer渲染器画布尺寸
  camera.aspect = window.innerWidth / window.innerHeight; //重设相机长宽比
  camera.updateProjectionMatrix(); //更新相机矩阵
});

//相机位置自适应
function cameraPositionSet(Group) {
  const box3 = new THREE.Box3();
  box3.expandByObject(Group);
  const size = new THREE.Vector3();
  box3.getSize(size); //包围盒长宽高
  const center = new THREE.Vector3();
  box3.getCenter(center); //计算包围盒几何体中心坐标
  camera.position.set(center.x, center.y + size.y * 5, center.z + size.z * 0.9);
  controls.target.set(center.x, center.y, 0);
}

export { camera, renderer, controls, labelRenderer, cameraPositionSet };
