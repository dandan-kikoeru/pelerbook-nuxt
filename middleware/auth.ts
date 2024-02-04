export default defineNuxtRouteMiddleware(() => {
  const { isLoggedIn } = useAuthStore()
  if (!isLoggedIn) {
    navigateTo('/login', { replace: true })
  }
})
