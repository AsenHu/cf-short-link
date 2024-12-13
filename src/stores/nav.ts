import { ref } from 'vue'
import { defineStore } from 'pinia'
import {
  DashboardOutlined,
  KeyOutlined,
  SettingOutlined,
} from '@ant-design/icons-vue'

type NavItem = {
  key: string
  label: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  icon: any
}

export const useNavStore = defineStore(
  'nav',
  () => {
    const navList = ref<NavItem[]>([
      {
        key: 'Home',
        label: 'Dashboard',
        icon: DashboardOutlined,
      },
      {
        key: 'Manage',
        label: 'Manage',
        icon: SettingOutlined,
      },
      {
        key: 'Auth',
        label: 'Auth',
        icon: KeyOutlined,
      },
    ])

    return { navList }
  },
  {
    persist: true,
  },
)
