// 用户管理模块的接口
import request from '@/utils/request'
import type {
  UserResponseData,
  User,
  AllRoleResponseData,
  SetRoleData,
} from './type.ts'
import { dataTool } from 'echarts'

// 枚举地址
enum API {
  ALLUSER_URL = '/admin/acl/user/',
  ADDUSER_URL = '/admin/acl/user/save',
  UPDATEUSER_URL = '/admin/acl/user/update',
  // 获取当前所有职位，当前账号已有职位的接口
  ALLROLE_URL = '/admin/acl/user/toAssign/',
  // 分配职位
  DOASSIGNROLE_URL = '/admin/acl/user/doAssignRole',
  // 删除一个账号
  DELETEUSER_URL = '/admin/acl/user/remove/',
  DELETEALLUSER_URL = '/admin/acl/user/batchRemove',
}

// 获取全部用户信息的接口
export const reqAllUserInfo = (page: number, limit: number, username: string) =>
  request.get<any, UserResponseData>(
    API.ALLUSER_URL + `${page}/${limit}?username=${username}`,
  )

//添加用户与更新已有用户的接口
export const reqAddOrUpdateUser = (data: User) => {
  // 携带有ID就是更新
  if (data.id) {
    return request({
      url: API.UPDATEUSER_URL,
      method: 'put',
      data,
    })
  } else {
    return request.post(API.ADDUSER_URL, data)
  }
}

export const reqAllRole = (userId: number) => {
  return request.get<any, AllRoleResponseData>(API.ALLROLE_URL + userId)
}
// 分配职位
export const reqSetUserRole = (data: SetRoleData) =>
  request.post<any, any>(API.DOASSIGNROLE_URL, data)

export const reqDeleteUser = (userId: number) =>
  request.delete<any, any>(API.DELETEUSER_URL + userId)

export const reqDeleteAllUser = (userIdList: number[]) =>
  request.delete<any, any>(API.DELETEALLUSER_URL, { data: userIdList })
