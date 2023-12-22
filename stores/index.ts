import type { Links, Post } from '~/types'

export const useIndexStore = defineStore('index', () => {
  const posts = ref<Post[]>([])
  const pages = ref<number>(1)
  const links = ref<Links>()

  const setPosts = (data?: any) => {
    posts.value.push(...data)
  }

  const unshiftPosts = (data: Post) => {
    posts.value.unshift(data)
  }
  const incrementPage = () => {
    pages.value++
  }

  const resetPosts = () => {
    setTimeout(() => {
      posts.value = []
      pages.value = 1
    }, 500)
  }

  const setLinks = (data: Links) => {
    links.value = data
  }

  const setPostByIndex = (data: Post, index: number) => {
    posts.value[index] = data
  }

  return {
    posts,
    setPosts,
    pages,
    incrementPage,
    resetPosts,
    setLinks,
    links,
    unshiftPosts,
    setPostByIndex,
  }
})
