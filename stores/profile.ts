import type { Links, Post, User } from '~/types'

export const useProfileStore = defineStore('profile', () => {
  const indexStore = useIndexStore()
  const defaultLinksValue: Links = {
    first: '',
    last: '',
    prev: '',
    next: '',
  }
  const posts = ref<Post[]>([])
  const pages = ref<number>(1)
  const links = ref<Links>(defaultLinksValue)
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
    setLinks(defaultLinksValue)
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

  const splicePost = (index: number) => {
    posts.value.splice(index, 1)
  }

  const defaultProfileData: User = reactive({
    avatar: '/avatars/guest.webp',
    firstname: 'John',
    surname: 'Doe',
    id: 0,
    cover: '',
    createdAt: new Date('1970-01-01T00:00:00.000Z'),
  })

  const profileData = ref<User>(defaultProfileData)

  const setProfileData = (data: User) => {
    profileData.value = data
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
    splicePost,
    profileData,
    setProfileData,
  }
})
