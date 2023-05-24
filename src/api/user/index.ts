// 统一管理项目用户相关接口
import request from '@/utils/request.ts'
import type {
  loginFormData,
  loginResponseData,
  userInfoResponseData,
} from './type'
// 统一管理接口
enum API {
  LOGIN_URL = '/admin/acl/index/login',
  USERINFO_URL = '/admin/acl/index/info',
  LOGOUT_URL = '/admin/acl/index/logout',
}

// 暴露请求函数

// 登录接口
export const reqLogin = (data: loginFormData) =>
  request.post<any, loginResponseData>(API.LOGIN_URL, data)

// 获取用户信息的接口
export const reqUserInfo = () =>
  request.get<any, userInfoResponseData>(API.USERINFO_URL)

//退出登录的接口
export const reqLogout = () => request.post<any, any>(API.LOGOUT_URL)
