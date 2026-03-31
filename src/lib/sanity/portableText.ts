import { createImageUrlBuilder } from "@sanity/image-url"
import { toHTML } from "@portabletext/to-html"
import { sanityClient } from "@/lib/sanity/client"

const builder = createImageUrlBuilder(sanityClient)
const allowedEmbedHosts = new Set(["www.youtube.com", "youtube.com", "youtu.be", "player.vimeo.com", "vimeo.com"])
const allowedLinkProtocols = new Set(["http:", "https:", "mailto:", "tel:"])

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;")
}

function toSafeUrl(url: string) {
  try {
    const parsed = new URL(url)
    return allowedLinkProtocols.has(parsed.protocol) ? parsed : null
  } catch {
    return null
  }
}

function toPreviewCard(url: string) {
  const parsed = toSafeUrl(url)
  if (!parsed) return `<p>${escapeHtml(url)}</p>`

  const host = parsed.hostname.replace(/^www\./, "")
  const path = `${parsed.pathname}${parsed.search}` || "/"
  const display = path.length > 72 ? `${path.slice(0, 72)}…` : path

  return `<a href="${escapeHtml(parsed.toString())}" target="_blank" rel="noopener noreferrer nofollow" class="not-prose my-6 block border border-border bg-card p-4 transition-colors hover:bg-muted/40"><div class="text-xs font-medium uppercase tracking-wide text-muted-foreground">${escapeHtml(host)}</div><div class="mt-1 text-sm text-foreground">${escapeHtml(display)}</div></a>`
}

function extractTweetId(parsed: URL) {
  if (!parsed.hostname.includes("twitter.com") && !parsed.hostname.includes("x.com")) {
    return null
  }

  const match = parsed.pathname.match(/\/status\/(\d+)/)
  return match?.[1] ?? null
}

function toEmbedIframe(url: string) {
  const parsed = toSafeUrl(url)
  if (!parsed || (parsed.protocol !== "http:" && parsed.protocol !== "https:")) {
    return `<p>${escapeHtml(url)}</p>`
  }

  if (!allowedEmbedHosts.has(parsed.hostname)) {
    return toPreviewCard(parsed.toString())
  }

  if (parsed.hostname === "youtu.be") {
    const id = parsed.pathname.replace("/", "")
    if (id) {
      return `<div class="not-prose my-6 aspect-video w-full overflow-hidden border border-border bg-card"><iframe class="h-full w-full" src="https://www.youtube.com/embed/${escapeHtml(id)}" loading="lazy" referrerpolicy="strict-origin-when-cross-origin" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe></div>`
    }
  }

  if (parsed.hostname.includes("youtube")) {
    const id = parsed.searchParams.get("v")
    if (id) {
      return `<div class="not-prose my-6 aspect-video w-full overflow-hidden border border-border bg-card"><iframe class="h-full w-full" src="https://www.youtube.com/embed/${escapeHtml(id)}" loading="lazy" referrerpolicy="strict-origin-when-cross-origin" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe></div>`
    }
  }

  if (parsed.hostname.includes("vimeo")) {
    const id = parsed.pathname.split("/").filter(Boolean).at(-1)
    if (id) {
      return `<div class="not-prose my-6 aspect-video w-full overflow-hidden border border-border bg-card"><iframe class="h-full w-full" src="https://player.vimeo.com/video/${escapeHtml(id)}" loading="lazy" referrerpolicy="strict-origin-when-cross-origin" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen></iframe></div>`
    }
  }

  return toPreviewCard(parsed.toString())
}

export function portableTextToHtml(value: Array<Record<string, unknown>>) {
  return toHTML(value as any, {
    components: {
      block: {
        normal: ({ children }) => `<p class="leading-8 text-foreground/95">${children}</p>`,
        h2: ({ children }) => `<h2 class="mt-10 scroll-mt-24 text-2xl font-semibold tracking-tight">${children}</h2>`,
        h3: ({ children }) => `<h3 class="mt-8 scroll-mt-24 text-xl font-semibold tracking-tight">${children}</h3>`,
        h4: ({ children }) => `<h4 class="mt-6 scroll-mt-24 text-lg font-semibold tracking-tight">${children}</h4>`,
        blockquote: ({ children }) =>
          `<blockquote class="my-6 border-l-2 border-border pl-4 text-muted-foreground">${children}</blockquote>`,
      },
      marks: {
        link: ({ value, children }) => {
          const href = typeof value?.href === "string" ? value.href : ""
          const safe = href ? toSafeUrl(href) : null
          if (!safe) {
            return `<span>${children}</span>`
          }

          if (safe.protocol === "mailto:" || safe.protocol === "tel:") {
            return `<a href="${escapeHtml(safe.toString())}">${children}</a>`
          }

          return `<a href="${escapeHtml(safe.toString())}" target="_blank" rel="noopener noreferrer nofollow">${children}</a>`
        },
        code: ({ children }) => `<code class="rounded bg-muted px-1.5 py-0.5 text-[0.9em]">${children}</code>`,
      },
      types: {
        image: ({ value }) => {
          const imageUrl = value?.asset ? builder.image(value).width(1600).quality(82).url() : null
          if (!imageUrl) return ""

          const alt = typeof value.alt === "string" ? value.alt : ""
          const caption = typeof value.caption === "string" ? value.caption : ""

          return `<figure class="not-prose my-8 border border-border bg-card"><img src="${escapeHtml(imageUrl)}" alt="${escapeHtml(alt)}" loading="lazy" class="w-full object-cover" />${caption ? `<figcaption class="border-t border-border px-4 py-2 text-xs text-muted-foreground">${escapeHtml(caption)}</figcaption>` : ""}</figure>`
        },
        codeBlock: ({ value }) => {
          const code = typeof value?.code === "string" ? value.code : ""
          const language = typeof value?.language === "string" ? value.language : "plaintext"

          if (!code) return ""

          if (language === "mermaid") {
            return `<div class="not-prose my-6 border border-border bg-card p-4"><div class="mb-3 text-xs font-medium uppercase tracking-wide text-muted-foreground">Mermaid</div><pre class="mermaid overflow-x-auto text-sm leading-6">${escapeHtml(code)}</pre></div>`
          }

          return `<div class="not-prose my-6 border border-border bg-card"><div class="border-b border-border px-4 py-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">${escapeHtml(language)}</div><pre class="overflow-x-auto p-4 text-sm leading-6"><code class="language-${escapeHtml(language)}">${escapeHtml(code)}</code></pre></div>`
        },
        embedUrl: ({ value }) => {
          const url = typeof value?.url === "string" ? value.url : ""
          if (!url) return ""

          const parsed = toSafeUrl(url)
          if (!parsed) return `<p>${escapeHtml(url)}</p>`

          const tweetId = extractTweetId(parsed)
          if (tweetId) {
            return `<div class="not-prose my-6" data-tweet-id="${escapeHtml(tweetId)}"></div>`
          }

          return toEmbedIframe(parsed.toString())
        },
      },
    },
  })
}
