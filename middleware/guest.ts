export default defineNuxtRouteMiddleware(() => {
  const { isLoggedIn } = useAuthStore()
  if (isLoggedIn) {
    navigateTo('/', { replace: true })
  }
})
