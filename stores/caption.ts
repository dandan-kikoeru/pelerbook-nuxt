import { defineStore } from 'pinia'

export const useCaptionStore = defineStore('caption', () => {
  const caption = ref<string | undefined>('')
  const setCaption = (data?: string) => (caption.value = data)
  return { caption, setCaption }
})
