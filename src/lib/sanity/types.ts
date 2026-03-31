export interface SanitySlug {
  current: string
}

export interface SanityImageAsset {
  _ref?: string
  _type?: string
}

export interface SanityImage {
  _type: "image"
  asset?: SanityImageAsset
  alt?: string
  caption?: string
}

export interface SanityPostDocument {
  _id: string
  title: string
  slug: SanitySlug
  description: string
  publishedAt: string
  tags?: string[]
  readingMinutes?: number
  draft?: boolean
  coverImage?: SanityImage
  body?: Array<Record<string, unknown>>
}

export interface BlogPostSummary {
  id: string
  slug: string
  title: string
  description: string
  pubDate: Date
  tags: string[]
  readingMinutes: number
  coverImageUrl?: string
  coverImageAlt?: string
}

export interface BlogPostDetail extends BlogPostSummary {
  body: Array<Record<string, unknown>>
}
