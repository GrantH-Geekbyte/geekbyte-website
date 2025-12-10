export const metadata = { title: "About — Geekbyte" }

export default function AboutPage() {
  return (
    <div className="bg-white">
      <div className="max-w-6xl mx-auto px-4 py-16">
        <h1 className="text-3xl font-semibold tracking-tight">About Geekbyte</h1>
        <p className="text-gray-700 mt-3 max-w-3xl">
          Geekbyte is led by Grant Howe, an experienced product and technology executive who has scaled SaaS platforms, led M&A diligence, and advised portfolio companies worldwide.
          We focus on outcome-driven engagements that bring clarity and confidence to complex product and technology decisions.
        </p>

        <div className="mt-8 grid md:grid-cols-2 gap-6">
          <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-soft">
            <h2 className="font-semibold">Philosophy</h2>
            <p className="text-gray-700 mt-2">
              Outcome-first, pragmatic, and collaborative. We operate like an extension of your executive team,
              bringing structure without bureaucracy and speed without sacrificing quality.
            </p>
          </div>
          <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-soft">
            <h2 className="font-semibold">Experience</h2>
            <p className="text-gray-700 mt-2">
              Deep product management leadership, technical diligence across SaaS, and operational uplift in product ops and GTM.
              Frameworks influenced by Pragmatic Institute and PMP practices.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
