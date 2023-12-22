import type { Links, Post } from '~/types'

export const useProfileStore = defineStore('profile', () => {
  const posts = ref<Post[]>([])
  const pages = ref<number>(1)
  const links = ref<Links>()
  const profileId = ref<any>()

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
    posts.value = []
    pages.value = 1
  }

  const setLinks = (data: Links) => {
    links.value = data
  }

  const setProfileId = (data: any) => {
    profileId.value = data
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
    profileId,
    setProfileId,
    setPostByIndex,
  }
})
