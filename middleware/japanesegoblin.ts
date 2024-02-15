export default defineNuxtRouteMiddleware(() => {
  return navigateTo('https://www.youtube.com/watch?v=UIp6_0kct_U', {
    external: true,
  })
})
