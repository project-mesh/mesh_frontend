import axios from 'axios'

// 创建 axios 实例
const request = axios.create({
  // API 请求的默认前缀
  baseURL: process.env.VUE_APP_API_BASE_URL,
  timeout: 6000, // 请求超时时间
  responseType: 'json',
  withCredentials: true,
})

// 异常拦截处理器
const errorHandler = (error) => Promise.reject(error)
//
// request interceptor
request.interceptors.request.use((config) => {
  console.log('拦截器：', config)
  return config
}, errorHandler)
//
// response interceptor
request.interceptors.response.use((response) => {
  console.log('response拦截器：', response)
  return response.data
}, errorHandler)

export default request
