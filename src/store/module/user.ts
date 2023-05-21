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
import { constantRoute } from '@/router/routes.ts'
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
