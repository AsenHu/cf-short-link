import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useTokenStore = defineStore(
  'token',
  () => {
    const token = ref('')
    const updateToken = (newToken: string) => {
      token.value = newToken
    }

    return { token, updateToken }
  },
  {
    persist: true,
  },
)
