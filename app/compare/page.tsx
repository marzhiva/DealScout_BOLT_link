'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/components/auth-provider';
import { supabase } from '@/lib/supabase';
import {
  formatCurrency, formatMultiple, formatPercent,
  type DealInputs, type DealMetrics
} from '@/lib/finance';
import { Checkbox } from '@/components/ui/checkbox';
import { Trash2, GitCompareArrows } from 'lucide-react';
import { toast } from 'sonner';
import { Toaster } from '@/components/ui/sonner';

const STORAGE_KEY = 'dealscout_session_deals';

interface StoredDeal {
  id: string;
  label: string;
  inputs: DealInputs;
  metrics: DealMetrics;
  verdict: string;
  created_at: string;
}

export default function ComparePage() {
  const { isGuest, loading } = useAuth();
  const [deals, setDeals] = useState<StoredDeal[]>([]);
  const [selected, setSelected] = useState<string[]>([]);
  const [busy, setBusy] = useState(false);

  useEffect(() => { void load(); }, [isGuest, loading]);

  async function load() {
    if (loading) return;
    if (isGuest) {
      setDeals(JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'));
    } else {
      const { data, error } = await supabase
        .from('deals')
        .select('id, label, inputs, metrics, verdict, created_at')
        .order('created_at', { ascending: false });
      if (error) { toast.error('Failed to load deals: ' + error.message); return; }
      setDeals((data as StoredDeal[]) || []);
    }
  }

  const toggle = (id: string) =>
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : prev.length >= 2 ? [prev[1], id] : [...prev, id]
    );

  const handleDelete = async (id: string) => {
    setBusy(true);
    try {
      if (isGuest) {
        const remaining = deals.filter((d) => d.id !== id);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(remaining));
        setDeals(remaining);
      } else {
        const { error } = await supabase.from('deals').delete().eq('id', id);
        if (error) throw error;
        setDeals((prev) => prev.filter((d) => d.id !== id));
      }
      setSelected((prev) => prev.filter((x) => x !== id));
      toast.success('Deal deleted.');
    } catch (e) {
      toast.error('Delete failed: ' + (e as Error).message);
    } finally {
      setBusy(false);
    }
  };

  const pair = selected.map((id) => deals.find((d) => d.id === id)).filter(Boolean) as StoredDeal[];

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-8 py-8">
      <Toaster richColors theme="dark" />
      <header className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-white">Saved Deals</h1>
        <p className="text-[#8BA3C2] text-sm mt-1">
          {loading ? 'Loading…' : isGuest ? 'Guest mode — saved in this browser.' : 'Saved to your account.'}
          {' '}Select two deals to compare.
        </p>
      </header>

      {deals.length === 0 ? (
        <div className="rounded-2xl border border-[#1E3A5F] bg-[#112240] p-12 text-center">
          <GitCompareArrows className="h-10 w-10 text-[#4A6A8A] mx-auto mb-3" />
          <p className="text-[#8BA3C2] text-sm">No saved deals yet. Underwrite and save a deal first.</p>
        </div>
      ) : (
        <div className="rounded-2xl border border-[#1E3A5F] bg-[#112240] overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#1E3A5F]">
                <th className="text-left p-3 w-10 text-[10px] uppercase tracking-widest text-[#4A6A8A]">Pick</th>
                <th className="text-left p-3 text-[10px] uppercase tracking-widest text-[#4A6A8A]">Label</th>
                <th className="text-right p-3 text-[10px] uppercase tracking-widest text-[#4A6A8A]">Cap Rate</th>
                <th className="text-right p-3 text-[10px] uppercase tracking-widest text-[#4A6A8A]">DSCR</th>
                <th className="text-right p-3 text-[10px] uppercase tracking-widest text-[#4A6A8A]">Cash Flow</th>
                <th className="text-right p-3 text-[10px] uppercase tracking-widest text-[#4A6A8A]">CoC</th>
                <th className="text-right p-3 text-[10px] uppercase tracking-widest text-[#4A6A8A]">Verdict</th>
                <th className="p-3 w-10" />
              </tr>
            </thead>
            <tbody>
              {deals.map((d) => (
                <tr key={d.id} className="border-t border-[#1E3A5F] hover:bg-white/[0.02] transition-colors">
                  <td className="p-3">
                    <Checkbox
                      checked={selected.includes(d.id)}
                      onCheckedChange={() => toggle(d.id)}
                    />
                  </td>
                  <td className="p-3 text-white font-medium">{d.label}</td>
                  <td className="p-3 text-right num text-white">{formatPercent(d.metrics.capRate)}</td>
                  <td className="p-3 text-right num text-white">{formatMultiple(d.metrics.dscr)}</td>
                  <td className={`p-3 text-right num font-medium ${d.metrics.annualCashFlow >= 0 ? 'text-emerald' : 'text-[#EF4444]'}`}>
                    {formatCurrency(d.metrics.annualCashFlow)}
                  </td>
                  <td className={`p-3 text-right num ${d.metrics.cashOnCash >= 0 ? 'text-emerald' : 'text-[#EF4444]'}`}>
                    {formatPercent(d.metrics.cashOnCash)}
                  </td>
                  <td className="p-3 text-right">
                    <span className={`text-xs font-semibold ${d.verdict.startsWith('Target Met') ? 'text-emerald' : 'text-[#EF4444]'}`}>
                      {d.verdict.startsWith('Target Met') ? 'Pass' : 'Fail'}
                    </span>
                  </td>
                  <td className="p-3">
                    <button
                      disabled={busy}
                      onClick={() => handleDelete(d.id)}
                      className="h-8 w-8 flex items-center justify-center rounded-lg text-[#EF4444] hover:bg-[#EF4444]/10 transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {pair.length === 2 && <ComparisonGrid a={pair[0]} b={pair[1]} />}
    </div>
  );
}

function ComparisonGrid({ a, b }: { a: StoredDeal; b: StoredDeal }) {
  const rows: { label: string; aVal: string; bVal: string }[] = [
    { label: 'Purchase Price', aVal: formatCurrency(a.inputs.purchasePrice), bVal: formatCurrency(b.inputs.purchasePrice) },
    { label: 'NOI', aVal: formatCurrency(a.metrics.noi), bVal: formatCurrency(b.metrics.noi) },
    { label: 'Cap Rate', aVal: formatPercent(a.metrics.capRate), bVal: formatPercent(b.metrics.capRate) },
    { label: 'DSCR', aVal: formatMultiple(a.metrics.dscr), bVal: formatMultiple(b.metrics.dscr) },
    { label: 'Annual Debt Service', aVal: formatCurrency(a.metrics.annualDebtService), bVal: formatCurrency(b.metrics.annualDebtService) },
    { label: 'Annual Cash Flow', aVal: formatCurrency(a.metrics.annualCashFlow), bVal: formatCurrency(b.metrics.annualCashFlow) },
    { label: 'Cash-on-Cash', aVal: formatPercent(a.metrics.cashOnCash), bVal: formatPercent(b.metrics.cashOnCash) },
    { label: 'Expense Ratio', aVal: formatPercent(a.metrics.expenseRatio), bVal: formatPercent(b.metrics.expenseRatio) },
  ];

  return (
    <div className="mt-6 rounded-2xl border border-[#1E3A5F] bg-[#112240] p-5 animate-fade-in">
      <h2 className="text-lg font-bold text-white mb-5">Side-by-side comparison</h2>
      <div className="grid grid-cols-3 gap-x-6">
        <div className="text-[10px] font-semibold uppercase tracking-widest text-[#4A6A8A] pb-2 border-b border-[#1E3A5F]">Metric</div>
        <div className="text-[10px] font-semibold uppercase tracking-widest text-emerald pb-2 border-b border-[#1E3A5F] truncate">{a.label}</div>
        <div className="text-[10px] font-semibold uppercase tracking-widest text-[#F59E0B] pb-2 border-b border-[#1E3A5F] truncate">{b.label}</div>

        {rows.map((r) => (
          <>
            <div key={`l-${r.label}`} className="text-sm text-[#8BA3C2] py-2.5 border-b border-[#1E3A5F]/50">{r.label}</div>
            <div key={`a-${r.label}`} className="text-sm num text-white py-2.5 border-b border-[#1E3A5F]/50">{r.aVal}</div>
            <div key={`b-${r.label}`} className="text-sm num text-white py-2.5 border-b border-[#1E3A5F]/50">{r.bVal}</div>
          </>
        ))}

        <div className="text-[10px] font-semibold uppercase tracking-widest text-[#4A6A8A] pt-3">Verdict</div>
        <div className={`text-sm font-semibold pt-3 ${a.verdict.startsWith('Target Met') ? 'text-emerald' : 'text-[#EF4444]'}`}>
          {a.verdict.startsWith('Target Met') ? 'Pass' : 'Fail'}
        </div>
        <div className={`text-sm font-semibold pt-3 ${b.verdict.startsWith('Target Met') ? 'text-emerald' : 'text-[#EF4444]'}`}>
          {b.verdict.startsWith('Target Met') ? 'Pass' : 'Fail'}
        </div>
      </div>
    </div>
  );
}
