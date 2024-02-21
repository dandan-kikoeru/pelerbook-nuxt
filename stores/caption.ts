import { defineStore } from 'pinia'

export const useCaptionStore = defineStore('caption', () => {
  const caption = ref<string>('')
  const setCaption = (data?: string) =>
    data ? (caption.value = data) : (caption.value = '')
  return { caption, setCaption }
})
