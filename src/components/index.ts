// 这是一个插件，实现自动注册所有全局组件
import { App } from 'vue'
//引入项目中全部全局组件
import SvgIcon from './SvgIcon.vue'
import Pagination from './Pagination/index.vue'
import Category from './Category/index.vue'
// 引入element中所有icon图标
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
// console.log(typeof SvgIcon)
//全局对象
const allGloablComponent = { SvgIcon,Pagination, Category }

// 对外暴露插件对象 ，插件对象身上需有install方法
export default {
  install(app: App) {
    //注册项目中全部的全局组件
    Object.keys(allGloablComponent).forEach((key) => {
      //注册为全局组件
      app.component(key, allGloablComponent[key])
    })
    // console.log(Object.entries(ElementPlusIconsVue));
    for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
      app.component(key, component)
    }
  },
}
