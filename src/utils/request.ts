// 对axios进行二次封装
import axios from 'axios'
import { ElMessage } from 'element-plus'
// 利用axios对象的create方法创建一个实例
import useUserStore from '@/store/module/user.ts'
let request = axios.create({
  baseURL: import.meta.env.VITE_APP_BASE_API,
  timeout: 5000,
})

// 配置请求拦截器
request.interceptors.request.use((config) => {
  //config配置对象，headers属性请求头，经常用来给服务器携带参数
  let userStore = useUserStore()
  if (userStore.token) {
    config.headers.token = userStore.token
  }
  return config
})

request.interceptors.response.use(
  (response) => {
    // 简化传回来的数据
    return response.data
  },
  (error) => {
    //失败回调，用来处理http网络错误
    // 定义一个变量 存储网络错误信息
    let message: string = ''
    //http状态码
    let status = error.response.status
    switch (status) {
      case 401:
        message = 'token过期'
        break
      case 403:
        message = '无权访问'
        break
      case 404:
        message = '请求地址出错'
        break
      case 500:
        message = '服务器出现问题'
        break
      default:
        message = '网路出错'
        break
    }
    ElMessage({
      type: 'error',
      message,
    })
    return Promise.reject(error)
  },
)

export default request
