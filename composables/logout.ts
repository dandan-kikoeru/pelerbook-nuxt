import axios from 'axios'
export const useLogout = async () => {
  const auth = useAuthStore()
  await navigateTo('/login')
  await auth.setToken()
  await auth.setUser()
  await axios.post('/api/user/logout', null, {
    headers: {
      Authorization: auth.getBearer,
    },
  })
}
