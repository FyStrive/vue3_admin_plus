import type { RouteRecordRaw } from 'vue-router'
import type { CategoryObj } from '@/api/product/attr/type'
// 用户仓库的数据类型
export interface userStoreType {
  token: string | null
  routeMenus: RouteRecordRaw[]
  avatar: string
  username: string
  buttons: string[]
  userAsyncRoute: string[]
}
//定义分类仓库state对象的ts类型
export interface CategoryState {
  c1Id: string | number
  c1Arr: CategoryObj[]
  c2Arr: CategoryObj[]
  c2Id: string | number
  c3Arr: CategoryObj[]
  c3Id: string | number
}
