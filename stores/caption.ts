import { defineStore } from 'pinia'

export const useCaptionStore = defineStore('Caption', () => {
  const caption = ref<string | undefined>('')
  const setCaption = (data?: string) => (caption.value = data)
  return { caption, setCaption }
})
