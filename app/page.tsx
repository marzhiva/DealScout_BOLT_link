import Link from 'next/link';
import { ArrowRight, BookOpen, CheckCircle } from 'lucide-react';
import { computeMetrics, SAMPLE_INPUTS, formatCurrency, formatPercent, formatMultiple } from '@/lib/finance';

export default function HomePage() {
  const m = computeMetrics(SAMPLE_INPUTS);

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="px-5 md:px-10 pt-12 md:pt-16 pb-12">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left copy */}
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald/40 bg-emerald/10 px-4 py-1.5 text-xs text-emerald font-medium mb-6 tracking-wide">
              CRE Underwriting · No Excel Required
            </div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white leading-tight">
              Deal verdict in<br />
              under <span className="text-emerald">60 seconds.</span>
            </h1>
            <p className="mt-5 text-[#8BA3C2] text-base leading-relaxed max-w-lg">
              DealScout gives acquisitions agents, brokers, and investors
              institutional-grade underwriting from any device. Type a number,
              see the verdict — no submit button, no agents, no spreadsheets.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 rounded-xl bg-emerald text-[#0A192F] font-semibold px-5 py-3 text-sm hover:bg-emerald/90 transition-colors"
              >
                Open Underwriting Workspace <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/glossary"
                className="inline-flex items-center gap-2 rounded-xl border border-[#1E3A5F] text-white px-5 py-3 text-sm hover:bg-white/5 transition-colors"
              >
                <BookOpen className="h-4 w-4" /> View Glossary
              </Link>
            </div>
          </div>

          {/* Right: live KPI card */}
          <div className="rounded-2xl border border-[#1E3A5F] bg-[#112240] p-5 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <span className="text-[10px] font-semibold uppercase tracking-widest text-[#8BA3C2]">
                SAMPLE DEAL · {formatCurrency(SAMPLE_INPUTS.purchasePrice)}
              </span>
              <span className="inline-flex items-center gap-1 text-[10px] font-medium text-emerald bg-emerald/10 border border-emerald/25 rounded-full px-2.5 py-1">
                <CheckCircle className="h-3 w-3" /> Target Met
              </span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <KpiMini label="NET OPERATING INCOME" value={formatCurrency(m.noi)} green />
              <KpiMini label="CAP RATE" value={formatPercent(m.capRate)} green />
              <KpiMini label="DSCR" value={formatMultiple(m.dscr)} green />
              <KpiMini label="CASH-ON-CASH" value={formatPercent(m.cashOnCash)} green />
              <KpiMini label="ANNUAL DEBT SERVICE" value={formatCurrency(m.annualDebtService)} />
              <KpiMini label="ANNUAL CASH FLOW" value={formatCurrency(m.annualCashFlow)} green />
            </div>
            <p className="mt-4 text-[11px] text-[#4A6A8A] text-center">
              25% down · 6.75% rate · 30 yr · $14,250/mo rent
            </p>
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="border-t border-[#1E3A5F] mx-5 md:mx-10" />

      {/* How it works */}
      <section className="px-5 md:px-10 py-14">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">How it works</h2>
          <p className="text-[#8BA3C2] mb-8 text-sm">Three steps from a new tab to a deal verdict.</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <StepCard
              step="01"
              title="Enter the numbers"
              body="Purchase price, financing terms, income, and expenses. DealScout organises every input into logical groups."
            />
            <StepCard
              step="02"
              title="Watch the math run"
              body="NOI, Cap Rate, DSCR, and Cash-on-Cash recalculate on every keystroke. No form submission, no lag."
            />
            <StepCard
              step="03"
              title="Get a verdict"
              body="Set your minimum Cap Rate and DSCR targets. The verdict banner turns green or red and tells you exactly which metric failed."
            />
          </div>
        </div>
      </section>

      {/* Why section */}
      <section className="px-5 md:px-10 pb-14">
        <div className="max-w-6xl mx-auto rounded-2xl border border-[#1E3A5F] bg-[#112240] p-8 md:p-10">
          <div className="grid md:grid-cols-2 gap-10 items-start">
            <div>
              <span className="text-[10px] uppercase tracking-widest text-amber font-semibold">Why DealScout</span>
              <h3 className="text-2xl font-bold text-white mt-2 mb-4">Excel templates break.<br />DealScout doesn&apos;t.</h3>
              <p className="text-[#8BA3C2] text-sm leading-relaxed">
                Broken cell references, hidden formula chains, and version drift across
                email threads — the traditional CRE underwriting workflow is fragile by design.
                DealScout encodes the standard model as transparent TypeScript. The math is
                right there in the glossary.
              </p>
            </div>
            <div className="space-y-3">
              {[
                'Reactive recalculation on every keystroke',
                'Targets for Cap Rate and DSCR with pass/fail verdicts',
                'Guest mode — no account required to start',
                'Save deals and compare any two side-by-side',
                'Full expense breakdown with native CSS donut chart',
                'Zero third-party charting libraries',
              ].map((f) => (
                <div key={f} className="flex items-center gap-3 text-sm text-[#8BA3C2]">
                  <CheckCircle className="h-4 w-4 text-emerald shrink-0" />
                  {f}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA bottom */}
      <section className="px-5 md:px-10 pb-16">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-5 rounded-2xl border border-emerald/20 bg-emerald/5 p-8">
          <div>
            <h3 className="text-xl font-bold text-white">Ready to run the numbers?</h3>
            <p className="text-[#8BA3C2] text-sm mt-1">No account needed. Works as a guest.</p>
          </div>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 rounded-xl bg-emerald text-[#0A192F] font-semibold px-5 py-3 text-sm hover:bg-emerald/90 transition-colors whitespace-nowrap"
          >
            Open Underwriting Workspace <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}

function KpiMini({ label, value, green }: { label: string; value: string; green?: boolean }) {
  return (
    <div className="rounded-xl border border-[#1E3A5F] bg-[#0A192F] px-4 py-3">
      <div className="text-[9px] font-semibold uppercase tracking-widest text-[#4A6A8A] mb-1.5">{label}</div>
      <div className={`num text-lg font-bold ${green ? 'text-emerald' : 'text-white'}`}>{value}</div>
    </div>
  );
}

function StepCard({ step, title, body }: { step: string; title: string; body: string }) {
  return (
    <div className="rounded-2xl border border-[#1E3A5F] bg-[#112240] p-6">
      <div className="num text-3xl font-bold text-[#1E3A5F] mb-3">{step}</div>
      <h3 className="font-semibold text-white mb-2">{title}</h3>
      <p className="text-sm text-[#8BA3C2] leading-relaxed">{body}</p>
    </div>
  );
}
