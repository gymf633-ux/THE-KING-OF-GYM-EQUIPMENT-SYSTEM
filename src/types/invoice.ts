/**
 * Invoice tracking model for PDF generation and WhatsApp delivery status
 * This is separate from the main Sale model to track document generation and messaging
 */
export interface InvoiceItem {
  name: string;
  quantity: number;
  price: number;
}

export interface Invoice {
  id: number;
  invoice_no: string;
  customer_name?: string;
  items?: InvoiceItem[];
  subtotal?: number;
  tax_rate?: number;
  tax_amount?: number;
  total?: number;
  pdf_url?: string | null;
  whatsapp_message_id?: string | null;
  created_at: string;
  updated_at: string;
}

export interface CreateInvoiceInput {
  invoice_no: string;
  pdf_url?: string | null;
  whatsapp_message_id?: string | null;
}

export interface UpdateInvoiceInput {
  pdf_url?: string | null;
  whatsapp_message_id?: string | null;
}
