export default defineNuxtPlugin(async (nuxtApp) => {
  const auth = useAuthStore()
  const { fetchUser } = useAuth()
  if (!auth.isLoggedIn && auth.token) {
    try {
      await fetchUser()
    } catch (error) {
      console.error(error)
    }
  }
})
