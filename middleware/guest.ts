export default defineNuxtRouteMiddleware(async () => {
  const auth = useAuthStore()
  if (auth.token) {
    await navigateTo('/', { replace: true })
  }
})
