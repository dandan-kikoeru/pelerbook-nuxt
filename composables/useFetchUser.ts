import axios from 'axios'
export const useFetchUser = async () => {
  const { setUser, getBearer, setToken } = useAuthStore()
  try {
    const response = await axios.get('/api/user', {
      headers: {
        Authorization: getBearer,
      },
    })
    setUser(response.data)
  } catch (error: any) {
    setToken()
  }
}
