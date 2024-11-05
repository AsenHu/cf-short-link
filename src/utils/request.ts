import axios from 'axios'
import { useTokenStore } from '@/stores/token'

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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Response<T = any> = {
  ok: boolean
  msg: string
  data: T
}

export default axiosInstance
