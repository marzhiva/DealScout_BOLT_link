'use client';

import { useMemo, useState } from 'react';
import { useAuth } from '@/components/auth-provider';
import { supabase } from '@/lib/supabase';
import {
  computeMetrics,
  expenseBreakdown,
  evaluateVerdict,
  formatCurrency,
  formatMultiple,
  formatPercent,
  SAMPLE_INPUTS,
  EMPTY_INPUTS,
  type DealInputs,
} from '@/lib/finance';
import { Slider } from '@/components/ui/slider';
import {
  Save, RotateCcw, CheckCircle2, XCircle,
  TrendingUp, Wallet, Percent, Scale, Banknote, DollarSign, PiggyBank
} from 'lucide-react';
import { toast } from 'sonner';
import { Toaster } from '@/components/ui/sonner';

const STORAGE_KEY = 'dealscout_session_deals';

export default function DashboardPage() {
  const { user, isGuest, loading } = useAuth();
  const [inputs, setInputs] = useState<DealInputs>(SAMPLE_INPUTS);
  const [minCapRate, setMinCapRate] = useState(6);
  const [minDscr, setMinDscr] = useState(1.25);
  const [label, setLabel] = useState('Untitled Deal');
  const [saving, setSaving] = useState(false);

  const metrics = useMemo(() => computeMetrics(inputs), [inputs]);
  const verdict = useMemo(() => evaluateVerdict(metrics, minCapRate, minDscr), [metrics, minCapRate, minDscr]);
  const expenses = useMemo(() => expenseBreakdown(inputs), [inputs]);

  const update = (key: keyof DealInputs, value: number) =>
    setInputs((prev) => ({ ...prev, [key]: value }));

  const handleSave = async () => {
    setSaving(true);
    try {
      if (isGuest) {
        const existing = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
        existing.push({ id: crypto.randomUUID(), label, inputs, metrics, verdict: verdict.message, created_at: new Date().toISOString() });
        localStorage.setItem(STORAGE_KEY, JSON.stringify(existing));
        toast.success('Deal saved to this browser (guest mode).');
      } else {
        const { error } = await supabase.from('deals').insert({ label, inputs, metrics, verdict: verdict.message });
        if (error) throw error;
        toast.success('Deal saved to your account.');
      }
    } catch (e) {
      toast.error('Save failed: ' + (e as Error).message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
      <Toaster richColors theme="dark" />
      <header className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-white">Underwriting Dashboard</h1>
        <p className="text-[#8BA3C2] text-sm mt-1">
          {loading ? 'Loading session…' : isGuest ? 'Guest mode — deals save to this browser.' : `Signed in as ${user?.email}`}
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* LEFT: inputs */}
        <div className="space-y-5">
          {/* Deal label */}
          <Card>
            <Label>Deal label</Label>
            <input
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              className="ds-input mt-2"
              placeholder="e.g. 123 Main St Multifamily"
            />
          </Card>

          <InputGroup title="Acquisition">
            <Field label="Purchase Price" prefix="$" value={inputs.purchasePrice} onChange={(v) => update('purchasePrice', v)} />
            <Field label="Down Payment" suffix="%" value={inputs.downPaymentPct} onChange={(v) => update('downPaymentPct', v)} />
            <Field label="Interest Rate" suffix="%" value={inputs.loanInterestRate} onChange={(v) => update('loanInterestRate', v)} />
            <Field label="Loan Term" suffix="yrs" value={inputs.loanTermYears} onChange={(v) => update('loanTermYears', v)} />
          </InputGroup>

          <InputGroup title="Income">
            <Field label="Scheduled Rent / mo" prefix="$" value={inputs.monthlyRent} onChange={(v) => update('monthlyRent', v)} />
            <Field label="Other Income / mo" prefix="$" value={inputs.otherMonthlyIncome} onChange={(v) => update('otherMonthlyIncome', v)} />
          </InputGroup>

          <InputGroup title="Expenses">
            <Field label="Property Taxes / mo" prefix="$" value={inputs.propertyTaxes} onChange={(v) => update('propertyTaxes', v)} />
            <Field label="Insurance / mo" prefix="$" value={inputs.insurance} onChange={(v) => update('insurance', v)} />
            <Field label="Maintenance / mo" prefix="$" value={inputs.maintenance} onChange={(v) => update('maintenance', v)} />
            <Field label="Utilities / mo" prefix="$" value={inputs.utilities} onChange={(v) => update('utilities', v)} />
            <Field label="Management Fee" suffix="%" value={inputs.managementPct} onChange={(v) => update('managementPct', v)} />
          </InputGroup>

          {/* Action buttons */}
          <div className="flex flex-wrap gap-3">
            <button
              onClick={handleSave}
              disabled={saving}
              className="inline-flex items-center gap-2 rounded-xl bg-emerald text-[#0A192F] font-semibold text-sm px-4 py-2.5 hover:bg-emerald/90 transition-colors disabled:opacity-60"
            >
              <Save className="h-4 w-4" /> {saving ? 'Saving…' : 'Save Deal'}
            </button>
            <button
              onClick={() => setInputs(SAMPLE_INPUTS)}
              className="inline-flex items-center gap-2 rounded-xl border border-[#1E3A5F] text-white text-sm px-4 py-2.5 hover:bg-white/5 transition-colors"
            >
              <RotateCcw className="h-4 w-4" /> Reset Sample
            </button>
            <button
              onClick={() => setInputs(EMPTY_INPUTS)}
              className="inline-flex items-center gap-2 rounded-xl text-[#8BA3C2] text-sm px-4 py-2.5 hover:bg-white/5 transition-colors"
            >
              Clear all
            </button>
          </div>
        </div>

        {/* RIGHT: outputs */}
        <div className="space-y-5">
          {/* Verdict banner */}
          <div className={`rounded-2xl border-l-4 border border-[#1E3A5F] bg-[#112240] p-4 ${verdict.passed ? 'border-l-emerald' : 'border-l-[#EF4444]'}`}>
            <div className="flex items-start gap-3">
              {verdict.passed
                ? <CheckCircle2 className="h-5 w-5 text-emerald mt-0.5 shrink-0" />
                : <XCircle className="h-5 w-5 text-[#EF4444] mt-0.5 shrink-0" />}
              <div>
                <p className={`font-semibold text-sm ${verdict.passed ? 'text-emerald' : 'text-[#EF4444]'}`}>
                  {verdict.passed ? '🎯 Target Met: Property passes underwriting criteria.' : 'Target Missed'}
                </p>
                {!verdict.passed && (
                  <ul className="mt-1 text-xs text-[#8BA3C2] list-disc list-inside">
                    {verdict.failedMetrics.map((m) => <li key={m} className="num">{m}</li>)}
                  </ul>
                )}
              </div>
            </div>
          </div>

          {/* KPI grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            <Kpi icon={DollarSign} label="NOI" value={formatCurrency(metrics.noi)} positive={metrics.noi > 0} />
            <Kpi icon={Percent} label="Cap Rate" value={formatPercent(metrics.capRate)} />
            <Kpi icon={Scale} label="DSCR" value={formatMultiple(metrics.dscr)} positive={metrics.dscr >= 1.25} negative={metrics.dscr < 1} />
            <Kpi icon={TrendingUp} label="Cash-on-Cash" value={formatPercent(metrics.cashOnCash)} positive={metrics.cashOnCash > 0} negative={metrics.cashOnCash < 0} />
            <Kpi icon={Banknote} label="Debt Service / yr" value={formatCurrency(metrics.annualDebtService)} />
            <Kpi icon={PiggyBank} label="Cash Flow / yr" value={formatCurrency(metrics.annualCashFlow)} positive={metrics.annualCashFlow > 0} negative={metrics.annualCashFlow < 0} />
          </div>

          {/* Sliders */}
          <Card>
            <p className="text-sm font-semibold text-white mb-5">Underwriting Targets</p>
            <div className="space-y-5">
              <div>
                <div className="flex justify-between text-xs text-[#8BA3C2] mb-2.5">
                  <span>Min Cap Rate</span>
                  <span className="num text-[#F59E0B] font-semibold">{minCapRate.toFixed(2)}%</span>
                </div>
                <Slider
                  className="ds-slider"
                  min={3} max={12} step={0.05}
                  value={[minCapRate]}
                  onValueChange={([v]) => setMinCapRate(v)}
                />
              </div>
              <div>
                <div className="flex justify-between text-xs text-[#8BA3C2] mb-2.5">
                  <span>Min DSCR</span>
                  <span className="num text-[#F59E0B] font-semibold">{minDscr.toFixed(2)}x</span>
                </div>
                <Slider
                  className="ds-slider"
                  min={1} max={2} step={0.05}
                  value={[minDscr]}
                  onValueChange={([v]) => setMinDscr(v)}
                />
              </div>
            </div>
          </Card>

          {/* Expense donut */}
          <Card>
            <p className="text-sm font-semibold text-white mb-4">Expense Breakdown</p>
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <DonutChart items={expenses} />
              <div className="flex-1 w-full space-y-2.5">
                {expenses.map((e) => (
                  <div key={e.label} className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-2 text-[#8BA3C2]">
                      <span className="h-2 w-2 rounded-full shrink-0" style={{ background: e.color }} />
                      {e.label}
                    </span>
                    <span className="num text-white text-xs">{formatCurrency(e.value)}</span>
                  </div>
                ))}
              </div>
            </div>
          </Card>

          {/* Stacked bar */}
          <Card>
            <p className="text-sm font-semibold text-white mb-4">Income vs Expenses</p>
            <StackedBar income={metrics.grossIncome} expenses={metrics.opex} />
            <div className="flex justify-between mt-3 text-xs">
              <span className="num text-emerald">{formatCurrency(metrics.grossIncome)} income</span>
              <span className="num text-[#EF4444]">{formatCurrency(metrics.opex)} expenses</span>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-[#1E3A5F] bg-[#112240] p-5">
      {children}
    </div>
  );
}

function InputGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Card>
      <p className="text-xs font-semibold uppercase tracking-widest text-[#4A6A8A] mb-4">{title}</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">{children}</div>
    </Card>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return <p className="text-xs text-[#8BA3C2]">{children}</p>;
}

function Field({ label, value, onChange, prefix, suffix }: {
  label: string; value: number; onChange: (v: number) => void; prefix?: string; suffix?: string;
}) {
  return (
    <div>
      <Label>{label}</Label>
      <div className="relative mt-1.5">
        {prefix && <span className="absolute left-3 top-1/2 -translate-y-1/2 num text-[#4A6A8A] text-sm">{prefix}</span>}
        <input
          type="number"
          inputMode="decimal"
          value={Number.isFinite(value) ? value : 0}
          onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
          className={`ds-input num ${prefix ? 'pl-7' : ''} ${suffix ? 'pr-10' : ''}`}
        />
        {suffix && <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[#4A6A8A] text-sm">{suffix}</span>}
      </div>
    </div>
  );
}

function Kpi({ icon: Icon, label, value, positive, negative }: {
  icon: React.ComponentType<{ className?: string }>; label: string; value: string; positive?: boolean; negative?: boolean;
}) {
  const valueColor = positive ? 'text-emerald' : negative ? 'text-[#EF4444]' : 'text-white';
  return (
    <div className="rounded-xl border border-[#1E3A5F] bg-[#0A192F] px-4 py-3">
      <div className="flex items-center gap-1.5 text-[9px] font-semibold uppercase tracking-widest text-[#4A6A8A] mb-2">
        <Icon className="h-3 w-3" /> {label}
      </div>
      <div className={`num text-xl font-bold ${valueColor}`}>{value}</div>
    </div>
  );
}

function DonutChart({ items }: { items: { label: string; value: number; color: string }[] }) {
  const total = items.reduce((s, i) => s + i.value, 0);
  let acc = 0;
  const stops = items.map((i) => {
    const start = (acc / (total || 1)) * 360;
    acc += i.value;
    const end = (acc / (total || 1)) * 360;
    return `${i.color} ${start}deg ${end}deg`;
  }).join(', ');

  return (
    <div className="h-36 w-36 rounded-full shrink-0 relative" style={{ background: `conic-gradient(${stops || '#1E3A5F 0deg 360deg'})` }}>
      <div className="absolute inset-0 rounded-full flex items-center justify-center" style={{ background: 'radial-gradient(circle, #112240 56%, transparent 58%)' }}>
        <div className="text-center">
          <div className="text-[9px] uppercase tracking-wider text-[#4A6A8A]">Total</div>
          <div className="num text-sm font-bold text-white">{formatCurrency(total)}</div>
        </div>
      </div>
    </div>
  );
}

function StackedBar({ income, expenses }: { income: number; expenses: number }) {
  const total = income + expenses;
  const incomePct = total > 0 ? (income / total) * 100 : 50;
  return (
    <div className="h-5 w-full rounded-full overflow-hidden flex border border-[#1E3A5F]">
      <div className="h-full bg-emerald transition-all duration-300" style={{ width: `${incomePct}%` }} />
      <div className="h-full bg-[#EF4444] flex-1 transition-all duration-300" />
    </div>
  );
}
