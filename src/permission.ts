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
// 全局守卫，任意路由切换都会触发的钩子
router.beforeEach((to, from, next) => {
  nprogress.start()
  let token = userStore.token
  let username = userStore.username
  if (token) {
    //登录时
    if (to.path === '/login') {
      next({ path: '/' })
    } else {
      // 有用户信息放行
      if (username) {
        next()
      } else {
        // 没有用户信息就发请求
        userStore.userInfo().then(
          () => {
            // console.log(res,'res');
            //这样可以保证异步路由组件加载完毕再放行 不会出现白屏现象
            next({ ...to })
          },
          () => {
            // 失败是因为token到期或者人为修改token
            userStore.logout().then(
              () => {
                console.log(111)
                next({ path: '/login', query: { redirect: to.path } })
              },
              (reason) => {
                next('/login')
                alert(reason)
              },
            )
            // console.log(reason,'reason')
          },
        )
      }
    }
  } else {
    //未登录时
    if (to.path == '/login') {
      console.log(123213)
      next()
    } else {
      next({ path: '/login', query: { redirect: to.path } })
    }
  }
})

router.afterEach((to, from) => {
  document.title = `${setting.title}-${to.meta.title}`
  nprogress.done()
})

// 用户在未登录的时候只能访问登录页面
// 登录的时候不能访问登录页面
