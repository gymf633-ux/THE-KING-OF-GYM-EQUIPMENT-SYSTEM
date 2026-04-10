export interface TradeRecord {
  date: string;
  month: string;      // e.g. "Jan 2024"
  year: number;
  product: string;
  exporter: string;
  port: string;
  quantity_kg: number;
  rate_per_kg: number;
  total_value: number;
}

export interface KPISummary {
  totalRecords: number;
  totalQuantityKg: number;
  totalValue: number;
  avgRatePerKg: number;
  uniqueExporters: number;
}

export interface DashboardSession {
  id: string;
  uploadedAt: string;
  fileName: string;
  kpi: KPISummary;
  data: TradeRecord[];
}

export interface MonthlyPoint {
  month: string;
  qty: number;
  value: number;
}

export interface YearlyPoint {
  year: string;
  qty: number;
  value: number;
}

export interface ProductPoint {
  product: string;
  qty: number;
  value: number;
}

export interface ExporterPoint {
  exporter: string;
  value: number;
  qty: number;
}

export interface PortPoint {
  port: string;
  qty: number;
}

export interface RatePoint {
  month: string;
  avgRate: number;
}
