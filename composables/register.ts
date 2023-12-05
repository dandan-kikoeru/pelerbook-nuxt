import axios from 'axios'

export const useRegister = async (form: object) => {
  const auth = useAuthStore()
  const isFetching = ref(false)
  const error = ref(null)

  try {
    isFetching.value = true
    const response: any = await axios.post('/api/user/register', form)
    await auth.setToken(response.data.token)
    await useFetchUser()
    await navigateTo('/')
  } catch (error: any) {
    error.value = error.response.data
  } finally {
    isFetching.value = false
  }
  return { isFetching, error }
}
