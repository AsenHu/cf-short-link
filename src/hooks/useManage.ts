import { ref, h } from 'vue'
import { message } from 'ant-design-vue'
// import dayjs from 'dayjs'

import { getLink } from '@/apis/index'

import type { shortLinkInstance } from '@/types/index'

export const useManage = () => {
  const linkList = ref<shortLinkInstance[]>()

  const columns = [
    {
      title: 'Full Link',
      dataIndex: 'full',
      key: 'full',
      ellipsis: true,
      render: (text: string) =>
        h(
          'a',
          { href: text, target: '_blank', rel: 'noopener noreferrer' },
          text,
        ),
    },
    {
      title: 'Original Link',
      dataIndex: 'url',
      key: 'url',
      ellipsis: true,
      render: (text: string) =>
        text
          ? h(
              'a',
              { href: text, target: '_blank', rel: 'noopener noreferrer' },
              text,
            )
          : 'N/A',
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
