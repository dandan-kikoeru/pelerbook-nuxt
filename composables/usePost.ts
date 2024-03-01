import type { Post } from '~/types'
export const usePost = () => {
  const route = useRoute()
  const indexStore = useIndexStore()
  const profileStore = useProfileStore()
  const captionStore = useGeneralStore()
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
      const { data } = await $axios.post<{ post: Post }>(
        '/api/post/store',
        form,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        },
      )
      indexStore.unshift(data.post)
      profileStore.unshift(data.post)
      captionStore.setCaption()
    } finally {
      isFetching.value = false
    }
  }

  const editPost = async (form: Object, id: string) => {
    try {
      isFetching.value = true
      const { data } = await $axios.post<{ caption: string; image: string }>(
        `/api/post/update/${id}`,
        form,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        },
      )
      indexStore.setCaption(data.caption, data.image, id)
      profileStore.setCaption(data.caption, data.image, id)
      if (route.params.postId) {
        singleStore.setCaption(data.caption, data.image)
      }
    } finally {
      isFetching.value = false
    }
  }

  const likePost = async (id: string) => {
    try {
      isFetching.value = true
      const { data } = await $axios.post<{
        likes: number
        likedByUser: boolean
      }>(`/api/post/like/${id}`)
      indexStore.setLikes(data.likes, data.likedByUser, id)
      profileStore.setLikes(data.likes, data.likedByUser, id)
      if (route.params.postId) {
        singleStore.setLikes(data.likes, data.likedByUser)
      }
    } finally {
      isFetching.value = false
    }
  }

  const sharePost = async (form: Object, id: string) => {
    try {
      isFetching.value = true
      const { data } = await $axios.post<{ post: Post; sharesCount: number }>(
        `/api/post/share/${id}`,
        form,
      )
      indexStore.unshift(data.post)
      profileStore.unshift(data.post)
      indexStore.setShares(data.sharesCount, id)
      profileStore.setShares(data.sharesCount, id)
      singleStore.setShares(data.sharesCount)
    } finally {
      isFetching.value = false
    }
  }

  return { isFetching, deletePost, createPost, editPost, likePost, sharePost }
}
