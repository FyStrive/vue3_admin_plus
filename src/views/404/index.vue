<template>
  <div class="error">
    <img src="@/assets/images/error_images/404.png" alt="">
    <el-button class="button" type="primary" @click="goHome">首页</el-button>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
let $router = useRouter()
let goHome = () => {
  $router.replace('/home')
}
</script>
<style scoped lang="scss">
.error {
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  img {
    width: 80vw;
    height: 80vh;
  }
  .button{
    position: relative;
    left: -46vw;
    top:20vh;
  }
  
}
</style>
