import { useEffect } from "react"
import { createRoot } from "react-dom/client"

import { ClientTweetCard } from "@/components/ui/client-tweet-card"

export default function TweetEmbeds() {
  useEffect(() => {
    const roots = new Map<Element, ReturnType<typeof createRoot>>()
    const containers = document.querySelectorAll("[data-tweet-id]")

    containers.forEach((container) => {
      const tweetId = container.getAttribute("data-tweet-id")
      if (!tweetId) return

      const root = createRoot(container)
      root.render(<ClientTweetCard id={tweetId} className="mx-auto w-full max-w-xl" />)
      roots.set(container, root)
    })

    return () => {
      roots.forEach((root) => root.unmount())
    }
  }, [])

  return null
}
