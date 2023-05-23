// 角色模块的接口
import request from '@/utils/request'
import type { RoleResponseDdata, RoleData,MenuResponseData } from './type'

// 枚举接口地址
enum API {
  // 获取全部职位的接口
  ALLROLE_URL = '/admin/acl/role/',
  //新增职位
  ADDROLE_URL = '/admin/acl/role/save',
  // 更新职位
  UPDATEROLE_URL = '/admin/acl/role/update',
  ALLPERMISSION = '/admin/acl/permission/toAssign/',
  // 给相应职位派发权限
  SETPERMISSION_URL = '/admin/acl/permission/doAssign',
  // 删除已有职位
  REMOVEROLE_URL = '/admin/acl/role/remove/'
}

// 获取全部角色
export const reqAllRoleList = (
  page: number,
  limit: number,
  roleName: string,
) => {
  return request.get<any, RoleResponseDdata>(
    API.ALLROLE_URL + `${page}/${limit}?roleName=${roleName}`,
  )
}

// 添加与更新职位的接口
export const reqAddOrUpdateRole = (data: RoleData) => {
  if (data.id) {
    return request.put<any, any>(API.UPDATEROLE_URL, data)
  } else {
    return request.post<any, any>(API.ADDROLE_URL, data)
  }
}

// 派发权限
export const reqSetPermission = (roleId:number,permissionId:number[]) => request.post<any,any>(API.SETPERMISSION_URL+`?roleId=${roleId}&permissionId=${permissionId}`)

// 获取全部菜单与按钮权限的数据
export const reqAllMenuList = (roleId:number) => request.get<any,MenuResponseData>(API.ALLPERMISSION+roleId)

// 删除职位
export const reqRemoveRole = (roleId:number) =>request.delete<any,any>(API.REMOVEROLE_URL+roleId)