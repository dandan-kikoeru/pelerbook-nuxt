import { defineStore } from 'pinia'
import type { Posts } from '~/types'

export const usePostsStore = defineStore('Posts', () => {
  const posts = ref<Posts>({ data: [], links: null, meta: null })

  const setPosts = (data?: any) => {
    posts.value.data = data
  }
  return { posts, setPosts }
})
