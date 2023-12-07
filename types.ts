export interface User {
  avatar: string
  firstname: string
  id: number
  surname: string
  cover: string
  createdAt: string
}

export interface Posts {
  data: Post[]
  links?: Links
  meta?: Meta
}

export interface Post {
  caption: string
  createdAt: string
  id: string
  likes: BigInteger
  likedByUser: boolean
  image: string
  user: User
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
  prev: null
  next: string
}

export interface Link {
  url: null | string
  label: string
  active: boolean
}

export interface Form {
  caption?: string
  image?: any
}
