import type { RouteRecordRaw } from 'vue-router'
// 用户仓库的数据类型
export interface userStoreType {
  token: string | null
  routeMenus: RouteRecordRaw[]
  avatar: string
  username: string
}
