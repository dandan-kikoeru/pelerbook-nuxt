import type { Links, Post, Comment, Reply } from '~/types'

export const useIndexStore = defineStore('index', () => {
  const posts = ref<Post[]>([])
  const pages = ref<number>(1)
  const links = ref<Links>()

  const push = (data?: any) => {
    posts.value.push(...data)
  }

  const getPostIndexById = (id: string): number => {
    return posts.value.findIndex((post) => post.id === id)
  }

  const unshift = (data: Post) => {
    posts.value.unshift(data)
  }

  const incrementPage = () => {
    pages.value++
  }

  const reset = () => {
    posts.value = []
    pages.value = 1
  }

  const setLinks = (data: Links) => {
    links.value = data
  }

  const setPost = (data: Post, id: string) => {
    posts.value[getPostIndexById(id)] = data
  }

  const splice = (id: string) => {
    posts.value.splice(getPostIndexById(id), 1)
  }

  /**
   *  * COMMENT
   */

  const getCommentIndexById = (commentId: string, postIndex: number) => {
    return posts.value[postIndex].comments.findIndex(
      (comment) => comment.id === commentId,
    )
  }

  const setComment = (comment: Comment, id: string) => {
    const index = getPostIndexById(id)
    if (index === -1) {
      return
    }
    const post = posts.value[index]
    post.comments[post.commentsCount - 1] = comment
  }

  const pushComment = (comment: Comment, id: string) => {
    const index = getPostIndexById(id)
    if (index === -1) {
      return
    }
    const post = posts.value[index]
    post.comments.push(comment)
    post.commentsCount++
  }

  const spliceComment = (comment: Comment) => {
    const postIndex = getPostIndexById(comment.postId)
    if (postIndex === -1) {
      return
    }
    const commentIndex = getCommentIndexById(comment.id, postIndex)
    if (commentIndex === -1) {
      return
    }
    posts.value[postIndex].comments.splice(commentIndex, 1)
    posts.value[postIndex].commentsCount--
  }
  /**
   *  * REPLY
   */

  const getReplyIndexById = (
    replyId: string,
    postIndex: number,
    commentIndex: number,
  ) => {
    return posts.value[postIndex].comments[commentIndex].replies.findIndex(
      (reply) => reply.id === replyId,
    )
  }

  const setReply = (reply: Reply, comment: Comment) => {
    const postIndex = getPostIndexById(comment.postId)
    if (postIndex === -1) {
      return
    }
    const commentIndex = getCommentIndexById(comment.id, postIndex)
    if (commentIndex === -1) {
      return
    }
    const post = posts.value[postIndex]
    post.comments[post.commentsCount - 1].replies[
      getReplyIndexById(reply.id, postIndex, commentIndex)
    ] = reply
  }

  const pushReply = (reply: Reply, comment: Comment) => {
    const postIndex = getPostIndexById(comment.postId)
    if (postIndex === -1) {
      return
    }
    const commentIndex = getCommentIndexById(comment.id, postIndex)
    if (commentIndex === -1) {
      return
    }
    const post = posts.value[postIndex]
    post.comments[commentIndex].replies.push(reply)
    post.comments[commentIndex].repliesCount++
  }

  const spliceReply = (reply: Reply, comment: Comment) => {
    const postIndex = getPostIndexById(comment.postId)
    if (postIndex === -1) {
      return
    }
    const commentIndex = getCommentIndexById(comment.id, postIndex)
    if (commentIndex === -1) {
      return
    }
    const replyIndex = getReplyIndexById(reply.id, postIndex, commentIndex)
    const post = posts.value[postIndex]
    post.comments[commentIndex].replies.splice(replyIndex, 1)
    post.comments[commentIndex].repliesCount--
  }

  return {
    posts,
    push,
    pages,
    incrementPage,
    reset,
    setLinks,
    links,
    unshift,
    setPost,
    splice,
    setComment,
    pushComment,
    spliceComment,
    setReply,
    pushReply,
    spliceReply,
  }
})
