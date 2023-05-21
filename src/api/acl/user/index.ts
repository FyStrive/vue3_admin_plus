// 用户管理模块的接口
import request from "@/utils/request"
import type { UserResponseData,User } from "./type.ts"

// 枚举地址
enum API {
    ALLUSER_URL = '/admin/acl/user/',
    ADDUSER_URL = '/admin/acl/user/save',
    UPDATEUSER_URL = '/admin/acl/user/update'
}

// 获取全部用户信息的接口
export const reqAllUserInfo = (page:number,limit:number) => request.get<any,UserResponseData>(API.ALLUSER_URL+`${page}/${limit}`)

//添加用户与更新已有用户的接口
export const reqAddOrUpdateUser = (data:User) => {
    // 携带有ID就是更新
    if(data.id){
        return request({
            url:API.UPDATEUSER_URL,
            method:'put',
            data
        })
    }else{
        return request.post(API.ADDUSER_URL,data)
    }
}