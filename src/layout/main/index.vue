<template>
    <!-- 二级路由的出口位置，封装加过渡效果 -->
    <router-view v-slot="{Component}">
        <transition name="fade">
            <!-- 渲染二级路由 -->
            <component :is="Component" v-if="flag"></component>
        </transition>
    </router-view>
</template>

<script setup lang='ts'>
import {watch,ref, nextTick} from 'vue'
import useLayoutSettingStore from '@/store/module/setting.ts'
let settingStore = useLayoutSettingStore()
let flag = ref(true)
watch(() => settingStore.refresh,() => {
    //当监听到refresh的值发生变化后，就先把该组件销毁，然后在DOM更新完后重新创建
    //除了用nextTick实现，还可以通过改变key值实现
    flag.value = false
    nextTick(() => {
        flag.value = true
    })
})
</script>
<style scoped lang='scss'>
.fade-enter-from{
    opacity: 0;
    transform: scale(0);
}
.fade-enter-active{
    transition: all .3s;
}
.fade-enter-to{
    opacity: 1;
    transform: scale(1);
}
</style>