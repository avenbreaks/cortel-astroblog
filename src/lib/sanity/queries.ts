import groq from "groq"

export const allPublishedPostsQuery = groq`
  *[_type == "post" && !(_id in path("drafts.**")) && draft != true]
  | order(publishedAt desc) {
    _id,
    title,
    slug,
    description,
    publishedAt,
    tags,
    readingMinutes,
    draft,
    coverImage,
    body
  }
`

export const publishedPostSlugsQuery = groq`
  *[_type == "post" && !(_id in path("drafts.**")) && draft != true && defined(slug.current)]
  | order(publishedAt desc) {
    "slug": slug.current
  }
`

export const publishedPostBySlugQuery = groq`
  *[_type == "post" && !(_id in path("drafts.**")) && draft != true && slug.current == $slug][0] {
    _id,
    title,
    slug,
    description,
    publishedAt,
    tags,
    readingMinutes,
    draft,
    coverImage,
    body
  }
`
