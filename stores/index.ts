import type { Links, Post, Comment } from '~/types'

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

  const getCommentIndexById = (commentId: string, postIndex: number) => {
    return posts.value[postIndex].comments.findIndex(
      (comment) => comment.id === commentId,
    )
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
    getPostIndexById,
    setComment,
    pushComment,
    spliceComment,
  }
})
