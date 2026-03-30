import { defineCollection, z } from "astro:content"

const blog = defineCollection({
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    tags: z.array(z.string()).default([]),
    readingMinutes: z.number().int().positive().default(5),
    draft: z.boolean().default(false),
  }),
})

export const collections = { blog }
