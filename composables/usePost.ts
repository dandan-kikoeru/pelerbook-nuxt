import type { Post } from '~/types'
export const usePost = () => {
  const route: any = useRoute()
  const indexStore = useIndexStore()
  const profileStore = useProfileStore()
  const captionStore = useCaptionStore()
  const singleStore = useSingleStore()
  const isFetching = ref(false)
  const { $axios } = useNuxtApp()

  const deletePost = async (id: string) => {
    try {
      isFetching.value = true
      await $axios.post(`/api/post/destroy/${id}`)
      indexStore.splice(id)
      profileStore.splice(id)
      if (route.params.postId) {
        window.scrollTo({
          top: 0,
          behavior: 'smooth',
        })
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
      indexStore.unshift(response.data)
      profileStore.unshift(response.data)
      captionStore.setCaption()
    } finally {
      isFetching.value = false
    }
  }

  const editPost = async (form: Object, id: string) => {
    try {
      isFetching.value = true
      const response: any = await $axios.post(`/api/post/update/${id}`, form, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      indexStore.setCaption(response.data.caption, response.data.image, id)
      profileStore.setCaption(response.data.caption, response.data.image, id)
      if (route.params.postId) {
        singleStore.setCaption(response.data.caption, response.data.image)
      }
    } finally {
      isFetching.value = false
    }
  }

  const likePost = async (id: string) => {
    try {
      isFetching.value = true
      const response: any = await $axios.post(`/api/post/like/${id}`)
      indexStore.setLikes(response.data.likes, response.data.likedByUser, id)
      profileStore.setLikes(response.data.likes, response.data.likedByUser, id)
      if (route.params.postId) {
        singleStore.setLikes(response.data.likes, response.data.likedByUser)
      }
    } finally {
      isFetching.value = false
    }
  }

  return { isFetching, deletePost, createPost, editPost, likePost }
}
