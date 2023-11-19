import type { User } from '~/types'
import axios from 'axios'

export const useAuthStore = defineStore('auth', () => {
  const token = useCookie('TOKEN')
  const user = ref<User | null>(null)
  const isLoggedIn = computed(() => !!user.value)
  const setToken = (data?: any) => {
    token.value = data
  }

  const setUser = (data?: any) => {
    user.value = data
  }

  const getBearer = computed(() => `Bearer ${token.value}`)
  return { token, setToken, user, setUser, isLoggedIn, getBearer }
})
