import type { User } from '~/types'

export const useAuthStore = defineStore('auth', () => {
  const { $axios } = useNuxtApp()
  const user = ref<User | null>(null)
  const isFetching = ref(false)

  const initCSRF = async () => {
    await $axios.get('/sanctum/csrf-cookie')
  }

  const fetchUser = async () => {
    const response = await $axios.get('/api/user')
    setUser(response.data)
  }

  const login = async (form: object) => {
    try {
      isFetching.value = true
      await initCSRF
      await $axios.post('/api/user/login', form)
      await fetchUser()
      navigateTo('/')
    } finally {
      isFetching.value = false
    }
  }

  const logout = async () => {
    try {
      isFetching.value = true
      await $axios.post('/api/user/logout', null)
      setUser()
      navigateTo('/login')
    } finally {
      isFetching.value = false
    }
  }

  const register = async (form: object) => {
    try {
      isFetching.value = true
      await initCSRF()
      await $axios.post('/api/user/register', form)
      await fetchUser()
      navigateTo('/')
    } finally {
      isFetching.value = false
    }
  }

  const isLoggedIn = computed(() => !!user.value)
  const setUser = (data?: any) => {
    user.value = data
  }

  return {
    user,
    setUser,
    isLoggedIn,
    isFetching,
    login,
    logout,
    register,
    fetchUser,
  }
})
