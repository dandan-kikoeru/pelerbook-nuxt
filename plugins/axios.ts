import axios from 'axios'
export default defineNuxtPlugin((nuxtApp) => {
  const instance = axios.create({
    withCredentials: true,
    withXSRFToken: true,
    baseURL: '/backend',
  })
  return {
    provide: {
      axios: instance,
    },
  }
})
