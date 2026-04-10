import type { Sale, InvoiceItem } from '../types/sale';

/**
 * Mock sales/invoices data for development and testing
 */
export const mockSales: Sale[] = [
  {
    id: 1,
    invoice_no: 'KG-2024-0001',
    date: '2025-11-12T10:11:50Z',
    customer_name: 'Test Customer',
    customer_phone: '9876543210',
    items: [
      { id: 1, name: 'Gym Bench', quantity: 1, unit_price: 5000.00, total: 5000.00 },
    ],
    subtotal: 5000.00,
    taxes: 900.00, // 18% GST
    total: 5900.00,
    payment_status: 'paid',
    sent_on_whatsapp: true,
    created_at: '2025-11-12T10:11:50Z',
    updated_at: '2025-11-12T10:11:50Z',
  },
  {
    id: 2,
    invoice_no: 'KG-2024-0002',
    date: '2025-11-10T10:30:00Z',
    customer_name: 'John Smith',
    customer_phone: '+1-555-0101',
    items: [
      { id: 1, name: 'Power Rack Pro', quantity: 1, unit_price: 25000.00, total: 25000.00 },
      { id: 2, name: 'Olympic Barbell Set', quantity: 1, unit_price: 8000.00, total: 8000.00 },
    ],
    subtotal: 33000.00,
    taxes: 5940.00, // 18% GST
    total: 38940.00,
    payment_status: 'paid',
    sent_on_whatsapp: true,
    created_at: '2025-11-10T10:30:00Z',
    updated_at: '2025-11-10T15:45:00Z',
  },
  {
    id: 3,
    invoice_no: 'KG-2024-0003',
    date: '2025-11-11T14:15:00Z',
    customer_name: 'Emily Davis',
    customer_phone: '+1-555-0102',
    items: [
      { id: 1, name: 'Adjustable Dumbbells Set', quantity: 2, unit_price: 6000.00, total: 12000.00 },
      { id: 2, name: 'Yoga Mat Premium', quantity: 3, unit_price: 800.00, total: 2400.00 },
      { id: 3, name: 'Resistance Bands Kit', quantity: 2, unit_price: 1200.00, total: 2400.00 },
    ],
    subtotal: 16800.00,
    taxes: 3024.00, // 18% GST
    total: 19824.00,
    payment_status: 'pending',
    sent_on_whatsapp: true,
    created_at: '2025-11-11T14:15:00Z',
    updated_at: '2025-11-11T14:15:00Z',
  },
  {
    id: 3,
    invoice_no: 'INV-2025-003',
    date: '2025-11-12T09:00:00Z',
    customer_name: 'Michael Brown',
    customer_phone: '+1-555-0103',
    items: [
      { id: 1, name: 'Social Media Management Platform', quantity: 1, unit_price: 800.00, total: 800.00 },
      { id: 2, name: 'Content Calendar Setup', quantity: 1, unit_price: 300.00, total: 300.00 },
    ],
    subtotal: 1100.00,
    taxes: 88.00,
    total: 1188.00,
    payment_status: 'partial',
    sent_on_whatsapp: false,
    created_at: '2025-11-12T09:00:00Z',
    updated_at: '2025-11-12T09:00:00Z',
  },
  {
    id: 4,
    invoice_no: 'INV-2025-004',
    date: '2025-11-09T16:30:00Z',
    customer_name: 'Sarah Wilson',
    customer_phone: '+1-555-0104',
    items: [
      { id: 1, name: 'CRM System License', quantity: 1, unit_price: 3500.00, total: 3500.00 },
      { id: 2, name: 'Data Migration Service', quantity: 1, unit_price: 1000.00, total: 1000.00 },
      { id: 3, name: 'Custom Integration', quantity: 20, unit_price: 100.00, total: 2000.00 },
    ],
    subtotal: 6500.00,
    taxes: 520.00,
    total: 7020.00,
    payment_status: 'paid',
    sent_on_whatsapp: true,
    created_at: '2025-11-09T16:30:00Z',
    updated_at: '2025-11-10T10:00:00Z',
  },
  {
    id: 5,
    invoice_no: 'INV-2025-005',
    date: '2025-11-11T11:45:00Z',
    customer_name: 'David Martinez',
    customer_phone: '+1-555-0105',
    items: [
      { id: 1, name: 'Analytics Dashboard', quantity: 1, unit_price: 1500.00, total: 1500.00 },
      { id: 2, name: 'Monthly Reporting Service', quantity: 3, unit_price: 250.00, total: 750.00 },
    ],
    subtotal: 2250.00,
    taxes: 180.00,
    total: 2430.00,
    payment_status: 'pending',
    sent_on_whatsapp: false,
    created_at: '2025-11-11T11:45:00Z',
    updated_at: '2025-11-11T11:45:00Z',
  },
];

/**
 * Get all mock sales
 */
export const getMockSales = (): Sale[] => {
  return [...mockSales];
};

/**
 * Get mock sale by ID
 */
export const getMockSaleById = (id: number): Sale | undefined => {
  return mockSales.find(sale => sale.id === id);
};

/**
 * Get mock sales by invoice number
 */
export const getMockSaleByInvoiceNo = (invoiceNo: string): Sale | undefined => {
  return mockSales.find(sale => sale.invoice_no === invoiceNo);
};

/**
 * Get mock sales by payment status
 */
export const getMockSalesByPaymentStatus = (status: Sale['payment_status']): Sale[] => {
  return mockSales.filter(sale => sale.payment_status === status);
};

/**
 * Get mock sales by customer phone
 */
export const getMockSalesByCustomerPhone = (phone: string): Sale[] => {
  return mockSales.filter(sale => sale.customer_phone === phone);
};

/**
 * Get mock sales sent on WhatsApp
 */
export const getMockSalesSentOnWhatsApp = (sent: boolean): Sale[] => {
  return mockSales.filter(sale => sale.sent_on_whatsapp === sent);
};

/**
 * Format currency with symbol
 */
export const formatCurrency = (amount: number, currency: string = 'USD'): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(amount);
};

/**
 * Format date to readable string
 */
export const formatDate = (dateString: string): string => {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(new Date(dateString));
};

/**
 * Format date with time
 */
export const formatDateTime = (dateString: string): string => {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(dateString));
};

/**
 * Calculate total revenue from sales
 */
export const calculateTotalRevenue = (sales: Sale[]): number => {
  return sales.reduce((sum, sale) => sum + sale.total, 0);
};

/**
 * Calculate total taxes from sales
 */
export const calculateTotalTaxes = (sales: Sale[]): number => {
  return sales.reduce((sum, sale) => sum + sale.taxes, 0);
};

/**
 * Calculate invoice subtotal from items
 */
export const calculateSubtotal = (items: InvoiceItem[]): number => {
  return items.reduce((sum, item) => sum + item.total, 0);
};

/**
 * Calculate item total (quantity * unit_price)
 */
export const calculateItemTotal = (quantity: number, unitPrice: number): number => {
  return quantity * unitPrice;
};

/**
 * Generate next invoice number
 */
export const generateInvoiceNo = (lastInvoiceNo?: string): string => {
  const currentYear = new Date().getFullYear();
  
  if (!lastInvoiceNo) {
    return `INV-${currentYear}-001`;
  }
  
  const match = lastInvoiceNo.match(/INV-(\d{4})-(\d{3})/);
  if (!match) {
    return `INV-${currentYear}-001`;
  }
  
  const [, year, number] = match;
  const nextNumber = parseInt(number, 10) + 1;
  
  return `INV-${currentYear}-${String(nextNumber).padStart(3, '0')}`;
};
