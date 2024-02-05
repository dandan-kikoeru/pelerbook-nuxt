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
        await indexStore.splicePost(index)
        await profileStore.splicePost(index)
      }
      if (route.params.postId) {
        await window.scrollTo({
          top: 0,
          behavior: 'smooth',
        })
        await indexStore.resetPosts()
        await navigateTo('/')
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
      await indexStore.unshiftPosts(response.data)
      await profileStore.unshiftPosts(response.data)
      await captionStore.setCaption()
    } finally {
      isFetching.value = false
    }
  }

  const editPost = async (form: Object, postIndex: number, data: Post) => {
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
      await indexStore.setPostByIndex(response.data, postIndex)
      await profileStore.setPostByIndex(response.data, postIndex)
      if (route.params.postId) {
        fetchPost()
      }
    } finally {
      isFetching.value = false
    }
  }

  return { isFetching, deletePost, createPost, editPost }
}
