import { defineStore } from 'pinia'
import type { Post } from '~/types'

export const useSingleStore = defineStore('Single', () => {
  const post = ref<Post>()
  const setPost = (data?: any) => {
    post.value = data
  }
  return { post, setPost }
})
