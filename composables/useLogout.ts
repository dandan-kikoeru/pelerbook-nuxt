import axios from 'axios'
export const useLogout = async () => {
  const { setToken, getBearer, setUser } = useAuthStore()
  const response = await axios.post('/api/user/logout', null, {
    headers: {
      Authorization: getBearer,
    },
  })
  setToken()
  setUser()
  return navigateTo('/login')
}
