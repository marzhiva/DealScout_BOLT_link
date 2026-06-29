import { BookOpen } from 'lucide-react';

const TERMS = [
  {
    name: 'NOI',
    full: 'Net Operating Income',
    formula: 'NOI = Gross Income − Operating Expenses',
    body: 'The annual profit a property generates from operations, before debt service and taxes. It is the single most important number in CRE underwriting because every valuation multiple is applied to it.',
  },
  {
    name: 'Cap Rate',
    full: 'Capitalization Rate',
    formula: 'Cap Rate = (NOI ÷ Purchase Price) × 100',
    body: 'The unlevered yield an all-cash buyer would earn in year one. A higher cap rate means more income per dollar of price (or a riskier asset). It is the headline metric buyers and brokers negotiate around.',
  },
  {
    name: 'DSCR',
    full: 'Debt Service Coverage Ratio',
    formula: 'DSCR = NOI ÷ Annual Debt Service',
    body: 'How many times the NOI covers the mortgage payments. Lenders typically require a minimum of 1.25x. Below 1.0x the property loses money each month and the loan is at risk of default.',
  },
  {
    name: 'Cash-on-Cash',
    full: 'Cash-on-Cash Return',
    formula: 'Cash-on-Cash = (Annual Cash Flow ÷ Down Payment) × 100',
    body: 'The levered return on the actual cash invested (the down payment), not the full purchase price. This is the yield the equity investor cares about, since it accounts for financing.',
  },
  {
    name: 'OpEx',
    full: 'Operating Expenses',
    formula: 'OpEx = Taxes + Insurance + Maintenance + Utilities + Management Fee',
    body: 'The recurring costs required to run the property. It excludes debt service (a financing cost, not an operating cost) and capital expenditures. Management fee is a percentage of gross income.',
  },
  {
    name: 'Debt Service',
    full: 'Annual Debt Service',
    formula: 'Monthly Payment = P × [r(1+r)ⁿ] ÷ [(1+r)ⁿ − 1]',
    body: 'The total mortgage payments due in a year. The formula is the standard amortization equation, where P is loan principal, r is the monthly interest rate, and n is the number of monthly payments.',
  },
  {
    name: 'Expense Ratio',
    full: 'Operating Expense Ratio',
    formula: 'Expense Ratio = (OpEx ÷ Gross Income) × 100',
    body: 'The share of income consumed by operating costs. A lower ratio means a more efficiently run asset. Multifamily typically runs 35–50%; ratios above 60% warrant a closer look at the expense structure.',
  },
];

export default function GlossaryPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 md:px-8 py-8">
      <header className="mb-8">
        <div className="inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-widest text-emerald mb-2">
          <BookOpen className="h-3.5 w-3.5" /> Reference
        </div>
        <h1 className="text-2xl md:text-3xl font-bold text-white">Underwriting Glossary</h1>
        <p className="text-[#8BA3C2] text-sm mt-1 max-w-2xl">
          Every metric DealScout computes, defined in plain English with the exact formula behind it.
        </p>
      </header>

      <div className="space-y-4">
        {TERMS.map((t) => (
          <div key={t.name} className="rounded-2xl border border-[#1E3A5F] bg-[#112240] p-6">
            <div className="flex flex-wrap items-baseline gap-3 mb-3">
              <h2 className="text-lg font-bold text-white num">{t.name}</h2>
              <span className="text-sm text-[#4A6A8A]">{t.full}</span>
            </div>
            <div className="rounded-xl bg-[#0A192F] border border-[#1E3A5F] px-4 py-3 mb-3">
              <code className="num text-sm text-emerald">{t.formula}</code>
            </div>
            <p className="text-sm text-[#8BA3C2] leading-relaxed">{t.body}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
