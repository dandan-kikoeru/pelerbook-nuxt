import type { Comment } from '~/types'

export const useComment = () => {
  const isFetching = ref(false)
  const { $axios } = useNuxtApp()
  const route: any = useRoute()
  const indexStore = useIndexStore()
  const profileStore = useProfileStore()
  const singleStore = useSingleStore()

  const createComment = async (form: Object, postId: string) => {
    try {
      isFetching.value = true
      const response: any = await $axios.post(
        `/api/comment/store/${postId}`,
        form,
      )
      indexStore.pushComment(response.data, postId)
      profileStore.pushComment(response.data, postId)
      if (route.params.postId) {
        singleStore.pushComment(response.data)
      }
    } finally {
      isFetching.value = false
    }
  }

  const editComment = async (form: Object, comment: Comment, commentIndex: number) => {
    try {
      isFetching.value = true
      const response = await $axios.post(`/api/comment/update/${comment.id}`, form)
      indexStore.setComment(response.data, comment.postId)
      profileStore.setComment(response.data, comment.postId)
      if (route.params.postId) {
        singleStore.setComment(response.data, commentIndex)
      }
    } finally {
      isFetching.value = false
    }
  }

  const deleteComment = async (comment: Comment) => {
    try {
      isFetching.value = true
      await $axios.post(`/api/comment/destroy/${comment.id}`)
      indexStore.spliceComment(comment)
      profileStore.spliceComment(comment)
      if (route.params.postId) {
        singleStore.spliceComment(comment)
      }
    } finally {
      isFetching.value = false
    }
  }

  const likeComment = async (id: string, postId: string, commentIndex: number) => {
    try {
      isFetching.value = true
      const response: any = await $axios.post(`/api/comment/like/${id}`)
      indexStore.setComment(response.data, postId)
      profileStore.setComment(response.data, postId)
      if (route.params.postId) {
        singleStore.setComment(response.data, commentIndex)
      }
    } finally {
      isFetching.value = false
    }
  }
  return { isFetching, createComment, editComment, deleteComment, likeComment }
}
