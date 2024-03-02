import type { User } from '~/types'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const isFetching = ref(false)
  const initCSRF = async () => {
    await useAxios().get('/sanctum/csrf-cookie')
  }

  const fetchUser = async () => {
    const { data } = await useAxios().get<{ user: User }>('/api/user')
    setUser(data.user)
  }

  const login = async (form: object) => {
    try {
      isFetching.value = true
      await initCSRF()
      await useAxios().post('/api/user/login', form)
      await fetchUser()
      navigateTo('/')
    } finally {
      isFetching.value = false
    }
  }

  const logout = async () => {
    try {
      isFetching.value = true
      await useAxios().post('/api/user/logout')
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
      await useAxios().post('/api/user/register', form)
      await fetchUser()
      navigateTo('/')
    } finally {
      isFetching.value = false
    }
  }

  const isLoggedIn = computed(() => !!user.value)
  const setUser = (data: User | null = null) => {
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
