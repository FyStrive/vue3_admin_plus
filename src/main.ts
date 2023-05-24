import { createApp } from 'vue'
// 引入ElementPlus的样式与包
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
//@ts-ignore 忽略当前文件ts类型的检测是否有红色提示 会导致打包失败
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
import App from '@/App.vue'
// 引入路由
import router from './router'
import 'element-plus/theme-chalk/dark/css-vars.css'
// import './styles/dark/css-vars.css'
//引入全局样式
import '@/styles/index.scss'
//配置使用svg图标
import 'virtual:svg-icons-register'
//引入注册全局组件的插件
import globalComponent from '@/components'
// 引入pinia仓库
import pinia from './store'
// 引入全局路由守卫鉴权
import './permission.ts'
// 获得应用实例
const app = createApp(App)
app.use(ElementPlus)
app.use(globalComponent)
//注册全局仓库
app.use(pinia)
//这是国际化配置
app.use(ElementPlus, {
  locale: zhCn,
})

// 注册模板路由
app.use(router)
// 引入自定义指令文件
import { isHasButton } from './directive/has.ts'
// 调用这个方法
isHasButton(app)
// 将实例挂载到根元素身上
app.mount('#app')
