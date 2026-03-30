import { createClient } from "@sanity/client"

const projectId = import.meta.env.PUBLIC_SANITY_PROJECT_ID || "uzi620nl"
const dataset = import.meta.env.PUBLIC_SANITY_DATASET || "production"
const apiVersion = import.meta.env.PUBLIC_SANITY_API_VERSION || "2026-03-30"
const token = import.meta.env.SANITY_READ_TOKEN

export const sanityClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: !token,
  token,
  perspective: "published",
})
