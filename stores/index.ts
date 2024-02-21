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

  const setCaption = (caption: string, image: string, id: string) => {
    const index = getPostIndexById(id)
    if (index === -1) {
      return
    }
    posts.value[index].caption = caption
    posts.value[index].image = image
  }

  const setLikes = (likes: number, likedByUser: boolean, id: string) => {
    const index = getPostIndexById(id)
    if (index === -1) {
      return
    }
    posts.value[index].likes = likes
    posts.value[index].likedByUser = likedByUser
  }

  const splice = (id: string) => {
    const index = getPostIndexById(id)
    if (index === -1) {
      return
    }
    posts.value.splice(index, 1)
  }

  /**
   *  * COMMENT
   */

  const getCommentIndexById = (commentId: string, postIndex: number) => {
    return posts.value[postIndex].comments.findIndex(
      (comment) => comment.id === commentId,
    )
  }

  const setCommentContent = (content: string, id: string) => {
    const index = getPostIndexById(id)
    if (index === -1) {
      return
    }
    const post = posts.value[index]
    post.comments[post.comments.length - 1].content = content
  }

  const setCommentLikes = (likes: number, likedByUser: boolean, id: string) => {
    const index = getPostIndexById(id)
    if (index === -1) {
      return
    }
    const post = posts.value[index]
    post.comments[post.comments.length - 1].likes = likes
    post.comments[post.comments.length - 1].likedByUser = likedByUser
  }

  const pushComment = (comment: Comment, id: string, commentsCount: number) => {
    const index = getPostIndexById(id)
    if (index === -1) {
      return
    }
    const post = posts.value[index]
    post.comments.push(comment)
    post.commentsCount = commentsCount
  }

  const spliceComment = (comment: Comment, commentsCount: number) => {
    const postIndex = getPostIndexById(comment.postId)
    if (postIndex === -1) {
      return
    }
    const commentIndex = getCommentIndexById(comment.id, postIndex)
    if (commentIndex === -1) {
      return
    }
    posts.value[postIndex].comments.splice(commentIndex, 1)
    posts.value[postIndex].commentsCount = commentsCount
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
    post.comments[post.comments.length - 1].replies[
      getReplyIndexById(reply.id, postIndex, commentIndex)
    ] = reply
  }

  const pushReply = (reply: Reply, comment: Comment, commentsCount: number) => {
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
    post.commentsCount = commentsCount
  }

  const spliceReply = (
    reply: Reply,
    comment: Comment,
    commentsCount: number,
  ) => {
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
    post.commentsCount = commentsCount
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
    setLikes,
    setCaption,
    splice,
    setCommentContent,
    setCommentLikes,
    pushComment,
    spliceComment,
    setReply,
    pushReply,
    spliceReply,
  }
})
