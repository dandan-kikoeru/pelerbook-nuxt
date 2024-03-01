import type { Comment } from '~/types'

export const useComment = () => {
  const isFetching = ref(false)
  const { $axios } = useNuxtApp()
  const route = useRoute()
  const indexStore = useIndexStore()
  const profileStore = useProfileStore()
  const singleStore = useSingleStore()

  const createComment = async (form: Object, postId: string) => {
    try {
      isFetching.value = true
      const { data } = await $axios.post<{
        comment: Comment
        commentsCount: number
      }>(`/api/comment/store/${postId}`, form)
      indexStore.pushComment(data.comment, postId, data.commentsCount)
      profileStore.pushComment(data.comment, postId, data.commentsCount)
      if (route.params.postId) {
        singleStore.pushComment(data.comment, data.commentsCount)
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
      const { data } = await $axios.post(
        `/api/comment/update/${comment.id}`,
        form,
      )
      indexStore.setCommentContent(data.content, comment.postId)
      profileStore.setCommentContent(data.content, comment.postId)
      if (route.params.postId) {
        singleStore.setCommentContent(data.content, commentIndex)
      }
    } finally {
      isFetching.value = false
    }
  }

  const deleteComment = async (comment: Comment) => {
    try {
      isFetching.value = true
      const { data } = await $axios.post(`/api/comment/destroy/${comment.id}`)
      indexStore.spliceComment(comment, data.commentsCount)
      profileStore.spliceComment(comment, data.commentsCount)
      if (route.params.postId) {
        singleStore.spliceComment(comment, data.commentsCount)
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
      const { data } = await $axios.post<{
        likes: number
        likedByUser: boolean
      }>(`/api/comment/like/${id}`)
      indexStore.setCommentLikes(data.likes, data.likedByUser, postId)
      profileStore.setCommentLikes(data.likes, data.likedByUser, postId)
      if (route.params.postId) {
        singleStore.setCommentLikes(data.likes, data.likedByUser, commentIndex)
      }
    } finally {
      isFetching.value = false
    }
  }
  return { isFetching, createComment, editComment, deleteComment, likeComment }
}
