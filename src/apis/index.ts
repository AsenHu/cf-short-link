import request, { type Response } from '@/utils/request'

import type { shortLinkAdd } from '@/types'

export const addShortLink = (data: shortLinkAdd) => {
  return request.post<
    Response<{
      short: string
    }>
  >('/create', data)
}

export const getLink = () => {
  return request.get<
    Response<{
      cursor: string
      list_complete: boolean
      links: {
        short: {
          key: string
          noHttps: string
          full: string
        }
        url: string | null
        expiration: number | null
      }[]
    }>
  >('/list?all=true')
}
