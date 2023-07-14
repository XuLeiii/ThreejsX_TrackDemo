import { scene } from "./generateWorld.js";
import { camera, renderer, controls } from "./RenderCamera/renderCamera.js";
import { flyAnimate } from "./Mesh/generateMapMesh.js";
import { labelRenderer } from "./RenderCamera/renderCamera";
function render() {
  controls.update();
  renderer.render(scene, camera);
  labelRenderer.render(scene, camera);
  flyAnimate();
  requestAnimationFrame(render);
  // console.log(camera.position);
}
render();

export { renderer };
