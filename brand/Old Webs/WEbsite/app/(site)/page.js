import Link from "next/link"

export default function HomePage() {
  return (
    <div>
      <section className="bg-white">
        <div className="max-w-6xl mx-auto px-4 py-20 grid gap-10 md:grid-cols-2 items-center">
          <div>
            <h1 className="text-4xl md:text-5xl font-semibold tracking-tight">
              Trusted Product Leadership & Technical Due Diligence
            </h1>
            <p className="text-lg text-gray-700 mt-4">
              Helping software companies and investors scale product strategy, de-risk M&A, and deliver results—without adding headcount.
            </p>
            <div className="mt-8 flex gap-3">
              <Link href="/about" className="px-5 py-3 rounded-lg bg-accent text-white shadow-soft">About Geekbyte</Link>
              <Link href="/services" className="px-5 py-3 rounded-lg border border-gray-200 hover:border-accent">See How We Work</Link>
            </div>
          </div>
          <div className="bg-slateLite rounded-2xl p-6 border border-gray-100 shadow-soft">
            <ul className="space-y-4 text-sm">
              <li><span className="font-semibold">Reference-focused:</span> built for credibility over lead capture.</li>
              <li><span className="font-semibold">Outcome-driven:</span> clear wins and executive-ready artifacts.</li>
              <li><span className="font-semibold">Operator-led diligence:</span> real-world, negotiation-ready recommendations.</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="bg-white border-t border-gray-100">
        <div className="max-w-6xl mx-auto px-4 py-10">
          <p className="uppercase tracking-wider text-xs text-gray-500">Trusted By</p>
          <div className="mt-4 grid grid-cols-2 md:grid-cols-6 gap-6 text-gray-400">
            <div className="h-10 border border-dashed border-gray-200 rounded-md grid place-items-center">Logo</div>
            <div className="h-10 border border-dashed border-gray-200 rounded-md grid place-items-center">Logo</div>
            <div className="h-10 border border-dashed border-gray-200 rounded-md grid place-items-center">Logo</div>
            <div className="h-10 border border-dashed border-gray-200 rounded-md grid place-items-center">Logo</div>
            <div className="h-10 border border-dashed border-gray-200 rounded-md grid place-items-center">Logo</div>
            <div className="h-10 border border-dashed border-gray-200 rounded-md grid place-items-center">Logo</div>
          </div>
        </div>
      </section>

      <section className="bg-white border-t border-gray-100">
        <div className="max-w-6xl mx-auto px-4 py-16">
          <div className="grid md:grid-cols-3 gap-6">
            <ServiceCard title="Fractional Product Leadership" desc="Executive-level product management without full-time overhead. Align strategy, roadmap, and execution with investor and customer expectations."/>
            <ServiceCard title="Technical Due Diligence" desc="Rigorous, operator-led diligence for investors and acquirers. Identify risks, highlight opportunities, and deliver negotiation-ready recommendations."/>
            <ServiceCard title="Product Ops & GTM Systems" desc="Scalable frameworks for roadmapping, portfolio governance, and consistent delivery with sales/marketing alignment."/>
          </div>
        </div>
      </section>

      <section className="bg-white border-t border-gray-100">
        <div className="max-w-6xl mx-auto px-4 py-16">
          <h2 className="text-2xl font-semibold tracking-tight">Selected Outcomes</h2>
          <div className="grid md:grid-cols-3 gap-6 mt-6">
            <OutcomeCard problem="Investor concerned about hidden technical debt in SaaS acquisition."
              action="Led 2-week diligence: architecture, codebase, org/process review."
              result="Flagged key risks incl. AngularJS EOL; enabled valuation adjustment + remediation roadmap."/>
            <OutcomeCard problem="Portfolio company lacked product strategy; roadmap was reactive."
              action="Stepped in as Fractional CPO, instituted prioritization and planning cadence."
              result="12‑month roadmap aligned to revenue goals and board priorities."/>
            <OutcomeCard problem="Disorganized product ops slowing GTM execution."
              action="Implemented lean portfolio management and reporting cadence."
              result="Increased release predictability; reduced missed commitments by 40%."/>
          </div>
        </div>
      </section>

      <CtaBand />
    </div>
  )
}

function ServiceCard({ title, desc }) {
  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-soft">
      <h3 className="font-semibold">{title}</h3>
      <p className="text-gray-700 mt-2">{desc}</p>
    </div>
  )
}

function OutcomeCard({ problem, action, result }) {
  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-soft">
      <p className="text-sm"><span className="font-semibold">Problem:</span> {problem}</p>
      <p className="text-sm mt-2"><span className="font-semibold">Intervention:</span> {action}</p>
      <p className="text-sm mt-2"><span className="font-semibold">Result:</span> {result}</p>
    </div>
  )
}

function CtaBand() {
  return (
    <section className="bg-ink text-white">
      <div className="max-w-6xl mx-auto px-4 py-12 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h3 className="text-xl font-semibold">Ready to validate your decision?</h3>
          <p className="text-white/80">Reach out for references, case examples, or to discuss a project.</p>
        </div>
        <div className="flex gap-3">
          <a className="px-5 py-3 rounded-lg bg-white text-ink" href="mailto:grant@geekbyte.biz">Email</a>
          <a className="px-5 py-3 rounded-lg border border-white/30" href="tel:+12812241108">Call</a>
        </div>
      </div>
    </section>
  )
}
