export const metadata = { title: "Contact — Geekbyte" }

export default function ContactPage() {
  return (
    <div className="bg-white">
      <div className="max-w-6xl mx-auto px-4 py-16">
        <h1 className="text-3xl font-semibold tracking-tight">Contact</h1>
        <p className="text-gray-700 mt-3 max-w-3xl">
          If you've been referred to Geekbyte, we're happy to share references, case examples, and artifacts (under NDA where necessary).
        </p>
        <div className="mt-8 grid gap-4 text-gray-700">
          <div><span className="font-semibold">Email:</span> <a className="hover:text-accent" href="mailto:grant@geekbyte.biz">grant@geekbyte.biz</a></div>
          <div><span className="font-semibold">Phone:</span> <a className="hover:text-accent" href="tel:+12812241108">281-224-1108</a></div>
          <div><span className="font-semibold">LinkedIn:</span> <a className="hover:text-accent" target="_blank" href="https://www.linkedin.com/in/grant-howecto">linkedin.com/in/grant-howecto</a></div>
        </div>
      </div>
    </div>
  )
}
