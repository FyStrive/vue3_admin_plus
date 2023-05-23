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
import { constantRoute,asyncRoute,anyRoute } from '@/router/routes.ts'
// 引入深拷贝
//@ts-ignore
import cloneDeep from 'lodash/cloneDeep'
import router from '@/router/index.ts'
//根据后端返回的路由表进行过滤得到用户的路由表
function filterAsyncRoute(asyncRoute:any,routes:any){
  return asyncRoute.filter(item => {
    if(routes.includes(item.name)){
      if(routes.children && routes.children.length > 1){
        item.children =  filterAsyncRoute(item.children,routes)
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
        return Promise.reject(result.data)
      }
    },
    // 获取用户信息
    async userInfo() {
      let result: userInfoResponseData = await reqUserInfo()
      console.log(result)
      if (result.code === 200) {
        this.avatar = result.data.avatar
        this.username = result.data.name
        // 计算当前用户需要展示的异步路由
        let userAsyncRoute = filterAsyncRoute(cloneDeep(asyncRoute),result.data.routes)
        // 左侧菜单需要展示的数据
        this.routeMenus = [...constantRoute,...userAsyncRoute,anyRoute];
        // 动态往路由器里追加异步路由
        [...userAsyncRoute,anyRoute].forEach((route:any) => {
          router.addRoute(route)
        })
        return '获取用户信息成功!'
      } else {
        return Promise.reject('获取用户信息失败!')
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
