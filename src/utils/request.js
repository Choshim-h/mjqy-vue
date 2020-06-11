
import axios from 'axios'
import Qs from 'qs'
import { Notify } from 'vant'

const formal_url="http://cms.mianjuvip.com:8080/"
const test_url="http://cms.mianjuqiyuan.com/"

// 本地开发用右边的，打包后用左边的
const baseURL = formal_url
const timeout = 30000 // 5秒后认定超时

// 创建axios实例
const service = axios.create({
    baseURL,
    timeout,
    headers: {'X-Requested-With': 'XMLHttpRequest'},
    transformRequest: [function(data){
        return Qs.stringify(data)
    }],
    transformResponse: [function(data){
        return data
    }],//在传递给 then/catch 前，允许修改响应数据
    responseType: 'json',
    validateStatus: function(status){
        if(status=="306"){
            var path= window.location.protocol+'//' + window.location.host;
            window.location.href=path+"/site/login";
            return false;
        }
        return status < 400 //状态码小于400时均为成功（返回true）
    },
})

// request拦截器
service.interceptors.request.use(
    config => {
        return config
    },
    error => {
        return Promise.reject(error)
    }
)

// response拦截器
service.interceptors.response.use(
    response => {
        return Promise.resolve(response)
    },
    error => {
        return Promise.reject(error)
    }
)

/**
 * 请求有无$的区别
 *
 * 会对请求后的函数进行处理
 * 1. 请求成功只返回data数据
 * 2. 自动处理错误情况
 */
const handle$ = (promise) => new Promise((resolve, reject) => {
    promise
        .then(res => {
            const { data } = res
            if (+data.code === 200) {
                Notify({ type: 'success', message: data.message })
                resolve(data.data)
            } else {
                // 此处出错，是接口的问题
                Notify({ type: 'danger', message: data.message })
            }
        }, err => {
            // 此处出错，是网络的问题
            Notify({ type: 'danger', message: err })
        })
})

const get = (url, params) => service.get(url, { params })
const post = (url, data) => service.post(url, data)

export default {
    // baseURL,
    get,
    $get: (url, data) => handle$(get(url, data)),
    post,
    $post: (url, data) => handle$(post(url, data))
}