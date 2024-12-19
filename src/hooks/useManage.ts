import { ref, h, computed } from 'vue'
import { message } from 'ant-design-vue'
// import dayjs from 'dayjs'

import { getLink } from '@/apis/index'

import type { shortLinkInstance } from '@/types/index'

export const useManage = () => {
  const currentPage = ref(1)
  const pageSize = ref(10)
  const total = ref(0)

  const originalDataList = ref<shortLinkInstance[]>([])

  const linkList = computed(() => {
    const start = (currentPage.value - 1) * pageSize.value
    const end = currentPage.value * pageSize.value
    return originalDataList.value.slice(start, end)
  })

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
      message.error('Unable to get list')
      return
    }
    originalDataList.value = result.data.links.map(e => {
      return {
        ...e.short,
        url: e.url,
        expiration: e.expiration,
      }
    })
    total.value = originalDataList.value.length
  }

  return {
    linkList,
    columns,
    getLinkList,
    currentPage,
    pageSize,
    total,
  }
}
