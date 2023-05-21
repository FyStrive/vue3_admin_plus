// 创建用户相关的仓库
import { defineStore } from 'pinia'
import { reqLogin } from '@/api/user'
import { loginForm, loginResponseData } from '@/api/user/type'
import { userStoreType } from './types.ts'
import { SET_TOKEN, GET_TOKEN } from '@/utils/token.ts'
// 引入常量路由
import { constantRoute } from '@/router/routes.ts'
// 创建用户仓库
let useUserStore = defineStore('User', {
  state: (): userStoreType => {
    return {
      token: GET_TOKEN(),//用户唯一表示token
      routeMenus:constantRoute//仓库存储生成菜单需要数组(路由)
    }
  },

  //异步方法 逻辑处理
  actions: {
    async userLogin(data: loginForm) {
      let result: loginResponseData = await reqLogin(data)
      if (result.code == 200) {
        // pinia仓库存储一份
        this.token = result.data.token as string
        // 本地存储一份  pinia+localStorage可实现永久存储
        SET_TOKEN(result.data.token as string)
        // localStorage.setItem('token',(result.data.token) as string)
        return 'loginSuccess'
      } else {
        return Promise.reject(result.data)
      }
    },
  },
  getters: {},
})

export default useUserStore
