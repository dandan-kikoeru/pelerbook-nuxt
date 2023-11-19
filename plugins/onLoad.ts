import axios from 'axios'
export default defineNuxtPlugin(async (nuxtApp) => {
  const auth = useAuthStore()
  if (!auth.isLoggedIn) {
    await useFetchUser()
  }
})
