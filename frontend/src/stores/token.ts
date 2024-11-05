import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useTokenStore = defineStore(
  'counter',
  () => {
    const token = ref('')

    return { token }
  },
  {
    persist: true,
  },
)
