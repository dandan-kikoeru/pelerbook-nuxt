import type { Post, Comment, Reply } from '~/types'

export const useSingleStore = defineStore('single', () => {
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
  })

  const post = ref<Post>(defaultPostData)
  const setPost = (data: Post) => {
    post.value = data
  }

  const getCommentIndexById = (commentId: string) => {
    return post.value.comments.findIndex((comment) => comment.id === commentId)
  }

  const setComment = (data: Comment, index: number) => {
    post.value.comments[index] = data
  }

  const pushComment = (data: Comment) => {
    post.value.comments.push(data)
    post.value.commentsCount++
  }

  const spliceComment = (comment: Comment) => {
    const commentIndex = getCommentIndexById(comment.id)
    post.value.comments.splice(commentIndex, 1)
    post.value.commentsCount--
  }

  /**
   *  * REPLY
   */

    const getReplyIndexById = (
      replyId: string,
      commentIndex: number,
    ) => {
      return post.value.comments[commentIndex].replies.findIndex(
        (reply) => reply.id === replyId,
      )
    }

    const setReply = (reply: Reply, comment: Comment) => {
      const commentIndex = getCommentIndexById(comment.id)
      if (commentIndex === -1) {
        return
      }
      post.value.comments[post.value.commentsCount - 1].replies[
        getReplyIndexById(reply.id, commentIndex)
      ] = reply
    }

    const pushReply = (reply: Reply, comment: Comment) => {
      const commentIndex = getCommentIndexById(comment.id)
      if (commentIndex === -1) {
        return
      }
      post.value.comments[commentIndex].replies.push(reply)
      post.value.comments[commentIndex].repliesCount++
    }

    const spliceReply = (reply: Reply, comment: Comment) => {
      const commentIndex = getCommentIndexById(comment.id)
      if (commentIndex === -1) {
        return
      }
      const replyIndex = getReplyIndexById(reply.id, commentIndex)
      post.value.comments[commentIndex].replies.splice(replyIndex, 1)
      post.value.comments[commentIndex].repliesCount--
    }

  return { post, setPost, setComment, pushComment, spliceComment, setReply, pushReply, spliceReply }
})
