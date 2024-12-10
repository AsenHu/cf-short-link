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
        lable: 'Dashboard',
        icon: DashboardOutlined,
      },
      {
        key: 'Manage',
        lable: 'Manage',
        icon: SettingOutlined,
      },
      {
        key: 'Auth',
        lable: 'Auth',
        icon: KeyOutlined,
      },
    ])

    return { navList }
  },
  {
    persist: true,
  },
)
