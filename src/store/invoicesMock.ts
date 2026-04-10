import type { Invoice } from '../types/invoice';

/**
 * Mock invoice tracking data for development and testing
 * Tracks PDF generation and WhatsApp delivery status for invoices
 */
export const mockInvoices: Invoice[] = [
  {
    id: 1,
    invoice_no: 'KG-2024-0001',
    customer_name: 'Test Customer',
    items: [{ name: 'Gym Bench', quantity: 1, price: 5000 }],
    subtotal: 5000,
    tax_rate: 18,
    tax_amount: 900,
    total: 5900,
    pdf_url: 'https://storage.example.com/invoices/KG-2024-0001.pdf',
    whatsapp_message_id: 'wamid.HBgNOTg3NjU0MzIxMFYAgARGBI5MEFFMUE3RjY5N0E4RTJBOTQA',
    created_at: '2025-11-12T10:11:50Z',
    updated_at: '2025-11-12T10:11:50Z',
  },
  {
    id: 2,
    invoice_no: 'KG-2024-0002',
    pdf_url: 'https://storage.example.com/invoices/KG-2024-0002.pdf',
    whatsapp_message_id: 'wamid.HBgNMTU1NTAxMDEVAgARGBI5MEFFMUE3RjY5N0E4RTJBOTQA',
    created_at: '2025-11-10T10:30:00Z',
    updated_at: '2025-11-10T15:45:00Z',
  },
  {
    id: 3,
    invoice_no: 'KG-2024-0003',
    pdf_url: 'https://storage.example.com/invoices/KG-2024-0003.pdf',
    whatsapp_message_id: 'wamid.HBgNMTU1NTAxMDIVAgARGBI5MEFFMUE3RjY5N0E4RTJCMTFA',
    created_at: '2025-11-11T14:15:00Z',
    updated_at: '2025-11-11T14:15:00Z',
  },
  {
    id: 4,
    invoice_no: 'KG-2024-0004',
    pdf_url: 'https://storage.example.com/invoices/KG-2024-0004.pdf',
    whatsapp_message_id: null,
    created_at: '2025-11-12T09:00:00Z',
    updated_at: '2025-11-12T09:00:00Z',
  },
  {
    id: 4,
    invoice_no: 'INV-2025-004',
    pdf_url: 'https://storage.example.com/invoices/INV-2025-004.pdf',
    whatsapp_message_id: 'wamid.HBgNMTU1NTAxMDQVAgARGBI5MEFFMUE3RjY5N0E4RTJEMTBB',
    created_at: '2025-11-09T16:30:00Z',
    updated_at: '2025-11-10T10:00:00Z',
  },
  {
    id: 5,
    invoice_no: 'INV-2025-005',
    pdf_url: null,
    whatsapp_message_id: null,
    created_at: '2025-11-11T11:45:00Z',
    updated_at: '2025-11-11T11:45:00Z',
  },
];

/**
 * Get all mock invoices
 */
export const getMockInvoices = (): Invoice[] => {
  return [...mockInvoices];
};

/**
 * Get mock invoice by ID
 */
export const getMockInvoiceById = (id: number): Invoice | undefined => {
  return mockInvoices.find(invoice => invoice.id === id);
};

/**
 * Get mock invoice by invoice number
 */
export const getMockInvoiceByInvoiceNo = (invoiceNo: string): Invoice | undefined => {
  return mockInvoices.find(invoice => invoice.invoice_no === invoiceNo);
};

/**
 * Get invoices with PDF generated
 */
export const getMockInvoicesWithPDF = (): Invoice[] => {
  return mockInvoices.filter(invoice => invoice.pdf_url !== null);
};

/**
 * Get invoices without PDF
 */
export const getMockInvoicesWithoutPDF = (): Invoice[] => {
  return mockInvoices.filter(invoice => invoice.pdf_url === null);
};

/**
 * Get invoices sent on WhatsApp
 */
export const getMockInvoicesSentOnWhatsApp = (): Invoice[] => {
  return mockInvoices.filter(invoice => invoice.whatsapp_message_id !== null);
};

/**
 * Get invoices not sent on WhatsApp
 */
export const getMockInvoicesNotSentOnWhatsApp = (): Invoice[] => {
  return mockInvoices.filter(invoice => invoice.whatsapp_message_id === null);
};

/**
 * Check if invoice has PDF generated
 */
export const hasInvoicePDF = (invoice: Invoice): boolean => {
  return invoice.pdf_url !== null && invoice.pdf_url !== undefined;
};

/**
 * Check if invoice was sent on WhatsApp
 */
export const isInvoiceSentOnWhatsApp = (invoice: Invoice): boolean => {
  return invoice.whatsapp_message_id !== null && invoice.whatsapp_message_id !== undefined;
};

/**
 * Get invoice delivery status
 */
export const getInvoiceStatus = (invoice: Invoice): string => {
  if (!hasInvoicePDF(invoice)) {
    return 'PDF Not Generated';
  }
  if (!isInvoiceSentOnWhatsApp(invoice)) {
    return 'Ready to Send';
  }
  return 'Sent on WhatsApp';
};
