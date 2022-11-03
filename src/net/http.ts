import axios, { AxiosProgressEvent, AxiosRequestConfig, AxiosResponse } from 'axios'
import useAuthStore from '@/store/auth'
import useCommonStore from '@/store/common'
import router from '@/router'
import Base64 from '@/utils/ab'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

// 基础设置
axios.defaults.baseURL = `${import.meta.env.VITE_BASE_URL_HTTP}/browser/api`
axios.defaults.timeout = 1000000
axios.defaults.headers.post['Content-Type'] = 'application/json;charset=UTF-8'

const startLoading = async () => {
    const commonStore = useCommonStore()
    commonStore.addLoading()
    NProgress.start()
}

const stopLoading = async () => {
    const commonStore = useCommonStore()
    if (commonStore.reduceLoading() <= 0) {
        NProgress.done()
    }
}

interface ResType<T> {
    code: number
    msg: string
    data: T
}
interface DAMNU_ENABLE {
    [key: string]: string
}
interface Http {
    get<T>(url: string, params?: unknown): Promise<ResType<T>>
    post<T>(url: string, params?: unknown, headers?: DAMNU_ENABLE | null): Promise<ResType<T>>
    put<T>(url: string, params?: unknown): Promise<ResType<T>>
    delete<T>(url: string, params?: unknown): Promise<ResType<T>>
    upload<T>(url: string, params: unknown, fn: Function): Promise<T>
    download(url: string): void
}
interface PendingType {
    url?: string
    method?: string | undefined
    params: any
    data: any
    cancel: Function
}

const instance = axios.create({
    timeout: 1000000,
    responseType: 'json',
})

// 取消重复请求
const pending: Array<PendingType> = []
const CancelToken = axios.CancelToken
const removePending = (config: AxiosRequestConfig) => {
    for (const key in pending) {
        const item: number = +key
        const list: PendingType = pending[key]
        // 当前请求在数组中存在时执行函数体
        if (
            list.url === config.url &&
            list.method === config.method &&
            JSON.stringify(list.params) === JSON.stringify(config.params) &&
            JSON.stringify(list.data) === JSON.stringify(config.data)
        ) {
            // 执行取消操作
            list.cancel('操作太频繁, 请稍后再试')
            // 从数组中移除记录
            pending.splice(item, 1)
        }
    }
}
const clearPending = () => {
    for (const key in pending) {
        const item: number = +key
        const list: PendingType = pending[key]
        list.cancel('')
        pending.splice(item, 1)
    }
}

// 请求拦截
instance.interceptors.request.use(
    (request): AxiosRequestConfig<any> => {
        const store = useAuthStore()
        const token = store.token || localStorage.getItem('token') || ''
        if (request.headers) {
            request.headers.Authorization = token
        }
        removePending(request)
        request.cancelToken = new CancelToken(c => {
            pending.push({
                url: request.url,
                method: request.method,
                params: request.params,
                data: request.data,
                cancel: c,
            })
        })
        return request
    },
    error => {
        return Promise.reject(error)
    }
)

// 响应拦截
instance.interceptors.response.use(
    (response: AxiosResponse<ResType<any>>) => {
        removePending(response.config)
        if (response.data.code < 10000) {
            clearPending()
            let redirect = Base64.encode(router.currentRoute.value.fullPath)
            router.push({ name: "Login", query: { redirect: redirect } })
            return Promise.reject(response.data.msg)
        }
        return response
    },
    error => {
        const response = error.response
        // 超时重新请求
        const config = error.config
        // 全局的请求次数,请求的间隙
        const [RETRY_COUNT, RETRY_DELAY] = [0, 1000]

        if (config && RETRY_COUNT) {
            // 设置用于跟踪重试计数的变量
            config.__retryCount = config.__retryCount || 0
            // 检查是否已经把重试的总数用完
            if (config.__retryCount >= RETRY_COUNT) {
                return Promise.reject(response || { message: error.message })
            }
            // 增加重试计数
            config.__retryCount++
            // 创造新的Promise来处理指数后退
            const backoff = new Promise(resolve => {
                setTimeout(() => {
                    resolve(0)
                }, RETRY_DELAY || 1)
            })
            // instance重试请求的Promise
            return backoff.then(() => {
                return instance(config)
            })
        }

        return Promise.reject(response || { message: error.message })
    }
)

const http: Http = {
    get(url, params) {
        return new Promise((resolve, reject) => {
            startLoading()
            instance
                .get(url, { params })
                .then(res => {
                    stopLoading()
                    if (res.data.code != 10000) {
                        window.$message?.error(res.data.msg)
                        clearPending()
                    }
                    resolve(res.data)
                })
                .catch(err => {
                    stopLoading()
                    reject(err.data)
                })
        })
    },
    post(url, params, headers = null) {
        return new Promise((resolve, reject) => {
            startLoading()
            // 设置请求头
            if (headers) {
                for (const key in headers) {
                    instance.defaults.headers.post[key] = headers[key]
                }
            }
            instance
                .post(url, params)
                .then(res => {
                    stopLoading()
                    if (res.data.code != 10000) {
                        window.$message.error(res.data.msg)
                        clearPending()
                    }
                    resolve(res.data)
                })
                .catch(err => {
                    stopLoading()
                    window.$message.error(err)
                    reject(err.data)
                })
        })
    },
    put(url, params) {
        return new Promise((resolve, reject) => {
            startLoading()
            instance
                .put(url, params)
                .then(res => {
                    stopLoading()
                    if (res.data.code != 10000) {
                        window.$message.error(res.data.msg)
                    }
                    resolve(res.data)
                })
                .catch(err => {
                    stopLoading()
                    window.$message.error(err.message)
                    reject(err.data)
                })
        })
    },
    delete(url, params) {
        return new Promise((resolve, reject) => {
            startLoading()
            instance
                .delete(url, { params })
                .then(res => {
                    stopLoading()
                    if (res.data.code != 10000) {
                        window.$message.error(res.data.msg)
                    }
                    resolve(res.data)
                })
                .catch(err => {
                    stopLoading()
                    window.$message.error(err.message)
                    reject(err.data)
                })
        })
    },
    upload(url, file, fn) {
        return new Promise((resolve, reject) => {
            startLoading()
            const store = useAuthStore()
            const token = store.token || localStorage.getItem('token') || ''
            axios
                .post(url, file, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        Authorization: token
                    },
                    onUploadProgress: (progressEvent: AxiosProgressEvent) => {
                        fn(progressEvent)
                    },
                    timeout: 50000,
                })
                .then(res => {
                    stopLoading()
                    resolve(res.data)
                })
                .catch(err => {
                    stopLoading()
                    reject(err.data)
                })
        })
    },
    download(url) {
        const iframe = document.createElement('iframe')
        iframe.style.display = 'none'
        iframe.src = url
        iframe.onload = function () {
            document.body.removeChild(iframe)
        }
        document.body.appendChild(iframe)
    },
}
export default http
