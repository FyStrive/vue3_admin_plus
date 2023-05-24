<template>
  <div>
    <!-- svg图标最外层容器节点，内部需要与use标签结合使用 -->
    <svg :style="{ width: width, height: height }">
      <!-- :xlink:href决定用哪个图标 -->
      <!-- use标签的fill决定颜色 -->
      <use :xlink:href="prefix + name" :fill="color"></use>
    </svg>
  </div>
</template>

<script setup lang="ts">
defineProps({
  //xlink:href属性值的前缀
  prefix: {
    type: String,
    default: '#icon-',
  },
  //svg矢量图的名字
  name: String,
  //svg图标的颜色
  color: {
    type: String,
    default: 'red',
  },
  //svg宽度
  width: {
    type: String,
    default: '16px',
  },
  //svg高度
  height: {
    type: String,
    default: '16px',
  },
})
</script>
<style scoped lang="less"></style>
