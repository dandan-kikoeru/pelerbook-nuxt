import { defineStore } from 'pinia'
import type { Post } from '~/types'

export const useSingleStore = defineStore('single', () => {
  const post = ref<Post>()
  const setPost = (data?: any) => {
    post.value = data
  }
  return { post, setPost }
})
