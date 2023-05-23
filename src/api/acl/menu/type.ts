export interface ResponseData {
    code: number
    message: string
    ok: boolean
  }

  // 菜单与按钮数据的ts类型
export interface Permission {
    id:number,
    createTime:string,
    updateTime:string,
    pid:number,
    name:string,
    code:null,
    toCode:null,
    type:number,
    status:null,
    level:number,
    children?:PermissionList,
    select:boolean
  }
  export type PermissionList  = Permission[]  
  // 菜单权限与按钮权限
export interface PermissionResponseData extends ResponseData {
    data:PermissionList
  }


  // 添加与修改菜单携带的参数的ts类型
  export interface MenuParams {
    id?:number,//ID 更新有ID 添加无
    code:string,//权限数值
    level:number,//几级菜单
    name:string,//菜单名
    pid:number//菜单ID
  }