import { createApp } from 'vue'
// 引入ElementPlus的样式与包
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
//@ts-ignore 忽略当前文件ts类型的检测是否有红色提示 会导致打包失败
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
import App from '@/App.vue'
//引入全局样式
import '@/styles/index.scss'
//配置使用svg图标
import 'virtual:svg-icons-register'
//引入注册全局组件的插件
import globalComponent from '@/components'
// 获得应用实例
const app = createApp(App)
app.use(ElementPlus)
app.use(globalComponent)
//这是国际化配置
app.use(ElementPlus, {
  locale: zhCn,
})
// 将实例挂载到根元素身上
app.mount('#app')
