import { defineStore } from 'pinia'

export const useGeneralStore = defineStore('general', () => {
  const caption = ref<string>('')
  const errors = ref<string[]>([])
  const setCaption = (data: string = '') => {
    caption.value = data
  }
  return { caption, setCaption, errors }
})
