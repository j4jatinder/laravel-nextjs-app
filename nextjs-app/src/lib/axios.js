import Axios from 'axios'
import { startLoading, stopLoading } from '@/lib/loadingBus'

const axios = Axios.create({
    baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
    headers: {
        'X-Requested-With': 'XMLHttpRequest',
    },
    withCredentials: true,
    withXSRFToken: true
})

axios.interceptors.request.use(
    config => {
        if (!config?.meta?.skipGlobalLoader) {
            startLoading()
        }

        return config
    },
    error => {
        stopLoading()

        return Promise.reject(error)
    },
)

axios.interceptors.response.use(
    response => {
        if (!response?.config?.meta?.skipGlobalLoader) {
            stopLoading()
        }

        return response
    },
    error => {
        if (!error?.config?.meta?.skipGlobalLoader) {
            stopLoading()
        }

        return Promise.reject(error)
    },
)

export default axios
