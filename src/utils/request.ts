import axios from 'axios'
import { useTokenStore } from '@/stores/token'
import { message } from 'ant-design-vue'

const base_url = import.meta.env.VITE_BASE_URL

const tokenStore = useTokenStore()

const axiosInstance = axios.create({
  baseURL: base_url,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    Authorization: `Bearer ${tokenStore.token}`,
  },
})

axiosInstance.interceptors.response.use(
  response => {
    return response
  },
  error => {
    console.log(error)
    if (error.response?.data.ok == false) {
      message.error(error.response.data.msg)
    }
    return Promise.resolve(error)
  },
)

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Response<T = any> = {
  ok: boolean
  msg: string
  data: T
}

export default axiosInstance
