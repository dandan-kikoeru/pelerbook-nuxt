// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: false },
  modules: ['@nuxtjs/tailwindcss', '@vueuse/nuxt', '@pinia/nuxt'],
  ssr: false,
  nitro: {
    routeRules: {
      '/api/**': {
        proxy: 'http://localhost:8000/api/**',
      },
      '/sanctum/csrf-cookie': {
        proxy: 'http://localhost:8000/sanctum/csrf-cookie',
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
