import type { Reply, Comment } from '~/types'

export const useReply = () => {
  const isFetching = ref(false)
  const { $axios } = useNuxtApp()
  const route = useRoute()
  const indexStore = useIndexStore()
  const profileStore = useProfileStore()
  const singleStore = useSingleStore()

  const createReply = async (form: Object, comment: Comment) => {
    try {
      isFetching.value = true
      const { data } = await $axios.post<{
        reply: Reply
        commentsCount: number
      }>(`/api/reply/store/${comment.id}`, form)
      indexStore.pushReply(data.reply, comment, data.commentsCount)
      profileStore.pushReply(data.reply, comment, data.commentsCount)
      if (route.params.postId) {
        singleStore.pushReply(data.reply, comment, data.commentsCount)
      }
    } finally {
      isFetching.value = false
    }
  }

  const editReply = async (form: Object, reply: Reply, comment: Comment) => {
    try {
      isFetching.value = true
      const { data } = await $axios.post<{ reply: Reply }>(
        `/api/reply/update/${reply.id}`,
        form,
      )
      indexStore.setReply(data.reply, comment)
      profileStore.setReply(data.reply, comment)
      if (route.params.postId) {
        singleStore.setReply(data.reply, comment)
      }
    } finally {
      isFetching.value = false
    }
  }

  const deleteReply = async (reply: Reply, comment: Comment) => {
    try {
      isFetching.value = true
      const { data } = await $axios.post<{ commentsCount: number }>(
        `/api/reply/destroy/${reply.id}`,
      )
      indexStore.spliceReply(reply, comment, data.commentsCount)
      profileStore.spliceReply(reply, comment, data.commentsCount)
      if (route.params.postId) {
        singleStore.spliceReply(reply, comment, data.commentsCount)
      }
    } finally {
      isFetching.value = false
    }
  }

  const likeReply = async (id: string, comment: Comment) => {
    try {
      isFetching.value = true
      const { data } = await $axios.post<{ reply: Reply }>(
        `/api/reply/like/${id}`,
      )
      indexStore.setReply(data.reply, comment)
      profileStore.setReply(data.reply, comment)
      if (route.params.postId) {
        singleStore.setReply(data.reply, comment)
      }
    } finally {
      isFetching.value = false
    }
  }
  return { isFetching, createReply, editReply, deleteReply, likeReply }
}
