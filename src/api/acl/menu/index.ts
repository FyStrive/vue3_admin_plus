// 角色模块的接口
import request from '@/utils/request'
import type {  PermissionResponseData, MenuParams } from './type'

// 枚举接口地址
enum API {
    // 获取所有菜单与按钮权限的接口地址
  ALLPERMISSION_URL = '/admin/acl/permission',
  // 新增菜单
  ADDMENU_URL = '/admin/acl/permission/save',
  UPDATEMEUN_URL = '/admin/acl/permission/update',
  // 删除菜单
  REMOVEMENU_URL = '/admin/acl/permission/remove/'
}

// 获取菜单与按钮
export const reqAllPermission = () => request.get<any,PermissionResponseData>(API.ALLPERMISSION_URL)

// 添加与更新菜单的方法
export const reqAddOrUpdateMenu = (data:MenuParams) => {
  if(data.id) {
    return request.put<any,any>(API.UPDATEMEUN_URL,data)
  }else {
    return request.post<any,any>(API.ADDMENU_URL,data)
  }
}

// 删除
export const reqRemoveMenu = (id:number) => request.delete<any,any>(API.REMOVEMENU_URL+id)