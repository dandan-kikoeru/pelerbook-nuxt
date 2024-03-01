import axios from 'axios'
export default defineNuxtPlugin((nuxtApp) => {
  const instance = axios.create({
    withCredentials: true,
    withXSRFToken: true,
  })
  return {
    provide: {
      axios: instance,
    },
  }
})
