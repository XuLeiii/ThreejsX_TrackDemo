<template>
  <div id="label" style="position: relative">
    <div id="info" style="visibility: hidden; position: absolute; width: 137px; height: 44px; background-image: url('/BaseModel/img/label.png'); font-size: 20px; font-weight: 300; line-height: 38px; text-align: center; color: aliceblue">派出所</div>
  </div>
</template>

<script>
import { renderer } from "../MyThreejs/renderLoop.js"; //意味着场景已经渲染好了,等待插入dom标签中显示在网页上.
import { labelRenderer } from "../MyThreejs/RenderCamera/renderCamera";
// import { tags } from "@/MyThreejs/Utils/generateLabel";
export default {
  name: "HelloWorld",
  data() {
    return {
      label: null,
    };
  },
  mounted() {
    document.getElementById("label").appendChild(labelRenderer.domElement); //插入生成好的label标签到html中去
    labelRenderer.domElement.setAttribute("class", "labelLayer");
    document.getElementById("label").appendChild(renderer.domElement);
  },
};
</script>

<style scoped></style>
