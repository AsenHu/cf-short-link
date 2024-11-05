import request, { type Response } from '@/utils/request'

import type { shortLinkAdd } from '@/types'

export const addShortLink = (data: shortLinkAdd) => {
  return request.post<
    Response<{
      short: string
    }>
  >('/create', data)
}
