<template>
  <el-card style="height: 160px;" >
    <div class="avatar">
      <div class="logo">
        <img :src="userStore.avatar" alt="">
      </div>
      <div class="title">
        <h3>Hi,{{ userStore.username }},{{ getTime() }}好呀</h3>
        <span>Admin-plus</span>
      </div>
    </div>
  </el-card>
  <svg-icon name="welcome" width="600px" height="400px" class="svg"></svg-icon>
</template>

<script setup lang="ts">
import { getTime } from '@/utils/time'
import useUserStore from '@/store/module/user.ts'
let userStore = useUserStore()
</script>
<style scoped lang="scss">
.avatar {
  display: flex;
  .logo{
    img{
      width: 120px;
      height: 120px;
      border-radius: 50%;
    }
  }
  .title{
    h3{
      font-size: 36px;
      margin-left: 20px;
      margin-top: 20px;
    }
    span{
      display: block;
      margin-top: 30px;
      margin-left: 60px;
      font-style:italic;
      color: aquamarine;
    }
  }
}
.svg {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
}
</style>
