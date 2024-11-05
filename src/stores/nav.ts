import { ref } from 'vue'
import { defineStore } from 'pinia'
import {
  DashboardOutlined,
  KeyOutlined,
  SettingOutlined,
} from '@ant-design/icons-vue'

type NavItem = {
  key: string
  lable: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  icon: any
}

export const useNavStore = defineStore(
  'nav',
  () => {
    const navList = ref<NavItem[]>([
      {
        key: 'Home',
        lable: '首页',
        icon: DashboardOutlined,
      },
      {
        key: 'Manage',
        lable: '管理',
        icon: SettingOutlined,
      },
      {
        key: 'Auth',
        lable: '认证',
        icon: KeyOutlined,
      },
    ])

    return { navList }
  },
  {
    persist: true,
  },
)
