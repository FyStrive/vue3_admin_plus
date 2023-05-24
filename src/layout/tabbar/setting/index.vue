<template>
  <el-button
    circle
    icon="Refresh"
    size="small"
    @click="refreshUpdate"
  ></el-button>
  <el-button
    circle
    icon="FullScreen"
    size="small"
    @click="fullScreen"
  ></el-button>
  <!-- 主题模式的弹框 -->
  <el-popover placement="bottom" title="主题模式" :width="200" trigger="hover">
    <el-form>
      <el-form-item label="主题颜色">
        <el-color-picker
          @change="setColor"
          v-model="color"
          size="small"
          show-alpha
          :predefine="predefineColors"
        />
      </el-form-item>
      <el-form-item label="暗黑模式">
        <el-switch
          @change="changeDark"
          v-model="dark"
          class="mt-2"
          style="margin-left: 15px"
          inline-prompt
          active-icon="MoonNight"
          inactive-icon="Sunny"
        />
      </el-form-item>
    </el-form>
    <template #reference>
      <el-button circle icon="Setting" size="small"></el-button>
    </template>
  </el-popover>
  <img
    :src="userStore.avatar"
    style="width: 24px; height: 24px; margin: 0 10px; border-radius: 50%"
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
import { useRouter, useRoute } from 'vue-router'
import { ref } from 'vue'
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
  if (!full) {
    //文档的根节点的方法requestFullscreen可以可以实现全屏
    document.documentElement.requestFullscreen()
  } else {
    // 退出全屏
    document.exitFullscreen()
  }
}
let $router = useRouter()
let $route = useRoute()
const logOut = async () => {
  await userStore.logout()
  $router.push({ path: '/login' })
}
// 主题颜色相关值
const color = ref('white')
const predefineColors = ref([
  '#ff4500',
  '#ff8c00',
  '#ffd700',
  '#90ee90',
  '#00ced1',
  '#1e90ff',
  '#c71585',
  'rgba(255, 69, 0, 0.68)',
  'rgb(255, 120, 0)',
  'hsv(51, 100, 98)',
  'hsva(120, 40, 94, 0.5)',
  'hsl(181, 100%, 37%)',
  'hsla(209, 100%, 56%, 0.73)',
  '#c7158577',
])
// 切换暗黑主题的回调
const changeDark = () => {
  let html = document.documentElement
  // 加上dark即实现切换
  dark.value ? (html.className = 'dark') : (html.className = '')
}
let dark = ref<boolean>(false)
const setColor = () => {
  let html = document.documentElement
  html.style.setProperty('--el-color-primary', color.value)
}
</script>
<style scoped lang="scss"></style>
