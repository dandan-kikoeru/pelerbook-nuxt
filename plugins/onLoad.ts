export default defineNuxtPlugin(async (nuxtApp) => {
  const auth = useAuthStore()
  const { fetchUser } = useUser()
  if (!auth.isLoggedIn && auth.token) {
    try {
      await fetchUser()
    } catch (error) {
      console.error(error)
    }
  }
})
