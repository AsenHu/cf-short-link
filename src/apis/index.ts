import request, { type Response } from '@/utils/request'

import type { shortLinkAdd, shortLinkEdit } from '@/types'

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

export const updateLink = (data: shortLinkEdit) => {
    return request.put<Response>('/update', data)
}

export const deleteLink = (key: string) => {
    return request.delete<Response>(`/delete`, {
        data: {
            short: key
        }
    })
}

export const getFullLink = (key: string) => {
    return request.get<Response<{ url: string }>>(`/get?q=${key}`)
}
