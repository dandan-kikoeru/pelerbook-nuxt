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
      indexStore.pushComment(
        response.data.data,
        postId,
        response.data.commentsCount,
      )
      profileStore.pushComment(
        response.data.data,
        postId,
        response.data.commentsCount,
      )
      if (route.params.postId) {
        singleStore.pushComment(response.data.data, response.data.commentsCount)
      }
    } finally {
      isFetching.value = false
    }
  }

  const editComment = async (
    form: Object,
    comment: Comment,
    commentIndex: number,
  ) => {
    try {
      isFetching.value = true
      const response = await $axios.post(
        `/api/comment/update/${comment.id}`,
        form,
      )
      indexStore.setCommentContent(response.data.content, comment.postId)
      profileStore.setCommentContent(response.data.content, comment.postId)
      if (route.params.postId) {
        singleStore.setCommentContent(response.data.content, commentIndex)
      }
    } finally {
      isFetching.value = false
    }
  }

  const deleteComment = async (comment: Comment) => {
    try {
      isFetching.value = true
      const response: any = await $axios.post(
        `/api/comment/destroy/${comment.id}`,
      )
      indexStore.spliceComment(comment, response.data.commentsCount)
      profileStore.spliceComment(comment, response.data.commentsCount)
      if (route.params.postId) {
        singleStore.spliceComment(comment, response.data.commentsCount)
      }
    } finally {
      isFetching.value = false
    }
  }

  const likeComment = async (
    id: string,
    postId: string,
    commentIndex: number,
  ) => {
    try {
      isFetching.value = true
      const response: any = await $axios.post(`/api/comment/like/${id}`)
      indexStore.setCommentLikes(
        response.data.likes,
        response.data.likedByUser,
        postId,
      )
      profileStore.setCommentLikes(
        response.data.likes,
        response.data.likedByUser,
        postId,
      )
      if (route.params.postId) {
        singleStore.setCommentLikes(
          response.data.likes,
          response.data.likedByUser,
          commentIndex,
        )
      }
    } finally {
      isFetching.value = false
    }
  }
  return { isFetching, createComment, editComment, deleteComment, likeComment }
}
