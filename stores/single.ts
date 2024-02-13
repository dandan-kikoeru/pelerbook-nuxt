import type { Post, Comment } from '~/types'

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
  const setComment = (data: Comment, index: number) => {
    post.value.comments[index] = data
  }

  const pushComment = (data: Comment) => {
    post.value.comments.push(data)
    post.value.commentsCount++
  }

  const getCommentIndexById = (commentId: string) => {
    return post.value.comments.findIndex((comment) => comment.id === commentId)
  }

  const spliceComment = (comment: Comment) => {
    const commentIndex = getCommentIndexById(comment.id)
    post.value.comments.splice(commentIndex, 1)
    post.value.commentsCount--
  }
  return { post, setPost, setComment, pushComment, spliceComment }
})
