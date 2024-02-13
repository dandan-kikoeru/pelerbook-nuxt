export interface User {
  avatar: string
  firstname: string
  id: number
  surname: string
  cover: string
  createdAt: Date
}

export interface Posts {
  data: Post[]
  links?: Links
  meta?: Meta
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
}

export interface Meta {
  current_page: number
  from: number
  last_page: number
  links: Link[]
  path: string
  per_page: number
  to: number
  total: number
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

export interface Form {
  caption: string
  image: any
}

export interface Comment {
  content: string
  id: string
  user: User
  createdAt: Date
  postId: string
  likes: number
  likedByUser: boolean
}
