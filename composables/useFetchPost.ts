import { Axios, AxiosError } from 'axios'
import type { Links, Post, User } from '~/types'

export const useFetchPost = () => {
  const { $axios } = useNuxtApp()
  const isFetching = ref(false)
  const route = useRoute()
  const indexStore = useIndexStore()
  const profileStore = useProfileStore()
  const singleStore = useSingleStore()

  const fetchIndex = async () => {
    try {
      isFetching.value = true
      const { data } = await $axios.get<{ data: Post[]; links: Links }>(
        `/api/post?page=${indexStore.pages}`,
      )
      indexStore.push(data.data)
      indexStore.setLinks(data.links)
    } finally {
      isFetching.value = false
    }
  }

  const fetchProfile = async () => {
    try {
      isFetching.value = true
      const { data } = await $axios.get<{ data: Post[]; links: Links }>(
        `/api/profile/posts/${route.params.id}?page=${profileStore.pages}`,
      )
      const { data: profileData } = await $axios.get<{ user: User }>(
        `/api/profile/${route.params.id}`,
      )
      profileStore.push(data.data)
      profileStore.setLinks(data.links)
      profileStore.setProfileData(profileData.user)
    } catch (e: unknown) {
      const error = e as AxiosError
      console.error(`${error.response?.status}: ${error.response?.statusText}`)
      navigateTo('/', { replace: true }) 
    } finally {
      isFetching.value = false
    }
  }

  const fetchPost = async () => {
    try {
      isFetching.value = true
      const { data } = await $axios.get<{ post: Post }>(
        `/api/post/${route.params.postId}?withoutComments=true`,
      )
      singleStore.setPost(data.post)
    } catch (e: unknown) {
      const error = e as AxiosError
      console.error(`${error.response?.status}: ${error.response?.statusText}`)
      navigateTo('/', { replace: true })
    } finally {
      isFetching.value = false
    }
  }
  return { isFetching, fetchIndex, fetchProfile, fetchPost }
}
