// 角色模块的接口
import request from '@/utils/request'
import type { RoleResponseDdata,RoleData } from './type'

// 枚举接口地址
enum API {
    // 获取全部职位的接口
    ALLROLE_URL = '/admin/acl/role/',
    //新增职位
    ADDROLE_URL = '/admin/acl/role/save',
    // 更新职位
    UPDATEROLE_URL = '/admin/acl/role/update'
}

// 获取全部角色
export const reqAllRoleList = (page:number,limit:number,roleName:string) => {
    return request.get<any,RoleResponseDdata>(API.ALLROLE_URL+`${page}/${limit}?roleName=${roleName}`)
}

// 添加与更新职位的接口
export const reqAddOrUpdateRole = (data:RoleData) => {
    if(data.id){
        return request.put<any,any>(API.UPDATEROLE_URL,data)
    }else{
        return request.post<any,any>(API.ADDROLE_URL,data)
    }
}