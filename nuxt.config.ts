// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  app: {
    head: {
      link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
    },
  },
  devtools: { enabled: false },
  modules: ['@nuxtjs/tailwindcss', '@vueuse/nuxt', '@pinia/nuxt'],
  ssr: false,
  nitro: {
    routeRules: {
      '/backend/**': {
        proxy: 'http://localhost:8000/**',
      },
      '/avatars/**': {
        proxy: 'http://localhost:8000/avatars/**',
      },
      '/covers/**': {
        proxy: 'http://localhost:8000/covers/**',
      },
      '/images/**': {
        proxy: 'http://localhost:8000/images/**',
      },
    },
  },
  pinia: {
    storesDirs: ['./stores/**'],
  },
  imports: {
    dirs: ['stores'],
  },
})
