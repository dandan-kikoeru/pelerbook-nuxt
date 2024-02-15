import type { Post } from '~/types'

export default (post: Post) => {
    let totalCount = post.commentsCount
    post.comments.forEach((comment) => {
      totalCount += comment.repliesCount
    })
    return totalCount
}
