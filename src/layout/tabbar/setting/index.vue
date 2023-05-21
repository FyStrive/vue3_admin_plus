<template>
  <el-button
    circle
    icon="Refresh"
    size="small"
    @click="refreshUpdate"
  ></el-button>
  <el-button circle icon="FullScreen" size="small"></el-button>
  <el-button circle icon="Setting" size="small"></el-button>
  <img
    src="../../../public/vite.svg"
    style="width: 24px; height: 24px; margin: 0 10px"
  />
  <el-dropdown :hide-on-click="false" trigger="click">
    <span class="el-dropdown-link">
      admin
      <el-icon class="el-icon--right"><arrow-down /></el-icon>
    </span>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item>退出登录</el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<script setup lang="ts">
import useLayoutSettingStore from '@/store/module/setting.ts'
let settingStore = useLayoutSettingStore()
const refreshUpdate = () => {
  settingStore.refresh = !settingStore.refresh
}
</script>
<style scoped lang="scss"></style>
