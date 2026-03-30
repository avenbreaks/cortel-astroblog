import { useState } from "react"

import { Button } from "@/components/ui/button"

const FORMSPREE_ENDPOINT = "https://formspree.io/f/xpqodqkg"

export default function ContactModal() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <Button className="rounded-none" onClick={() => setOpen(true)}>
        Hubungi Kami
      </Button>

      {open && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-background/80 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg border border-border bg-card p-5 md:p-6">
            <div className="mb-4 flex items-start justify-between gap-3">
              <div>
                <p className="text-xs tracking-wide text-primary uppercase">Kontak</p>
                <h3 className="mt-1 text-lg font-semibold tracking-tight text-foreground">
                  Kirim pesan ke tim cortel blog
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Tutup modal"
                className="inline-flex h-8 items-center border border-border bg-background px-2 text-xs text-muted-foreground hover:text-foreground"
              >
                Tutup
              </button>
            </div>

            <form action={FORMSPREE_ENDPOINT} method="POST" className="space-y-3">
              <div className="space-y-1.5">
                <label htmlFor="contact-name" className="text-xs text-foreground">
                  Nama
                </label>
                <input
                  id="contact-name"
                  name="name"
                  required
                  className="h-9 w-full border border-border bg-background px-3 text-sm text-foreground outline-none focus-visible:border-ring focus-visible:ring-1 focus-visible:ring-ring/50"
                  placeholder="Nama kamu"
                />
              </div>

              <div className="space-y-1.5">
                <label htmlFor="contact-email" className="text-xs text-foreground">
                  Email
                </label>
                <input
                  id="contact-email"
                  name="email"
                  type="email"
                  required
                  className="h-9 w-full border border-border bg-background px-3 text-sm text-foreground outline-none focus-visible:border-ring focus-visible:ring-1 focus-visible:ring-ring/50"
                  placeholder="nama@email.com"
                />
              </div>

              <div className="space-y-1.5">
                <label htmlFor="contact-message" className="text-xs text-foreground">
                  Pesan
                </label>
                <textarea
                  id="contact-message"
                  name="message"
                  required
                  rows={5}
                  className="w-full border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus-visible:border-ring focus-visible:ring-1 focus-visible:ring-ring/50"
                  placeholder="Tulis kebutuhan atau pertanyaan kamu"
                />
              </div>

              <div className="pt-1">
                <Button type="submit" className="rounded-none">
                  Kirim Pesan
                </Button>
              </div>
            </form>
          </div>

          <button
            type="button"
            aria-label="Tutup overlay"
            className="absolute inset-0 -z-10"
            onClick={() => setOpen(false)}
          />
        </div>
      )}
    </>
  )
}
