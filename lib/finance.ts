export interface DealInputs {
  purchasePrice: number;
  downPaymentPct: number;
  loanInterestRate: number;
  loanTermYears: number;
  monthlyRent: number;
  otherMonthlyIncome: number;
  propertyTaxes: number;
  insurance: number;
  maintenance: number;
  utilities: number;
  managementPct: number;
}

export interface DealMetrics {
  grossIncome: number;
  opex: number;
  noi: number;
  capRate: number;
  loanAmount: number;
  monthlyPayment: number;
  annualDebtService: number;
  dscr: number;
  annualCashFlow: number;
  cashOnCash: number;
  downPayment: number;
  expenseRatio: number;
}

export interface ExpenseBreakdown {
  label: string;
  value: number;
  color: string;
}

export const SAMPLE_INPUTS: DealInputs = {
  purchasePrice: 1450000,
  downPaymentPct: 25,
  loanInterestRate: 6.75,
  loanTermYears: 30,
  monthlyRent: 14250,
  otherMonthlyIncome: 1100,
  propertyTaxes: 2200,
  insurance: 425,
  maintenance: 950,
  utilities: 600,
  managementPct: 8,
};

export const EMPTY_INPUTS: DealInputs = {
  purchasePrice: 0,
  downPaymentPct: 0,
  loanInterestRate: 0,
  loanTermYears: 0,
  monthlyRent: 0,
  otherMonthlyIncome: 0,
  propertyTaxes: 0,
  insurance: 0,
  maintenance: 0,
  utilities: 0,
  managementPct: 0,
};

export function computeMetrics(inputs: DealInputs): DealMetrics {
  const grossIncome =
    (inputs.monthlyRent + inputs.otherMonthlyIncome) * 12;

  const managementFee = grossIncome * (inputs.managementPct / 100);
  const opex =
    inputs.propertyTaxes +
    inputs.insurance +
    inputs.maintenance +
    inputs.utilities +
    managementFee;

  const noi = grossIncome - opex;
  const capRate =
    inputs.purchasePrice > 0 ? (noi / inputs.purchasePrice) * 100 : 0;

  const loanAmount = inputs.purchasePrice * (1 - inputs.downPaymentPct / 100);
  const downPayment = inputs.purchasePrice * (inputs.downPaymentPct / 100);

  const r = inputs.loanInterestRate / 100 / 12;
  const n = inputs.loanTermYears * 12;
  let monthlyPayment = 0;
  if (r > 0 && n > 0) {
    monthlyPayment =
      (loanAmount * (r * Math.pow(1 + r, n))) / (Math.pow(1 + r, n) - 1);
  } else if (n > 0) {
    monthlyPayment = loanAmount / n;
  }
  const annualDebtService = monthlyPayment * 12;

  const dscr = annualDebtService > 0 ? noi / annualDebtService : 0;
  const annualCashFlow = noi - annualDebtService;
  const cashOnCash =
    downPayment > 0 ? (annualCashFlow / downPayment) * 100 : 0;
  const expenseRatio = grossIncome > 0 ? (opex / grossIncome) * 100 : 0;

  return {
    grossIncome,
    opex,
    noi,
    capRate,
    loanAmount,
    monthlyPayment,
    annualDebtService,
    dscr,
    annualCashFlow,
    cashOnCash,
    downPayment,
    expenseRatio,
  };
}

export function expenseBreakdown(inputs: DealInputs): ExpenseBreakdown[] {
  const grossIncome =
    (inputs.monthlyRent + inputs.otherMonthlyIncome) * 12;
  const managementFee = grossIncome * (inputs.managementPct / 100);
  return [
    { label: 'Property Taxes', value: inputs.propertyTaxes * 12, color: '#10B981' },
    { label: 'Insurance', value: inputs.insurance * 12, color: '#3B82F6' },
    { label: 'Maintenance', value: inputs.maintenance * 12, color: '#F59E0B' },
    { label: 'Utilities', value: inputs.utilities * 12, color: '#8B5CF6' },
    { label: 'Management', value: managementFee, color: '#EF4444' },
  ];
}

export interface VerdictResult {
  passed: boolean;
  failedMetrics: string[];
  message: string;
}

export function evaluateVerdict(
  metrics: DealMetrics,
  minCapRate: number,
  minDscr: number
): VerdictResult {
  const failed: string[] = [];
  if (metrics.capRate < minCapRate) {
    failed.push(`Cap Rate ${metrics.capRate.toFixed(2)}% < ${minCapRate.toFixed(2)}%`);
  }
  if (metrics.dscr < minDscr) {
    failed.push(`DSCR ${metrics.dscr.toFixed(2)}x < ${minDscr.toFixed(2)}x`);
  }
  if (failed.length === 0) {
    return {
      passed: true,
      failedMetrics: [],
      message: 'Target Met: Property passes underwriting criteria.',
    };
  }
  return {
    passed: false,
    failedMetrics: failed,
    message: `Target Missed: ${failed.join('; ')}.`,
  };
}

export function formatCurrency(n: number): string {
  if (!isFinite(n)) return '$0';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(n);
}

export function formatPercent(n: number, digits = 2): string {
  if (!isFinite(n)) return '0%';
  return `${n.toFixed(digits)}%`;
}

export function formatMultiple(n: number): string {
  if (!isFinite(n)) return '0.00x';
  return `${n.toFixed(2)}x`;
}
