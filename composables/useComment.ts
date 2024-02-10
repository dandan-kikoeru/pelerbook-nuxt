export const useComment = () => {
  const isFetching = ref(false)
  const { $axios } = useNuxtApp()
  const route: any = useRoute()
  const indexStore = useIndexStore()
  const profileStore = useProfileStore()
  const { fetchPost } = useFetchPost()

  const createComment = async (form: Object, id: string, index?: number) => {
    try {
      isFetching.value = true
      const response: any = await $axios.post(`/api/comment/store/${id}`, form)
      if (index !== undefined) {
        indexStore.posts[index].comments.push(response.data)
        indexStore.posts[index].commentsCount++
        profileStore.posts[index].comments.push(response.data)
        profileStore.posts[index].commentsCount++
      }
      if (route.params.postId) {
        profileStore.resetPosts()
        await fetchPost()
      }
    } finally {
      isFetching.value = false
    }
  }

  const editComment = async (form: Object, id: string) => {
    try {
      isFetching.value = true
      await $axios.post(`/api/comment/update/${id}`, form)
    } finally {
      isFetching.value = false
    }
  }

  const deleteComment = async (form: Object, id: string) => {
    try {
      isFetching.value = true
      await $axios.post(`/api/comment/destroy/${id}`, form)
    } finally {
      isFetching.value = false
    }
  }
  return { isFetching, createComment, editComment, deleteComment }
}
