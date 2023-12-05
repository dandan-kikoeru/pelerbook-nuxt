export default defineNuxtRouteMiddleware(() => {
  const auth = useAuthStore()
  if (!auth.token) {
    return navigateTo('/login', { replace: true })
  }
})
