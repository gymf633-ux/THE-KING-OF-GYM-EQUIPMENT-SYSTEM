export type PaymentStatus = 'paid' | 'pending' | 'partial';

export interface InvoiceItem {
  id: number;
  name: string;
  quantity: number;
  unit_price: number;
  total: number;
}

export interface Sale {
  id: number;
  invoice_no: string;
  date: string;
  customer_name: string;
  customer_phone: string;
  items: InvoiceItem[];
  subtotal: number;
  taxes: number;
  total: number;
  payment_status: PaymentStatus;
  sent_on_whatsapp: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateSaleInput {
  invoice_no: string;
  date: string;
  customer_name: string;
  customer_phone: string;
  items: InvoiceItem[];
  subtotal: number;
  taxes: number;
  total: number;
  payment_status?: PaymentStatus;
  sent_on_whatsapp?: boolean;
}

export interface UpdateSaleInput {
  invoice_no?: string;
  date?: string;
  customer_name?: string;
  customer_phone?: string;
  items?: InvoiceItem[];
  subtotal?: number;
  taxes?: number;
  total?: number;
  payment_status?: PaymentStatus;
  sent_on_whatsapp?: boolean;
}
