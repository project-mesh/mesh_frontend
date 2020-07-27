import axios from 'axios'

// 创建 axios 实例
const request = axios.create({
  // API 请求的默认前缀
  // baseURL: process.env.VUE_APP_API_BASE_URL,
  baseURL: 'http://0.0.0.0:5000/api/',
  timeout: 6000, // 请求超时时间
  responseType: 'json',
})

// 异常拦截处理器
const errorHandler = (error) => Promise.reject(error)
//
// // request interceptor
// request.interceptors.request.use((config) => config, errorHandler)
//
// response interceptor
request.interceptors.response.use((response) => response.data, errorHandler)

export default request
