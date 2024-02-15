import type { Reply, Comment } from '~/types'

export const useReply = () => {
  const isFetching = ref(false)
  const { $axios } = useNuxtApp()
  const route: any = useRoute()
  const indexStore = useIndexStore()
  const profileStore = useProfileStore()
  const singleStore = useSingleStore()

  const createReply = async (form: Object, comment: Comment) => {
    try {
      isFetching.value = true
      const response: any = await $axios.post(
        `/api/reply/store/${comment.id}`,
        form,
      )
      indexStore.pushReply(response.data, comment)
      profileStore.pushReply(response.data, comment)
      if (route.params.postId) {
        singleStore.pushReply(response.data, comment)
      }
    } finally {
      isFetching.value = false
    }
  }

  const editReply = async (form: Object, reply: Reply, comment: Comment) => {
    try {
      isFetching.value = true
      const response = await $axios.post(`/api/reply/update/${reply.id}`, form)
      indexStore.setReply(response.data, comment)
      profileStore.setReply(response.data, comment)
      if (route.params.postId) {
        singleStore.setReply(response.data, comment)
      }
    } finally {
      isFetching.value = false
    }
  }

  const deleteReply = async (reply: Reply, comment: Comment) => {
    try {
      isFetching.value = true
      await $axios.post(`/api/reply/destroy/${reply.id}`)
      indexStore.spliceReply(reply, comment)
      profileStore.spliceReply(reply, comment)
      if (route.params.postId) {
        singleStore.spliceReply(reply, comment)
      }
    } finally {
      isFetching.value = false
    }
  }

  const likeReply = async (id: string, comment: Comment) => {
    try {
      isFetching.value = true
      const response: any = await $axios.post(`/api/reply/like/${id}`)
      indexStore.setReply(response.data, comment)
      profileStore.setReply(response.data, comment)
      if (route.params.postId) {
        singleStore.setReply(response.data, comment)
      }
    } finally {
      isFetching.value = false
    }
  }
  return { isFetching, createReply, editReply, deleteReply, likeReply }
}
