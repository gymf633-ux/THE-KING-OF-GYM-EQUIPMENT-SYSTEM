import * as XLSX from 'xlsx';
import { TradeRecord } from '../types/tradeData';

// Fuzzy column key mapper — maps various header names to canonical field names
const COLUMN_MAP: Record<string, keyof TradeRecord> = {
  // date
  date: 'date',
  'shipment date': 'date',
  'ship date': 'date',
  'invoice date': 'date',
  month: 'month',
  year: 'year',

  // product
  product: 'product',
  'product name': 'product',
  'product section': 'product',
  item: 'product',
  'item name': 'product',
  commodity: 'product',
  'commodity name': 'product',
  description: 'product',

  // exporter
  exporter: 'exporter',
  'exporter name': 'exporter',
  supplier: 'exporter',
  'supplier name': 'exporter',
  vendor: 'exporter',
  manufacturer: 'exporter',
  shipper: 'exporter',

  // port
  port: 'port',
  'port of origin': 'port',
  'origin port': 'port',
  'port of loading': 'port',
  'destination port': 'port',
  'port of discharge': 'port',
  'loading port': 'port',

  // quantity
  quantity: 'quantity_kg',
  qty: 'quantity_kg',
  kg: 'quantity_kg',
  weight: 'quantity_kg',
  'quantity kg': 'quantity_kg',
  'weight kg': 'quantity_kg',
  'net weight': 'quantity_kg',
  'gross weight': 'quantity_kg',
  'total quantity': 'quantity_kg',
  'total qty': 'quantity_kg',

  // rate
  rate: 'rate_per_kg',
  'rate per kg': 'rate_per_kg',
  'unit rate': 'rate_per_kg',
  'unit price': 'rate_per_kg',
  price: 'rate_per_kg',
  'price per kg': 'rate_per_kg',
  'rate/kg': 'rate_per_kg',

  // value
  value: 'total_value',
  total: 'total_value',
  amount: 'total_value',
  'total value': 'total_value',
  'total amount': 'total_value',
  'invoice value': 'total_value',
  'shipment value': 'total_value',
  'fob value': 'total_value',
};

function normalizeKey(header: string): keyof TradeRecord | null {
  const lower = header.trim().toLowerCase();
  return COLUMN_MAP[lower] ?? null;
}

function parseMonthYear(dateStr: string): { month: string; year: number } {
  // Try parsing as a date
  const date = new Date(dateStr);
  if (!isNaN(date.getTime())) {
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return {
      month: `${monthNames[date.getMonth()]} ${date.getFullYear()}`,
      year: date.getFullYear(),
    };
  }
  // Try "Mon YYYY" or "YYYY-MM" formats
  const ymMatch = dateStr.match(/(\d{4})[-/](\d{1,2})/);
  if (ymMatch) {
    const y = parseInt(ymMatch[1]);
    const m = parseInt(ymMatch[2]) - 1;
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return { month: `${monthNames[m]} ${y}`, year: y };
  }
  // Fallback: return as-is
  const year = parseInt(dateStr);
  if (!isNaN(year) && year > 1900 && year < 2100) {
    return { month: `Jan ${year}`, year };
  }
  return { month: dateStr, year: new Date().getFullYear() };
}

function toNumber(val: unknown): number {
  if (typeof val === 'number') return val;
  if (typeof val === 'string') {
    const cleaned = val.replace(/[,\s$₹€£]/g, '');
    const n = parseFloat(cleaned);
    return isNaN(n) ? 0 : n;
  }
  return 0;
}

export async function parseExcelFile(file: File): Promise<TradeRecord[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        const wb = XLSX.read(data, { type: 'binary', cellDates: true });
        const sheetName = wb.SheetNames[0];
        const ws = wb.Sheets[sheetName];
        const rows: Record<string, unknown>[] = XLSX.utils.sheet_to_json(ws, {
          defval: '',
          raw: false,
        });

        if (rows.length === 0) {
          reject(new Error('The spreadsheet appears to be empty.'));
          return;
        }

        // Build column mapping from actual headers
        const headerMap: Record<string, keyof TradeRecord> = {};
        Object.keys(rows[0]).forEach((header) => {
          const canonical = normalizeKey(header);
          if (canonical) headerMap[header] = canonical;
        });

        const records: TradeRecord[] = rows.map((row) => {
          const rec: Partial<TradeRecord> = {};
          Object.entries(row).forEach(([header, val]) => {
            const field = headerMap[header];
            if (!field) return;
            if (field === 'quantity_kg' || field === 'rate_per_kg' || field === 'total_value' || field === 'year') {
              (rec as Record<string, unknown>)[field] = toNumber(val);
            } else {
              (rec as Record<string, unknown>)[field] = String(val ?? '');
            }
          });

          // Derive month/year from date if not already set
          const dateStr = rec.date ?? '';
          if (dateStr) {
            const { month, year } = parseMonthYear(dateStr);
            if (!rec.month) rec.month = month;
            if (!rec.year) rec.year = year;
          }

          // Compute total_value if missing but we have qty × rate
          if (!rec.total_value && rec.quantity_kg && rec.rate_per_kg) {
            rec.total_value = rec.quantity_kg * rec.rate_per_kg;
          }

          // Compute rate if missing but we have value / qty
          if (!rec.rate_per_kg && rec.total_value && rec.quantity_kg && rec.quantity_kg > 0) {
            rec.rate_per_kg = rec.total_value / rec.quantity_kg;
          }

          return {
            date: rec.date ?? '',
            month: rec.month ?? '',
            year: rec.year ?? new Date().getFullYear(),
            product: rec.product ?? 'Unknown',
            exporter: rec.exporter ?? 'Unknown',
            port: rec.port ?? 'Unknown',
            quantity_kg: rec.quantity_kg ?? 0,
            rate_per_kg: rec.rate_per_kg ?? 0,
            total_value: rec.total_value ?? 0,
          } as TradeRecord;
        });

        // Filter out completely empty rows
        const valid = records.filter(
          (r) => r.quantity_kg > 0 || r.total_value > 0 || r.exporter !== 'Unknown'
        );
        resolve(valid);
      } catch (err) {
        reject(new Error('Failed to parse file. Make sure it is a valid Excel or CSV file.'));
      }
    };
    reader.onerror = () => reject(new Error('Failed to read the file.'));
    reader.readAsBinaryString(file);
  });
}
