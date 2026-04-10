import React from 'react';

export interface InvoiceItem {
  name: string;
  qty: number;
  rate: number;
  tax_percent: number;
}

export interface SellerInfo {
  name: string;
  logo?: string;
  gstin: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  phone?: string;
  email?: string;
}

export interface BuyerInfo {
  name: string;
  phone: string;
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
  gstin?: string;
}

export interface InvoiceData {
  invoice_no: string;
  date: string;
  seller: SellerInfo;
  buyer: BuyerInfo;
  items: InvoiceItem[];
}

interface InvoiceTemplateProps {
  data: InvoiceData;
}

export const InvoiceTemplate: React.FC<InvoiceTemplateProps> = ({ data }) => {
  const calculateItemTotal = (item: InvoiceItem) => {
    const subtotal = item.qty * item.rate;
    const taxAmount = (subtotal * item.tax_percent) / 100;
    return subtotal + taxAmount;
  };

  const calculateSubtotal = () => {
    return data.items.reduce((sum, item) => sum + (item.qty * item.rate), 0);
  };

  const calculateTotalTax = () => {
    return data.items.reduce((sum, item) => {
      const subtotal = item.qty * item.rate;
      return sum + (subtotal * item.tax_percent) / 100;
    }, 0);
  };

  const calculateGrandTotal = () => {
    return calculateSubtotal() + calculateTotalTax();
  };

  return (
    <div className="bg-white p-8 max-w-4xl mx-auto" id="invoice-template">
      {/* Header - Seller Info */}
      <div className="border-b-2 border-gray-800 pb-6 mb-6">
        <div className="flex justify-between items-start">
          <div>
            {data.seller.logo && (
              <img 
                src={data.seller.logo} 
                alt="Company Logo" 
                className="h-16 mb-3"
              />
            )}
            <h1 className="text-2xl font-bold text-gray-900">{data.seller.name}</h1>
            <p className="text-sm text-gray-600 mt-2">
              {data.seller.address}<br />
              {data.seller.city}, {data.seller.state} - {data.seller.pincode}
            </p>
            {data.seller.phone && (
              <p className="text-sm text-gray-600 mt-1">Phone: {data.seller.phone}</p>
            )}
            {data.seller.email && (
              <p className="text-sm text-gray-600">Email: {data.seller.email}</p>
            )}
            <p className="text-sm font-medium text-gray-800 mt-2">
              GSTIN: {data.seller.gstin}
            </p>
          </div>
          <div className="text-right">
            <h2 className="text-3xl font-bold text-gray-900">INVOICE</h2>
            <p className="text-sm text-gray-600 mt-2">
              <span className="font-medium">Invoice No:</span> {data.invoice_no}
            </p>
            <p className="text-sm text-gray-600">
              <span className="font-medium">Date:</span> {new Date(data.date).toLocaleDateString('en-IN')}
            </p>
          </div>
        </div>
      </div>

      {/* Buyer Info */}
      <div className="mb-6">
        <h3 className="text-sm font-bold text-gray-700 mb-2">BILL TO:</h3>
        <div className="bg-gray-50 p-4 rounded">
          <p className="font-medium text-gray-900">{data.buyer.name}</p>
          <p className="text-sm text-gray-600 mt-1">Phone: {data.buyer.phone}</p>
          {data.buyer.address && (
            <p className="text-sm text-gray-600 mt-1">
              {data.buyer.address}
              {data.buyer.city && `, ${data.buyer.city}`}
              {data.buyer.state && `, ${data.buyer.state}`}
              {data.buyer.pincode && ` - ${data.buyer.pincode}`}
            </p>
          )}
          {data.buyer.gstin && (
            <p className="text-sm text-gray-600 mt-1">GSTIN: {data.buyer.gstin}</p>
          )}
        </div>
      </div>

      {/* Items Table */}
      <div className="mb-6">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-800 text-white">
              <th className="text-left py-3 px-4 text-sm font-semibold">#</th>
              <th className="text-left py-3 px-4 text-sm font-semibold">Item Description</th>
              <th className="text-right py-3 px-4 text-sm font-semibold">Qty</th>
              <th className="text-right py-3 px-4 text-sm font-semibold">Rate</th>
              <th className="text-right py-3 px-4 text-sm font-semibold">Tax %</th>
              <th className="text-right py-3 px-4 text-sm font-semibold">Amount</th>
            </tr>
          </thead>
          <tbody>
            {data.items.map((item, index) => (
              <tr key={index} className="border-b border-gray-200">
                <td className="py-3 px-4 text-sm text-gray-700">{index + 1}</td>
                <td className="py-3 px-4 text-sm text-gray-900">{item.name}</td>
                <td className="py-3 px-4 text-sm text-right text-gray-700">{item.qty}</td>
                <td className="py-3 px-4 text-sm text-right text-gray-700">
                  ₹{item.rate.toFixed(2)}
                </td>
                <td className="py-3 px-4 text-sm text-right text-gray-700">
                  {item.tax_percent}%
                </td>
                <td className="py-3 px-4 text-sm text-right font-medium text-gray-900">
                  ₹{calculateItemTotal(item).toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Totals */}
      <div className="flex justify-end mb-6">
        <div className="w-64">
          <div className="flex justify-between py-2 border-b border-gray-200">
            <span className="text-sm text-gray-700">Subtotal:</span>
            <span className="text-sm font-medium text-gray-900">
              ₹{calculateSubtotal().toFixed(2)}
            </span>
          </div>
          <div className="flex justify-between py-2 border-b border-gray-200">
            <span className="text-sm text-gray-700">Total Tax:</span>
            <span className="text-sm font-medium text-gray-900">
              ₹{calculateTotalTax().toFixed(2)}
            </span>
          </div>
          <div className="flex justify-between py-3 bg-gray-800 text-white px-3 rounded mt-2">
            <span className="font-bold">Grand Total:</span>
            <span className="font-bold text-lg">
              ₹{calculateGrandTotal().toFixed(2)}
            </span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t-2 border-gray-200 pt-4 mt-8">
        <div className="flex justify-between items-end">
          <div className="text-sm text-gray-600">
            <p className="font-medium mb-1">Terms & Conditions:</p>
            <p>1. Payment due within 15 days</p>
            <p>2. Please quote invoice number when paying</p>
          </div>
          <div className="text-center">
            <div className="border-t border-gray-400 pt-2 mt-8 w-48">
              <p className="text-sm text-gray-700">Authorized Signature</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
