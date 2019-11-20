import axios from 'axios';
import { message } from 'antd';

export default function ajax(url, data = {}, method = 'get') {
  return new Promise((resolve, reject) => {
    let promise
    // 1. 执行异步ajax请求
    if (method === 'get') {
      promise = axios.get(url, {
        params: data
      })
    } else if (method === 'post') {
      promise = axios.post(url, data)
    } else if (method === 'put') {
      promise = axios.put(url, data)
    }

    // 2. 如果成功了, 调用 resolve(value)
    promise.then(response => {
      resolve(response.data)
      // 3. 如果失败了 不调用 reject(reason) 而是提示异常信息
    }).catch(error => {
      message.error(`请求出错了：${error.message}`)
    })
  })

}