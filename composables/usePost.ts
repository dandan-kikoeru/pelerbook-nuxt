import axios from 'axios'
import type { Post } from '~/types'
export const usePost = () => {
  const auth = useAuthStore()
  const route: any = useRoute()
  const indexStore = useIndexStore()
  const profileStore = useProfileStore()
  const captionStore = useCaptionStore()
  const fetchPost = useFetchPost()
  const isFetching = ref(false)

  const deletePost = async (id: string, index?: number) => {
    try {
      isFetching.value = true
      const response: any = await axios.post(`/api/post/destroy/${id}`, null, {
        headers: {
          Authorization: auth.getBearer,
        },
      })
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
    } catch (error: any) {
      console.error(error)
    } finally {
      isFetching.value = false
    }
  }

  const createPost = async (form: Object) => {
    try {
      isFetching.value = true
      const response: any = await axios.post('/api/post/store', form, {
        headers: {
          Authorization: auth.getBearer,
          'Content-Type': 'multipart/form-data',
        },
      })
      await indexStore.unshiftPosts(response.data)
      await profileStore.unshiftPosts(response.data)
      await captionStore.setCaption()
    } catch (error: any) {
      console.error(error)
    } finally {
      isFetching.value = false
    }
  }

  const editPost = async (form: Object, postIndex: number, data: Post) => {
    try {
      isFetching.value = true
      const response: any = await axios.post(
        `/api/post/update/${data.id}`,
        form,
        {
          headers: {
            Authorization: auth.getBearer,
            'Content-Type': 'multipart/form-data',
          },
        },
      )
      await indexStore.setPostByIndex(response.data, postIndex)
      await profileStore.setPostByIndex(response.data, postIndex)
      if (route.params.postId) {
        fetchPost.fetchPost()
      }
    } catch (error: any) {
      console.error(error)
    } finally {
      isFetching.value = false
    }
  }

  return { isFetching, deletePost, createPost, editPost }
}
