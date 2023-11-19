import axios from 'axios'

export const useLogin = async (form: object) => {
  const { setToken, setUser } = useAuthStore()

  const response: any = await axios.post('/api/user/login', form)
  setToken(response.data.token)
  setUser(response.data.user)
  return navigateTo('/')
}
