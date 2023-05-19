import { createRouter, createWebHashHistory } from 'vue-router'
import { constantRoute } from './routes'

//创建路由器

let router = createRouter({
  // 路由模式为hash
  history: createWebHashHistory(),
  routes: constantRoute,
  //滚动行为，切换路由自动到顶端
  scrollBehavior() {
    return {
      left: 0,
      top: 0,
    }
  },
})
export default router
