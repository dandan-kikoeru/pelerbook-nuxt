export default defineNuxtPlugin(async (nuxtApp) => {
  const auth = useAuthStore()
  if (!auth.isLoggedIn && auth.token) {
    try {
      await useFetchUser()
    } catch (error) {
      console.error(error)
    }
  }
})
