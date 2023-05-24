import pinia from '@/store'
import useUserStore from '@/store/module/user'
let userStore = useUserStore(pinia)
export const isHasButton = (app: any) => {
  // 获取对应用户仓库
  // 获取全局自定义指令：实现按钮权限
  app.directive('has', {
    // 代表使用这个全局自定义指令的Dom组件挂载完毕会执行一次
    mounted(el: any, options: any) {
      if (!userStore.buttons.includes(options.value)) {
        el.parentNode.removeChild(el)
      }
    },
  })
}
