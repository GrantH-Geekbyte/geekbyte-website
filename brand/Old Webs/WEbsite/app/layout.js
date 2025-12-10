import "./globals.css"
import Link from "next/link"

export const metadata = {
  title: "Geekbyte — Trusted Product Leadership & Technical Due Diligence",
  description: "Helping software companies and investors scale product strategy, de-risk M&A, and deliver results—without adding headcount.",
  openGraph: {
    title: "Geekbyte — Trusted Product Leadership & Technical Due Diligence",
    description: "Reference-focused profile of services, outcomes, and approach.",
    url: "https://www.geekbyte.biz",
    siteName: "Geekbyte",
    images: [{ url: "/og.png", width: 1200, height: 630 }],
    locale: "en_US",
    type: "website",
  },
  icons: { icon: "/favicon.svg" }
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-slateLite text-ink antialiased">
        <Nav />
        <main className="min-h-screen">{children}</main>
        <Footer />
      </body>
    </html>
  )
}

function Nav() {
  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur border-b border-gray-100">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="font-semibold tracking-tight text-xl">Geekbyte</Link>
        <nav className="flex items-center gap-6 text-sm">
          <Link href="/services" className="hover:text-accent">Services</Link>
          <Link href="/about" className="hover:text-accent">About</Link>
          <Link href="/contact" className="hover:text-accent">Contact</Link>
        </nav>
      </div>
    </header>
  )
}

function Footer() {
  return (
    <footer className="mt-16 border-t border-gray-100">
      <div className="max-w-6xl mx-auto px-4 py-10 text-sm grid gap-4 md:grid-cols-3">
        <div>
          <div className="font-semibold">Geekbyte</div>
          <p className="text-gray-600 mt-2">Senior product leadership and technical due diligence.</p>
        </div>
        <div>
          <div className="font-semibold">Contact</div>
          <p className="text-gray-600 mt-2">
            <a className="hover:text-accent" href="mailto:grant@geekbyte.biz">grant@geekbyte.biz</a><br/>
            <a className="hover:text-accent" href="tel:+12812241108">281-224-1108</a><br/>
            <a className="hover:text-accent" target="_blank" href="https://www.linkedin.com/in/grant-howecto">LinkedIn</a>
          </p>
        </div>
        <div>
          <div className="font-semibold">Info</div>
          <p className="text-gray-600 mt-2">© {new Date().getFullYear()} Geekbyte LLC. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
