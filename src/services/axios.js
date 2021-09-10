import axios from 'axios'


// 获取token token会过期
// http://59.56.182.79:9192/api/login
// md5密码 e10adc3949ba59abbe56e057f20f883e

const baseURL = "http://59.56.182.79:9192/api/hrpInterface/executeCodeBlockJson"

export function request(config) {

  //创建axios实例
  const instance = axios.create({
    baseURL,
    timeout: 10000,
    headers: {
      "Authentication": config.token,
      'content-type': 'application/json'
    }
  })

  // axios的拦截器
  instance.interceptors.request.use(res => {//拦截请求
    if(!res.token) {
      console.log("未登陆,请先登录")
    }
    return res
  },err => {
    console.log("拦截请求失败",err);
  })


  instance.interceptors.response.use(res => {//拦截响应
    // console.log("拦截响应成功",res.data);
    return res.data
  }, err => {
    // console.log("拦截响应失败",err);
  })

  //发送真正网络请求 instance本身返回的就是promise
  return instance(config)

}