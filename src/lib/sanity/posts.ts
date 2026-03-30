import { sanityClient } from "@/lib/sanity/client"
import {
  allPublishedPostsQuery,
  publishedPostBySlugQuery,
  publishedPostSlugsQuery,
} from "@/lib/sanity/queries"
import type { BlogPostDetail, BlogPostSummary, SanityPostDocument } from "@/lib/sanity/types"

function mapToSummary(post: SanityPostDocument): BlogPostSummary {
  return {
    id: post._id,
    slug: post.slug?.current ?? "",
    title: post.title,
    description: post.description,
    pubDate: new Date(post.publishedAt),
    tags: post.tags ?? [],
    readingMinutes: post.readingMinutes ?? 5,
  }
}

function mapToDetail(post: SanityPostDocument): BlogPostDetail {
  return {
    ...mapToSummary(post),
    body: post.body ?? [],
  }
}

export async function getAllPublishedPosts(): Promise<BlogPostSummary[]> {
  const posts = await sanityClient.fetch<SanityPostDocument[]>(allPublishedPostsQuery)
  return posts.map(mapToSummary).filter((post) => post.slug)
}

export async function getFeaturedPosts(limit = 3): Promise<BlogPostSummary[]> {
  const posts = await getAllPublishedPosts()
  return posts.slice(0, limit)
}

export async function getPostSlugs(): Promise<string[]> {
  const rows = await sanityClient.fetch<Array<{ slug: string }>>(publishedPostSlugsQuery)
  return rows.map((row) => row.slug).filter(Boolean)
}

export async function getPostBySlug(slug: string): Promise<BlogPostDetail | null> {
  const post = await sanityClient.fetch<SanityPostDocument | null>(publishedPostBySlugQuery, { slug })

  if (!post || !post.slug?.current) {
    return null
  }

  return mapToDetail(post)
}
