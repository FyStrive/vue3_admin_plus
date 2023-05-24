// 创建用户相关的仓库
import { defineStore } from 'pinia'
import { reqLogin, reqUserInfo, reqLogout } from '@/api/user'
import type {
  loginFormData,
  loginResponseData,
  userInfoResponseData,
} from '@/api/user/type.ts'
import { userStoreType } from './types.ts'
import { SET_TOKEN, GET_TOKEN, REMOVE_TOKEN } from '@/utils/token.ts'
// 引入常量路由
import { constantRoute, asyncRoute } from '@/router/routes.ts'
// 引入深拷贝
//@ts-ignore
import cloneDeep from 'lodash/cloneDeep'
import router from '@/router/index.ts'
// import router from '@/router/index.ts'
//根据后端返回的路由表进行过滤得到用户的路由表
function filterAsyncRoute(asyncRoute: any, routes: any) {
  return asyncRoute.filter((item) => {
    if (routes.includes(item.name)) {
      if (item.children && item.children.length > 1) {
        item.children = filterAsyncRoute(item.children, routes)
      }
      return true
    }
  })
}
// 创建用户仓库
let useUserStore = defineStore('User', {
  state: (): userStoreType => {
    return {
      token: GET_TOKEN(), //用户唯一表示token
      routeMenus: constantRoute, //仓库存储生成菜单需要数组(路由)
      avatar: '',
      username: '',
      buttons: [], //存储按钮权限
      userAsyncRoute: [], //需要在路由守卫中动态加到router路由表中的路由
    }
  },

  //异步方法 逻辑处理
  actions: {
    async userLogin(data: loginFormData) {
      let result: loginResponseData = await reqLogin(data)
      if (result.code == 200) {
        // pinia仓库存储一份
        this.token = result.data as string
        // 本地存储一份  pinia+localStorage可实现永久存储
        SET_TOKEN(result.data as string)
        // localStorage.setItem('token',(result.data.token) as string)
        return 'loginSuccess'
      } else {
        return Promise.reject(result.message)
      }
    },
    // 获取用户信息
    async userInfo() {
      //获取用户信息进行存储仓库当中[用户头像、名字]
      console.log('userinfo')
      const result: userInfoResponseData = await reqUserInfo()
      //如果获取用户信息成功，存储一下用户信息
      if (result.code == 200) {
        this.username = result.data.name
        this.avatar = result.data.avatar
        this.buttons = result.data.buttons
        //计算当前用户需要展示的异步路由
        const userAsyncRoute = filterAsyncRoute(
          cloneDeep(asyncRoute),
          result.data.routes,
        )
        //菜单需要的数据整理完毕
        this.routeMenus = [...constantRoute, ...userAsyncRoute]
        //目前路由器管理的只有常量路由:用户计算完毕异步路由、任意路由动态追加
        this.userAsyncRoute = userAsyncRoute
        ;[...userAsyncRoute].forEach((route: any) => {
          console.log(1111)
          router.addRoute(route)
        })
        return 'ok'
      } else {
        return Promise.reject(new Error(result.message))
      }
    },
    async logout() {
      let result: any = await reqLogout()
      if (result.code === 200) {
        this.avatar = ''
        this.username = ''
        REMOVE_TOKEN()
        this.token = ''
        return '退出登录成功!'
      } else {
        return Promise.reject(new Error(result.message))
      }
    },
  },
  getters: {},
})

export default useUserStore
