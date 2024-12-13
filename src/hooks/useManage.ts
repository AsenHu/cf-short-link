import { ref } from 'vue'
import { message } from 'ant-design-vue'
import dayjs from 'dayjs'

import { getLink } from '@/apis/index'

import type { shortLinkInstance } from '@/types/index'

export const useManage = () => {
  const linkList = ref<shortLinkInstance[]>()

  const columns = [
    {
      title: 'key',
      dataIndex: 'key',
      key: 'key',
    },
    {
      title: 'full link',
      dataIndex: 'full',
      key: 'full',
    },
    {
      title: 'original link',
      dataIndex: 'url',
      key: 'url',
    },
  ]

  const getLinkList = async () => {
    const { data: result } = await getLink()

    if (result.data.list_complete !== true) {
      message.error('获取链接失败')
      return
    }
    linkList.value = result.data.links.map(e => {
      return {
        ...e.short,
        url: e.url,
        expiration: e.expiration,
      }
    })
  }

  return {
    linkList,
    columns,

    getLinkList,
  }
}
