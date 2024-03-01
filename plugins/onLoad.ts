import type { AxiosError } from '~/types'

export default defineNuxtPlugin(async (nuxtApp) => {
  const { fetchUser, isLoggedIn } = useAuthStore()
  if (!isLoggedIn) {
    try {
      await fetchUser()
    } catch (e: unknown) {
      const error = e as AxiosError
      console.error(`${error.response.status}: ${error.response.data.message}`)
    }
  }
})
