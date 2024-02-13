export const useFetchPost = () => {
  const { $axios } = useNuxtApp()
  const isFetching = ref(false)
  const route: any = useRoute()
  const indexStore = useIndexStore()
  const profileStore = useProfileStore()
  const singleStore = useSingleStore()

  const fetchIndex = async () => {
    try {
      isFetching.value = true
      const response: any = await $axios.get(
        `/api/post?page=${indexStore.pages}`,
      )
      indexStore.push(response.data.data)
      indexStore.setLinks(response.data.links)
    } catch (error: any) {
      console.error(`${error.response.status}: ${error.response.data.message}`)
    } finally {
      isFetching.value = false
    }
  }

  const fetchProfile = async () => {
    try {
      isFetching.value = true
      const responsePosts = await $axios.get(
        `/api/profile/posts/${route.params.id}?page=${profileStore.pages}`,
      )
      const responseProfile = await $axios.get(
        `/api/profile/${route.params.id}`,
      )
      profileStore.setLinks(responsePosts.data.links)
      profileStore.push(responsePosts.data.data)
      profileStore.setProfileData(responseProfile.data.data)
    } catch (error: any) {
      console.error(error)
      navigateTo('/', { replace: true })
    } finally {
      isFetching.value = false
    }
  }

  const fetchPost = async () => {
    try {
      isFetching.value = true
      const response: any = await $axios.get(`/api/post/${route.params.postId}`)
      singleStore.setPost(response.data.data)
    } catch (error: any) {
      navigateTo('/', { replace: true })
    } finally {
      isFetching.value = false
    }
  }
  return { isFetching, fetchIndex, fetchProfile, fetchPost }
}
