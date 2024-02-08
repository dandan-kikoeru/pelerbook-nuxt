import type { Post } from '~/types'
export const usePost = () => {
  const route: any = useRoute()
  const indexStore = useIndexStore()
  const profileStore = useProfileStore()
  const captionStore = useCaptionStore()
  const isFetching = ref(false)
  const { fetchPost } = useFetchPost()
  const { $axios } = useNuxtApp()

  const deletePost = async (id: string, index?: number) => {
    try {
      isFetching.value = true
      await $axios.post(`/api/post/destroy/${id}`)
      if (index !== undefined) {
        indexStore.splicePost(index)
        profileStore.splicePost(index)
      }
      if (route.params.postId) {
        window.scrollTo({
          top: 0,
          behavior: 'smooth',
        })
        indexStore.resetPosts()
        navigateTo('/')
      }
    } finally {
      isFetching.value = false
    }
  }

  const createPost = async (form: Object) => {
    try {
      isFetching.value = true
      const response: any = await $axios.post('/api/post/store', form, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      indexStore.unshiftPosts(response.data)
      profileStore.unshiftPosts(response.data)
      captionStore.setCaption()
    } finally {
      isFetching.value = false
    }
  }

  const editPost = async (form: Object, index: number, data: Post) => {
    try {
      isFetching.value = true
      const response: any = await $axios.post(
        `/api/post/update/${data.id}`,
        form,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        },
      )
      indexStore.setPostByIndex(response.data, index)
      profileStore.setPostByIndex(response.data, index)
      if (route.params.postId) {
        await fetchPost()
      }
    } finally {
      isFetching.value = false
    }
  }

  const likePost = async (id: string, index?: number) => {
    try {
      isFetching.value = true
      const response: any = await $axios.post(`/api/like/${id}`)
      if (index !== undefined) {
        indexStore.setPostByIndex(response.data, index)
        profileStore.setPostByIndex(response.data, index)
      }
      if (route.params.postId) {
        await fetchPost()
      }
    } finally {
      isFetching.value = false
    }
  }

  return { isFetching, deletePost, createPost, editPost, likePost }
}
