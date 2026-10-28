import React from 'react'

/**
 * Two-door landing. The app's primary entry point: the user picks one of two
 * outcomes rather than being dropped into a config form. Secondary destinations
 * (Review, Coverage, Explore) stay one click away for returning/power users.
 *
 * This does not change any underlying flow — each door routes into the existing
 * tabs. Door 2 (semantic layer) runs the fixed sequence core metadata → full
 * analytics pipeline → metric views; that ordering is enforced inside its flow.
 */

function DoorCard({ accent, eyebrow, title, description, bullets, cta, onClick }) {
  return (
    <button
      onClick={onClick}
      className="card p-6 flex flex-col h-full text-left group hover:shadow-elevated transition-all duration-200 border-t-2 border-t-transparent hover:-translate-y-0.5"
      style={{ borderTopColor: accent }}
    >
      <span className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: accent }}>{eyebrow}</span>
      <h3 className="text-lg font-bold text-slate-800 dark:text-white mt-1.5 mb-2">{title}</h3>
      <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">{description}</p>
      <ul className="mt-3 space-y-1.5 flex-1">
        {bullets.map((b, i) => (
          <li key={i} className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-300">
            <svg className="w-4 h-4 mt-0.5 shrink-0" style={{ color: accent }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span>{b}</span>
          </li>
        ))}
      </ul>
      <span
        className="mt-5 inline-flex items-center gap-1.5 self-start px-4 py-2 rounded-lg text-sm font-semibold text-white transition-transform group-hover:gap-2.5"
        style={{ backgroundColor: accent }}
      >
        {cta}
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
        </svg>
      </span>
    </button>
  )
}

const SECONDARY = [
  { id: 'metadata', label: 'Review & apply', desc: 'Edit and apply generated metadata' },
  { id: 'agent', label: 'Explore / Agent', desc: 'Ask questions, browse the graph' },
  { id: 'genie', label: 'Build Genie space', desc: 'Natural-language SQL over your data' },
]

export default function Home({ onNavigate }) {
  return (
    <div className="max-w-6xl mx-auto py-6">
      <div className="rounded-2xl bg-gradient-to-br from-dbx-navy via-dbx-navy-700 to-dbx-navy-600 px-6 py-8 md:px-10 md:py-10 text-white shadow-elevated mb-8 overflow-hidden relative">
        <div className="absolute -right-16 -top-20 h-56 w-56 rounded-full border-[24px] border-dbx-amber/20" />
        <div className="absolute right-16 -bottom-24 h-44 w-44 rounded-full border-[18px] border-dbx-teal/20" />
        <div className="relative max-w-3xl">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-dbx-amber-light mb-3">
            <span className="h-2 w-2 rounded-full bg-dbx-amber" />
            Discount Tire data intelligence
          </div>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Turn SBS data assets into retail intelligence.</h2>
          <p className="text-sm md:text-base text-dbx-oat/80 mt-3 leading-relaxed max-w-2xl">
            dbxmetagen is the metadata and semantic foundation for Discount Tire's retail data — making store, product, inventory, customer, and service data easier to trust, discover, and use.
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-2 text-xs text-dbx-oat/80">
            <span className="rounded-full bg-white/10 border border-white/15 px-3 py-1.5">SBS Data Platform</span>
            <span className="text-dbx-amber">→</span>
            <span className="rounded-full bg-white/10 border border-white/15 px-3 py-1.5">Governed metadata</span>
            <span className="text-dbx-amber">→</span>
            <span className="rounded-full bg-white/10 border border-white/15 px-3 py-1.5">AI-ready retail analytics</span>
          </div>
        </div>
      </div>

      <div className="mb-7">
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Choose a data outcome</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1.5">
          Start with SBS source assets and build trusted context for every retail decision.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <DoorCard
          accent="#D97706"
          eyebrow="Foundation layer"
          title="Document SBS source assets"
          description="Create trusted business context for Discount Tire's retail tables before they power reporting, AI, or downstream products."
          bullets={[
            'Store, product, inventory & service definitions',
            'PII / PCI sensitivity labels for customer data',
            'Retail business domain and ownership tags',
            'Review before anything touches the catalog',
          ]}
          cta="Generate source metadata"
          onClick={() => onNavigate('jobs')}
        />
        <DoorCard
          accent="#0E7490"
          eyebrow="Decision layer"
          title="Build retail semantic intelligence"
          description="Turn governed SBS metadata into a connected semantic layer for merchandising, inventory, store operations, and customer experience."
          bullets={[
            'Metric views for sales, inventory & service KPIs',
            'Vector index for natural-language discovery',
            'Knowledge graph across retail entities',
            'Metadata remains the governed foundation',
          ]}
          cta="Build retail semantic layer"
          onClick={() => onNavigate('semantic')}
        />
      </div>

      <div className="mt-8 border-t border-slate-200 dark:border-dbx-navy-400/30 pt-5">
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-3">
          Continue exploring the SBS data platform
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          {SECONDARY.map(s => (
            <button
              key={s.id}
              onClick={() => onNavigate(s.id)}
              className="flex items-center gap-2 min-w-0 px-3.5 py-2 rounded-lg border border-slate-200 dark:border-dbx-navy-400/30 text-sm text-slate-600 dark:text-slate-300 hover:border-dbx-lava/40 hover:text-dbx-lava dark:hover:text-dbx-lava transition-colors"
              title={s.desc}
            >
              <span className="font-medium whitespace-nowrap">{s.label}</span>
              <span className="text-xs text-slate-400 dark:text-slate-500 hidden lg:inline truncate">· {s.desc}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
