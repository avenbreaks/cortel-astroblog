import { defineArrayMember, defineField, defineType } from "sanity"

export const blockContentType = defineType({
  title: "Block Content",
  name: "blockContent",
  type: "array",
  of: [
    defineArrayMember({
      type: "block",
      styles: [
        { title: "Normal", value: "normal" },
        { title: "H2", value: "h2" },
        { title: "H3", value: "h3" },
        { title: "H4", value: "h4" },
        { title: "Quote", value: "blockquote" },
      ],
      lists: [
        { title: "Bullet", value: "bullet" },
        { title: "Numbered", value: "number" },
      ],
      marks: {
        decorators: [
          { title: "Bold", value: "strong" },
          { title: "Italic", value: "em" },
          { title: "Code", value: "code" },
        ],
        annotations: [
          {
            title: "Link",
            name: "link",
            type: "object",
            fields: [
              defineField({
                title: "URL",
                name: "href",
                type: "url",
                validation: (Rule) =>
                  Rule.uri({ scheme: ["http", "https", "mailto", "tel"] }).required(),
              }),
            ],
          },
        ],
      },
    }),
    defineArrayMember({
      name: "codeBlock",
      title: "Code Block",
      type: "object",
      fields: [
        defineField({
          name: "language",
          title: "Language",
          type: "string",
          initialValue: "plaintext",
          options: {
            list: [
              { title: "Plain Text", value: "plaintext" },
              { title: "JavaScript", value: "javascript" },
              { title: "TypeScript", value: "typescript" },
              { title: "TSX", value: "tsx" },
              { title: "JSX", value: "jsx" },
              { title: "HTML", value: "html" },
              { title: "CSS", value: "css" },
              { title: "JSON", value: "json" },
              { title: "Bash", value: "bash" },
              { title: "Markdown", value: "markdown" },
            ],
          },
        }),
        defineField({
          name: "code",
          title: "Code",
          type: "text",
          rows: 10,
          validation: (Rule) => Rule.required(),
        }),
      ],
      preview: {
        select: {
          language: "language",
        },
        prepare({ language }) {
          return {
            title: "Code Block",
            subtitle: language || "plaintext",
          }
        },
      },
    }),
    defineArrayMember({
      type: "image",
      options: { hotspot: true },
      fields: [
        defineField({
          name: "alt",
          title: "Alternative Text",
          type: "string",
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: "caption",
          title: "Caption",
          type: "string",
        }),
      ],
    }),
    defineArrayMember({
      name: "embedUrl",
      title: "Embed URL",
      type: "object",
      fields: [
        defineField({
          name: "url",
          title: "URL",
          type: "url",
          validation: (Rule) => Rule.uri({ scheme: ["http", "https"] }).required(),
        }),
      ],
      preview: {
        select: {
          url: "url",
        },
        prepare({ url }) {
          return {
            title: "Embed URL",
            subtitle: url,
          }
        },
      },
    }),
  ],
})
