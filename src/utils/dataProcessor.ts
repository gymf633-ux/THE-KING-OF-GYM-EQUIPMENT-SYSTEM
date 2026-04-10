import {
  TradeRecord,
  KPISummary,
  MonthlyPoint,
  YearlyPoint,
  ProductPoint,
  ExporterPoint,
  PortPoint,
  RatePoint,
} from '../types/tradeData';

export function computeKPIs(records: TradeRecord[]): KPISummary {
  if (records.length === 0) {
    return { totalRecords: 0, totalQuantityKg: 0, totalValue: 0, avgRatePerKg: 0, uniqueExporters: 0 };
  }
  const totalQuantityKg = records.reduce((s, r) => s + r.quantity_kg, 0);
  const totalValue = records.reduce((s, r) => s + r.total_value, 0);
  const uniqueExporters = new Set(records.map((r) => r.exporter)).size;
  const avgRatePerKg = totalQuantityKg > 0 ? totalValue / totalQuantityKg : 0;
  return {
    totalRecords: records.length,
    totalQuantityKg,
    totalValue,
    avgRatePerKg,
    uniqueExporters,
  };
}

// Sort month strings like "Jan 2024" chronologically
function monthSortKey(m: string): number {
  const parts = m.split(' ');
  const monthNames = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const mIdx = monthNames.indexOf(parts[0]);
  const y = parseInt(parts[1] ?? '0');
  return y * 12 + (mIdx >= 0 ? mIdx : 0);
}

export function groupByMonth(records: TradeRecord[]): MonthlyPoint[] {
  const map: Record<string, { qty: number; value: number }> = {};
  records.forEach((r) => {
    const key = r.month || 'Unknown';
    if (!map[key]) map[key] = { qty: 0, value: 0 };
    map[key].qty += r.quantity_kg;
    map[key].value += r.total_value;
  });
  return Object.entries(map)
    .map(([month, d]) => ({ month, qty: Math.round(d.qty), value: Math.round(d.value) }))
    .sort((a, b) => monthSortKey(a.month) - monthSortKey(b.month));
}

export function groupByYear(records: TradeRecord[]): YearlyPoint[] {
  const map: Record<number, { qty: number; value: number }> = {};
  records.forEach((r) => {
    if (!map[r.year]) map[r.year] = { qty: 0, value: 0 };
    map[r.year].qty += r.quantity_kg;
    map[r.year].value += r.total_value;
  });
  return Object.entries(map)
    .map(([year, d]) => ({ year, qty: Math.round(d.qty), value: Math.round(d.value) }))
    .sort((a, b) => parseInt(a.year) - parseInt(b.year));
}

export function groupByProduct(records: TradeRecord[]): ProductPoint[] {
  const map: Record<string, { qty: number; value: number }> = {};
  records.forEach((r) => {
    const key = r.product || 'Unknown';
    if (!map[key]) map[key] = { qty: 0, value: 0 };
    map[key].qty += r.quantity_kg;
    map[key].value += r.total_value;
  });
  return Object.entries(map)
    .map(([product, d]) => ({ product, qty: Math.round(d.qty), value: Math.round(d.value) }))
    .sort((a, b) => b.value - a.value);
}

export function groupByExporter(records: TradeRecord[], top = 10): ExporterPoint[] {
  const map: Record<string, { value: number; qty: number }> = {};
  records.forEach((r) => {
    const key = r.exporter || 'Unknown';
    if (!map[key]) map[key] = { value: 0, qty: 0 };
    map[key].value += r.total_value;
    map[key].qty += r.quantity_kg;
  });
  return Object.entries(map)
    .map(([exporter, d]) => ({ exporter, value: Math.round(d.value), qty: Math.round(d.qty) }))
    .sort((a, b) => b.value - a.value)
    .slice(0, top);
}

export function groupByPort(records: TradeRecord[], top = 10): PortPoint[] {
  const map: Record<string, number> = {};
  records.forEach((r) => {
    const key = r.port || 'Unknown';
    map[key] = (map[key] ?? 0) + r.quantity_kg;
  });
  return Object.entries(map)
    .map(([port, qty]) => ({ port, qty: Math.round(qty) }))
    .sort((a, b) => b.qty - a.qty)
    .slice(0, top);
}

export function avgRateByMonth(records: TradeRecord[]): RatePoint[] {
  const map: Record<string, { totalValue: number; totalQty: number }> = {};
  records.forEach((r) => {
    const key = r.month || 'Unknown';
    if (!map[key]) map[key] = { totalValue: 0, totalQty: 0 };
    map[key].totalValue += r.total_value;
    map[key].totalQty += r.quantity_kg;
  });
  return Object.entries(map)
    .map(([month, d]) => ({
      month,
      avgRate: d.totalQty > 0 ? parseFloat((d.totalValue / d.totalQty).toFixed(2)) : 0,
    }))
    .sort((a, b) => monthSortKey(a.month) - monthSortKey(b.month));
}

export function filterRecords(
  records: TradeRecord[],
  year: string | null,
  product: string | null
): TradeRecord[] {
  return records.filter((r) => {
    if (year && String(r.year) !== year) return false;
    if (product && r.product !== product) return false;
    return true;
  });
}

export function getUniqueYears(records: TradeRecord[]): string[] {
  return [...new Set(records.map((r) => String(r.year)))].sort();
}

export function getUniqueProducts(records: TradeRecord[]): string[] {
  return [...new Set(records.map((r) => r.product))].sort();
}

export function formatNumber(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(2)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return n.toFixed(2);
}

export function formatCurrency(n: number): string {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(2)}M`;
  if (n >= 1_000) return `$${(n / 1_000).toFixed(1)}K`;
  return `$${n.toFixed(2)}`;
}
