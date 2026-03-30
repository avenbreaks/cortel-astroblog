import { defineConfig, definePlugin } from "sanity"
import { structureTool } from "sanity/structure"
import { visionTool } from "@sanity/vision"
import { schemaTypes } from "./sanity/schemaTypes"

const publicProjectId = import.meta.env.PUBLIC_SANITY_PROJECT_ID || "uzi620nl"
const publicDataset = import.meta.env.PUBLIC_SANITY_DATASET || "production"

const singletonActions = new Set(["publish", "discardChanges", "restore"])
const singletonTypes = new Set<string>([])

const singletonPlugin = definePlugin({
  name: "singletonPlugin",
  document: {
    newDocumentOptions: (prev, { creationContext }) => {
      if (creationContext.type === "global") {
        return prev.filter((templateItem) => !singletonTypes.has(templateItem.templateId))
      }
      return prev
    },
    actions: (prev, { schemaType }) => {
      if (singletonTypes.has(schemaType)) {
        return prev.filter(({ action }) => action && singletonActions.has(action))
      }
      return prev
    },
  },
})

export default defineConfig({
  name: "default",
  title: "astro-blog",
  basePath: "/studio",
  projectId: publicProjectId,
  dataset: publicDataset,
  plugins: [structureTool(), visionTool(), singletonPlugin()],
  schema: {
    types: schemaTypes,
  },
})
