export const metadata = { title: "Services — Geekbyte" }

export default function ServicesPage() {
  return (
    <div className="bg-white">
      <div className="max-w-6xl mx-auto px-4 py-16">
        <h1 className="text-3xl font-semibold tracking-tight">Our Services</h1>
        <p className="text-gray-700 mt-3 max-w-3xl">
          Senior-level product leadership and rigorous technology diligence to help software companies and investors make confident decisions.
        </p>

        <Section
          title="Fractional Product Leadership"
          subtitle="Executive expertise, without full-time overhead."
          bullets={[
            "Strategy Alignment — connect vision to financial and customer outcomes.",
            "Roadmapping & Prioritization — disciplined backlog and board-aligned planning.",
            "Team Mentorship — develop PM capability and repeatable frameworks.",
            "Interim Leadership — stability during transitions, integrations, or scale."
          ]}
          outcome="Delivered a 12‑month roadmap for a $40M SaaS firm, aligning executive team and investors around growth priorities."
        />

        <Section
          title="Technical Due Diligence"
          subtitle="Clear, actionable insights for investors and acquirers."
          bullets={[
            "Architecture & Codebase Review — scalability, maintainability, and technical debt.",
            "Team & Process Assessment — engineering maturity, QA, DevOps, leadership depth.",
            "Risk Identification — EOL frameworks, under-resourcing, cost escalations.",
            "Executive Readout — concise findings, risk ratings, negotiation-ready recommendations."
          ]}
          outcome="Flagged AngularJS EOL risk during diligence; enabled valuation adjustment and remediation plan."
        />

        <Section
          title="Product Operations & GTM Systems"
          subtitle="Scalable frameworks for consistent execution."
          bullets={[
            "Portfolio & Roadmap Governance — planning cadence and board reporting.",
            "GTM Alignment — product, sales, and marketing in sync with launch frameworks.",
            "Metrics & Reporting — KPIs for adoption, predictability, and delivery health.",
            "Tooling & Enablement — practical setup across Jira, Confluence, and dashboards."
          ]}
          outcome="Reduced missed commitments by 40% by implementing lean portfolio management and consistent reporting."
        />

        <div className="mt-12 border-t border-gray-100 pt-8">
          <h2 className="text-2xl font-semibold">Engagement Models</h2>
          <ul className="list-disc ml-6 text-gray-700 mt-3 space-y-2">
            <li><strong>Fractional Leadership</strong> — part-time executive engagement, typically 6–12 months.</li>
            <li><strong>Project-Based</strong> — focused diligence or framework implementation (2–6 weeks).</li>
            <li><strong>Advisory</strong> — ongoing counsel for CEOs, boards, and investors.</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

function Section({ title, subtitle, bullets, outcome }) {
  return (
    <section className="mt-10">
      <h2 className="text-xl font-semibold">{title}</h2>
      <p className="text-gray-700 mt-1">{subtitle}</p>
      <ul className="list-disc ml-6 text-gray-700 mt-3 space-y-2">
        {bullets.map((b, i) => <li key={i}>{b}</li>)}
      </ul>
      <div className="mt-3 text-sm text-gray-600"><span className="font-semibold">Outcome Example:</span> {outcome}</div>
    </section>
  )
}
