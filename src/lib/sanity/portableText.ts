import imageUrlBuilder from "@sanity/image-url"
import { toHTML } from "@portabletext/to-html"
import { sanityClient } from "@/lib/sanity/client"

const builder = imageUrlBuilder(sanityClient)
const allowedEmbedHosts = new Set(["www.youtube.com", "youtube.com", "youtu.be", "player.vimeo.com", "vimeo.com"])

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;")
}

function toEmbedIframe(url: string) {
  try {
    const parsed = new URL(url)

    if (!allowedEmbedHosts.has(parsed.hostname)) {
      return `<p><a href="${escapeHtml(url)}" target="_blank" rel="noopener noreferrer nofollow">${escapeHtml(url)}</a></p>`
    }

    if (parsed.hostname === "youtu.be") {
      const id = parsed.pathname.replace("/", "")
      if (id) {
        return `<div class="aspect-video w-full"><iframe class="h-full w-full border border-border" src="https://www.youtube.com/embed/${escapeHtml(id)}" loading="lazy" referrerpolicy="strict-origin-when-cross-origin" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe></div>`
      }
    }

    if (parsed.hostname.includes("youtube")) {
      const id = parsed.searchParams.get("v")
      if (id) {
        return `<div class="aspect-video w-full"><iframe class="h-full w-full border border-border" src="https://www.youtube.com/embed/${escapeHtml(id)}" loading="lazy" referrerpolicy="strict-origin-when-cross-origin" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe></div>`
      }
    }

    if (parsed.hostname.includes("vimeo")) {
      const id = parsed.pathname.split("/").filter(Boolean).at(-1)
      if (id) {
        return `<div class="aspect-video w-full"><iframe class="h-full w-full border border-border" src="https://player.vimeo.com/video/${escapeHtml(id)}" loading="lazy" referrerpolicy="strict-origin-when-cross-origin" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen></iframe></div>`
      }
    }

    return `<p><a href="${escapeHtml(url)}" target="_blank" rel="noopener noreferrer nofollow">${escapeHtml(url)}</a></p>`
  } catch {
    return `<p>${escapeHtml(url)}</p>`
  }
}

export function portableTextToHtml(value: Array<Record<string, unknown>>) {
  return toHTML(value as any, {
    components: {
      block: {
        normal: ({ children }) => `<p>${children}</p>`,
        h2: ({ children }) => `<h2>${children}</h2>`,
        h3: ({ children }) => `<h3>${children}</h3>`,
        h4: ({ children }) => `<h4>${children}</h4>`,
        blockquote: ({ children }) =>
          `<blockquote class="border-l-2 border-border pl-4 text-muted-foreground">${children}</blockquote>`,
      },
      marks: {
        link: ({ value, children }) => {
          const href = typeof value?.href === "string" ? value.href : "#"
          return `<a href="${escapeHtml(href)}" target="_blank" rel="noopener noreferrer nofollow">${children}</a>`
        },
        code: ({ children }) => `<code>${children}</code>`,
      },
      types: {
        image: ({ value }) => {
          const imageUrl = value?.asset ? builder.image(value).width(1400).quality(80).url() : null
          if (!imageUrl) return ""

          const alt = typeof value.alt === "string" ? value.alt : ""
          const caption = typeof value.caption === "string" ? value.caption : ""

          return `<figure><img src="${escapeHtml(imageUrl)}" alt="${escapeHtml(alt)}" loading="lazy" />${caption ? `<figcaption>${escapeHtml(caption)}</figcaption>` : ""}</figure>`
        },
        codeBlock: ({ value }) => {
          const code = typeof value?.code === "string" ? value.code : ""
          const language = typeof value?.language === "string" ? value.language : "plaintext"
          return `<pre><code class="language-${escapeHtml(language)}">${escapeHtml(code)}</code></pre>`
        },
        embedUrl: ({ value }) => {
          const url = typeof value?.url === "string" ? value.url : ""
          return url ? toEmbedIframe(url) : ""
        },
      },
    },
  })
}
