import type { User } from '~/types'

export const useAuthStore = defineStore('auth', () => {
  const token = useCookie('TOKEN', {
    maxAge: 604800,
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
  })
  const user = ref<User | null>(null)
  const isLoggedIn = computed(() => !!user.value)
  const setToken = (data?: string) => {
    token.value = data
  }
  const setUser = (data?: any) => {
    user.value = data
  }

  const getBearer = computed(() => `Bearer ${token.value}`)
  return { token, setToken, user, setUser, isLoggedIn, getBearer }
})
