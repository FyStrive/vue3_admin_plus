// 小仓库，layout相关配置
import { defineStore } from 'pinia'

let useLayoutSettingStore = defineStore('SettingStore', {
  state: () => {
    return {
      fold: false, //用来控制用户菜单折叠还是收起控制
      refresh: false, //用来控制页面刷新
    }
  },
})

export default useLayoutSettingStore
