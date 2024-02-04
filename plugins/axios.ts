import axios from 'axios'
export default defineNuxtPlugin((nuxtApp) => {
  const token = useCookie('XSRF-TOKEN')
  const instance = axios.create({
    withCredentials: true,
    baseURL: '/backend',
    headers: {
      'X-XSRF-TOKEN': token.value as string,
    },
  })
  return {
    provide: {
      axios: instance,
    },
  }
})
