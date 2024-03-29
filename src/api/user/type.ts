// 登录接口需要携带ts参数

export interface loginFormData {
  username: string
  password: string
}

// 全部接口返回的数据都有的类型
export interface ResponseData {
  code: number
  message: string
  ok: boolean
}

// 登录的返回数据
export interface loginResponseData extends ResponseData {
  data: string
}

// 获取用户信息的接口
export interface userInfoResponseData extends ResponseData {
  data: {
    routes: string[]
    buttons: string[]
    roles: string[]
    name: string
    avatar: string
  }
}
