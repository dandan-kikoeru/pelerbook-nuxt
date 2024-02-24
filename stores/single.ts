import type { Post, Comment, Reply, Links } from '~/types'

export const useSingleStore = defineStore('single', () => {
  const { $axios } = useNuxtApp()
  const { defaultProfileData } = useProfileStore()
  const defaultPostData: Post = reactive({
    id: '0',
    caption: 'Lorem ipsum dolor sit amet',
    createdAt: new Date('1970-01-01T00:00:00.000Z'),
    user: defaultProfileData,
    likes: 0,
    likedByUser: false,
    image: '',
    commentsCount: 0,
    comments: [],
    shared: null,
    sharesCount: 0,
  })

  const post = ref<Post>(defaultPostData)
  const setPost = (data: Post) => {
    post.value = data
    page.value = 1
  }

  const setCaption = (caption: string, image: string) => {
    post.value.caption = caption
    post.value.image = image
  }

  const setLikes = (likes: number, likedByUser: boolean) => {
    post.value.likes = likes
    post.value.likedByUser = likedByUser
  }

  const setShares = (sharesCount: number) => {
    post.value.sharesCount = sharesCount
  }

  const page = ref<number>(1)
  const links = ref<Links>()
  const isFetching = ref(false)
  const fetchComments = async () => {
    try {
      isFetching.value = true
      const response = await $axios.get(
        `/api/post/${post.value.id}/comments?page=${page.value}`,
      )
      post.value.comments.unshift(...response.data.data.reverse())
      links.value = response.data.links
    } finally {
      isFetching.value = false
    }
  }
  const incrementPage = () => {
    page.value++
  }

  /**
   *  * COMMENT
   */

  const getCommentIndexById = (commentId: string) => {
    return post.value.comments.findIndex((comment) => comment.id === commentId)
  }

  const setCommentContent = (content: string, index: number) => {
    post.value.comments[index].content = content
  }

  const setCommentLikes = (
    likes: number,
    likedByUser: boolean,
    index: number,
  ) => {
    post.value.comments[index].likes = likes
    post.value.comments[index].likedByUser = likedByUser
  }

  const pushComment = (data: Comment, commentsCount: number) => {
    post.value.comments.push(data)
    post.value.commentsCount = commentsCount
  }

  const spliceComment = (comment: Comment, commentsCount: number) => {
    const commentIndex = getCommentIndexById(comment.id)
    post.value.comments.splice(commentIndex, 1)
    post.value.commentsCount = commentsCount
  }

  /**
   *  * REPLY
   */

  const getReplyIndexById = (replyId: string, commentIndex: number) => {
    return post.value.comments[commentIndex].replies.findIndex(
      (reply) => reply.id === replyId,
    )
  }

  const setReply = (reply: Reply, comment: Comment) => {
    const commentIndex = getCommentIndexById(comment.id)
    if (commentIndex === -1) {
      return
    }
    const replyIndex = getReplyIndexById(reply.id, commentIndex)
    if (replyIndex === -1) {
      return
    }
    post.value.comments[commentIndex].replies[replyIndex] = reply
  }

  const pushReply = (reply: Reply, comment: Comment, commentsCount: number) => {
    const commentIndex = getCommentIndexById(comment.id)
    if (commentIndex === -1) {
      return
    }
    post.value.comments[commentIndex].replies.push(reply)
    post.value.commentsCount = commentsCount
  }

  const spliceReply = (
    reply: Reply,
    comment: Comment,
    commentsCount: number,
  ) => {
    const commentIndex = getCommentIndexById(comment.id)
    if (commentIndex === -1) {
      return
    }
    const replyIndex = getReplyIndexById(reply.id, commentIndex)
    post.value.comments[commentIndex].replies.splice(replyIndex, 1)
    post.value.commentsCount = commentsCount
  }

  return {
    post,
    setPost,
    setCaption,
    setLikes,
    setCommentContent,
    setCommentLikes,
    pushComment,
    spliceComment,
    setReply,
    pushReply,
    spliceReply,
    fetchComments,
    links,
    incrementPage,
    isFetching,
    setShares,
  }
})
