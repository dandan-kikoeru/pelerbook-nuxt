import axios from 'axios'

export const useUser = () => {
  const auth = useAuthStore()
  const isFetching = ref(false)

  const fetchUser = async () => {
    try {
      isFetching.value = true
      const response = await axios.get('/api/user', {
        headers: {
          Authorization: auth.getBearer,
        },
      })
      auth.setUser(response.data)
    } catch (error: any) {
      auth.setToken()
    } finally {
      isFetching.value = false
    }
  }

  const register = async (form: object) => {
    try {
      isFetching.value = true
      const response: any = await axios.post('/api/user/register', form)
      await auth.setToken(response.data.token)
      await fetchUser()
      await navigateTo('/')
    } catch (error: any) {
      console.error(error.response.data)
    } finally {
      isFetching.value = false
    }
  }

  const login = async (form: object) => {
    try {
      isFetching.value = true
      const response: any = await axios.post('/api/user/login', form)
      await auth.setToken(response.data.token)
      await fetchUser()
      await navigateTo('/')
    } catch (error: any) {
      console.error(error.response.data)
    } finally {
      isFetching.value = false
    }
  }

  const logout = async () => {
    try {
      await navigateTo('/login')
      await auth.setToken()
      await auth.setUser()
      await axios.post('/api/user/logout', null, {
        headers: {
          Authorization: auth.getBearer,
        },
      })
    } catch (error: any) {
      // console.error(error.response.data)
    } finally {
      isFetching.value = false
    }
  }

  return { isFetching, fetchUser, register, login, logout }
}
