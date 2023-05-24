// 进行路由鉴权 即（某个路由什么时候能访问，什么时候不能访问）
import router from './router'
import nprogress from 'nprogress'
// 引入进度条的样式
import 'nprogress/nprogress.css'
import pinia from '@/store/index.ts'
import setting from './setting'
// 引入用户仓库拿到token
import useUserStore from '@/store/module/user.ts'
let userStore = useUserStore(pinia)
nprogress.configure({ showSpinner: false })
//用来决定是否动态加载路由
// 全局守卫，任意路由切换都会触发的钩子
router.beforeEach(async (to: any, from: any, next: any) => {
  document.title = `${setting.title} - ${to.meta.title}`
  //to:你将要访问那个路由
  //from:你从来个路由而来
  //next:路由的放行函数
  nprogress.start()
  //获取token,去判断用户登录、还是未登录
  const token = userStore.token
  //获取用户名字
  const username = userStore.username
  //用户登录判断
  if (token) {
    //登录成功,访问login,不能访问,指向首页
    if (to.path == '/login') {
      next({ path: '/' })
    } else {
      //登录成功访问其余六个路由(登录排除)
      //有用户信息
      console.log(from, to, 'fromto')
      if (username) {
        //放行
        next()
      } else {
        //如果没有用户信息,在守卫这里发请求获取到了用户信息再放行
        try {
          //获取用户信息
          await userStore.userInfo()
          //万一:刷新的时候是异步路由,有可能获取到用户信息、异步路由还没有加载完毕,出现空白的效果
          next({ ...to })
        } catch (error) {
          //token过期:获取不到用户信息了
          //用户手动修改本地存储token
          //退出登录->用户相关的数据清空
          await userStore.logout()
          next({ path: '/login', query: { redirect: to.path } })
        }
      }
    }
  } else {
    //用户未登录判断
    if (to.path == '/login') {
      next()
    } else {
      next({ path: '/login', query: { redirect: to.path } })
    }
  }
})
//全局后置守卫
router.afterEach((to: any, from: any) => {
  nprogress.done()
})

// 用户在未登录的时候只能访问登录页面
// 登录的时候不能访问登录页面
