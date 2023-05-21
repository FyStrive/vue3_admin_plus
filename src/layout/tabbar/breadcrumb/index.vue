<template>
    <!-- 顶部左侧的静态 -->
    <el-icon style="margin-right: 10px;" @click="changeFold">
        <component :is="settingStore.fold? 'Expand':'Fold'"></component>
    </el-icon>
    <!-- 左侧面包屑 -->
    <el-breadcrumb separator-icon="ArrowRight">
        <el-breadcrumb-item v-for="(item,index) in $route.matched" :to="item.path" :key="index" v-show="item.meta.icon">
            <el-icon style="margin-right: 3px;vertical-align: top;;">
                <component :is="item.meta.icon"></component>
            </el-icon>
            <span>{{ item.meta.title}}</span>
        </el-breadcrumb-item>
    </el-breadcrumb>
</template>

<script setup lang='ts'>
import { useRoute } from 'vue-router'
import useLayoutSettingStore from '@/store/module/setting.ts'
let settingStore = useLayoutSettingStore()
const changeFold = () => {
    settingStore.fold = !settingStore.fold
}
let $route = useRoute()
console.log($route);
</script>
<style scoped lang='scss'></style>