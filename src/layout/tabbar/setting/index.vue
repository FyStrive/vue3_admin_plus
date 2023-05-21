<template>
  <el-button
    circle
    icon="Refresh"
    size="small"
    @click="refreshUpdate"
  ></el-button>
  <el-button circle icon="FullScreen" size="small" @click="fullScreen"></el-button>
  <el-button circle icon="Setting" size="small"></el-button>
  <img
    :src="userStore.avatar"
    style="width: 24px; height: 24px; margin: 0 10px;border-radius: 50%;"
  />
  <el-dropdown :hide-on-click="false" trigger="click">
    <span class="el-dropdown-link">
      {{ userStore.username }}
      <el-icon class="el-icon--right"><arrow-down /></el-icon>
    </span>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item @click="logOut">退出登录</el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<script setup lang="ts">
import useUserStore from '@/store/module/user.ts'
import { useRouter,useRoute } from 'vue-router'
import useLayoutSettingStore from '@/store/module/setting.ts'
let settingStore = useLayoutSettingStore()
let userStore = useUserStore()
const refreshUpdate = () => {
  settingStore.refresh = !settingStore.refresh
}
// 全屏的方法
const fullScreen = () => {
  // DOM身上的一个属性，可以用来判断当前是否是全屏状态
  let full = document.fullscreenElement
  if(!full){
    //文档的根节点的方法requestFullscreen可以可以实现全屏
    document.documentElement.requestFullscreen()
  }else {
    // 退出全屏
    document.exitFullscreen()
  }
}
let $router = useRouter()
let $route = useRoute()
const logOut =async () => {
  await userStore.logout()
  $router.push({path:'/login',query:{redirect:$route.path}})
}
</script>
<style scoped lang="scss"></style>
