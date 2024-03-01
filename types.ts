export interface User {
  avatar: string
  firstName: string
  id: number
  surname: string
  cover: string
  createdAt: Date
}

export interface Post {
  caption: string
  createdAt: Date
  id: string
  likes: number
  likedByUser: boolean
  image: string
  user: User
  commentsCount: number
  comments: Comment[]
  shared: Post | null
  sharesCount: number
}

export interface Links {
  first: string
  last: string
  prev: string
  next: string
}

export interface Link {
  url: null | string
  label: string
  active: boolean
}

export interface Comment {
  content: string
  id: string
  user: User
  createdAt: Date
  postId: string
  likes: number
  likedByUser: boolean
  repliesCount: number
  replies: Reply[]
}

export interface Reply {
  content: string
  id: string
  user: User
  createdAt: Date
  commentId: string
  likes: number
  likedByUser: boolean
}

export interface AxiosError {
  response: {
    data: {
      message: string
      errors: {
        email: [string]
        password: [string]
        firstName: [string]
        surname: [string]
        avatar: [string]
        cover: [string]
      }
    }
    status: number
    statusText: string
  }
}
