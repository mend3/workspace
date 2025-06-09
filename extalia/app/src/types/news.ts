export interface CreateNewsArticle {
  title: string
  content: string
  summary: string
  image?: string
  author: string
  tags: string[]
  isPublished: boolean
}

export interface UpdateNewsArticle {
  title?: string
  content?: string
  summary?: string
  image?: string
  author?: string
  tags?: string[]
  isPublished?: boolean
}
