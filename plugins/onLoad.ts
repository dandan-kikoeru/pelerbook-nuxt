export default defineNuxtPlugin(async (nuxtApp) => {
  const { fetchUser, isLoggedIn } = useAuthStore()
  if (!isLoggedIn) {
    try {
      await fetchUser()
    } catch (error: any) {
      console.error(error.response.data.message)
    }
  }
})
