import React, { useState, useEffect } from 'react';
import { FileText, Download, Send, Plus, Save, Eye } from 'lucide-react';
import { InvoiceTemplate, type InvoiceData, type InvoiceItem, type SellerInfo, type BuyerInfo } from '../components/invoice/InvoiceTemplate';
import { invoiceService } from '../services/invoiceService';
import { whatsappService } from '../services/whatsapp';
import { getMockSettings } from '../store/settingsMock';
import { getMockInvoices } from '../store/invoicesMock';
import { Toast, ToastContainer } from '../components/NotificationToast';

export const InvoicePage: React.FC = () => {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSendingWhatsApp, setIsSendingWhatsApp] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [pdfBlob, setPdfBlob] = useState<Blob | null>(null);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);

  // Invoice form state
  const [invoiceNo, setInvoiceNo] = useState('');
  const [invoiceDate, setInvoiceDate] = useState(new Date().toISOString().split('T')[0]);

  // Seller info
  const [seller, setSeller] = useState<SellerInfo>({
    name: 'Your Company Name',
    gstin: '29ABCDE1234F1Z5',
    address: '123, Business Street',
    city: 'Bangalore',
    state: 'Karnataka',
    pincode: '560001',
    phone: '+91 98765 43210',
    email: 'info@company.com',
  });

  // Buyer info
  const [buyer, setBuyer] = useState<BuyerInfo>({
    name: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    gstin: '',
  });

  // Items
  const [items, setItems] = useState<InvoiceItem[]>([
    { name: '', qty: 1, rate: 0, tax_percent: 18 },
  ]);

  useEffect(() => {
    // Generate invoice number on mount
    const existingInvoices = getMockInvoices();
    const lastInvoice = existingInvoices.sort((a, b) => 
      b.invoice_no.localeCompare(a.invoice_no)
    )[0];
    
    const newInvoiceNo = invoiceService.generateInvoiceNumber(lastInvoice?.invoice_no);
    setInvoiceNo(newInvoiceNo);
  }, []);

  const showToast = (type: Toast['type'], title: string, messages: string[]) => {
    const newToast: Toast = {
      id: Date.now().toString(),
      type,
      title,
      messages,
    };
    setToasts(prev => [...prev, newToast]);
  };

  const closeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const addItem = () => {
    setItems([...items, { name: '', qty: 1, rate: 0, tax_percent: 18 }]);
  };

  const updateItem = (index: number, field: keyof InvoiceItem, value: string | number) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    setItems(newItems);
  };

  const removeItem = (index: number) => {
    if (items.length > 1) {
      setItems(items.filter((_, i) => i !== index));
    }
  };

  const validateForm = (): { valid: boolean; errors: string[] } => {
    const errors: string[] = [];

    if (!buyer.name.trim()) errors.push('Buyer name is required');
    if (!buyer.phone.trim()) errors.push('Buyer phone is required');
    
    items.forEach((item, index) => {
      if (!item.name.trim()) errors.push(`Item ${index + 1}: Name is required`);
      if (item.qty <= 0) errors.push(`Item ${index + 1}: Quantity must be greater than 0`);
      if (item.rate <= 0) errors.push(`Item ${index + 1}: Rate must be greater than 0`);
    });

    return { valid: errors.length === 0, errors };
  };

  const getInvoiceData = (): InvoiceData => {
    return {
      invoice_no: invoiceNo,
      date: invoiceDate,
      seller,
      buyer,
      items,
    };
  };

  const handleGeneratePDF = async () => {
    const validation = validateForm();
    if (!validation.valid) {
      showToast('error', 'Validation Failed', validation.errors);
      return;
    }

    setIsGenerating(true);
    try {
      const invoiceData = getInvoiceData();
      const blob = await invoiceService.generatePDF(invoiceData);
      setPdfBlob(blob);
      
      const url = invoiceService.getBlobURL(blob);
      setPdfUrl(url);

      showToast('success', 'PDF Generated', [
        'Invoice PDF generated successfully',
        'You can now download or send via WhatsApp',
      ]);
    } catch (error) {
      console.error('PDF generation error:', error);
      showToast('error', 'Generation Failed', [
        error instanceof Error ? error.message : 'Failed to generate PDF',
      ]);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownloadPDF = () => {
    if (!pdfBlob) {
      showToast('error', 'No PDF Available', ['Please generate PDF first']);
      return;
    }

    invoiceService.downloadPDF(pdfBlob, `${invoiceNo}.pdf`);
    showToast('success', 'Download Started', [`Downloading ${invoiceNo}.pdf`]);
  };

  const handleSendWhatsApp = async () => {
    if (!pdfBlob || !pdfUrl) {
      showToast('error', 'No PDF Available', ['Please generate PDF first']);
      return;
    }

    if (!buyer.phone) {
      showToast('error', 'Missing Phone', ['Buyer phone number is required']);
      return;
    }

    const settings = getMockSettings();
    const whatsappConfig = settings.whatsapp_api;

    const validation = whatsappService.validateConfig(whatsappConfig);
    if (!validation.valid) {
      showToast('error', 'WhatsApp Not Configured', [
        'Please configure WhatsApp API in settings',
        ...validation.errors,
      ]);
      return;
    }

    setIsSendingWhatsApp(true);
    try {
      // Send text message with invoice details
      const message = `Hi ${buyer.name},\n\nYour invoice ${invoiceNo} is ready!\n\nGrand Total: ₹${calculateGrandTotal().toFixed(2)}\n\nThank you for your business!`;
      
      const result = await whatsappService.sendTextMessage(
        whatsappConfig,
        buyer.phone,
        message
      );

      if (result.success) {
        showToast('success', 'Sent on WhatsApp!', [
          `Invoice sent to ${buyer.name}`,
          `Phone: ${buyer.phone}`,
          `Message ID: ${result.messageId}`,
        ]);
      } else {
        showToast('error', 'Send Failed', [
          result.error || 'Failed to send WhatsApp message',
        ]);
      }
    } catch (error) {
      console.error('WhatsApp send error:', error);
      showToast('error', 'Error', [
        error instanceof Error ? error.message : 'Failed to send message',
      ]);
    } finally {
      setIsSendingWhatsApp(false);
    }
  };

  const calculateSubtotal = () => {
    return items.reduce((sum, item) => sum + (item.qty * item.rate), 0);
  };

  const calculateTotalTax = () => {
    return items.reduce((sum, item) => {
      const subtotal = item.qty * item.rate;
      return sum + (subtotal * item.tax_percent) / 100;
    }, 0);
  };

  const calculateGrandTotal = () => {
    return calculateSubtotal() + calculateTotalTax();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-3 mb-2">
            <FileText className="w-8 h-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">Create Invoice</h1>
          </div>
          <p className="text-sm text-gray-500">
            Generate professional PDF invoices and send via WhatsApp
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Form Section */}
          <div className="lg:col-span-2 space-y-6">
            {/* Invoice Details */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Invoice Details</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Invoice Number
                  </label>
                  <input
                    type="text"
                    value={invoiceNo}
                    onChange={(e) => setInvoiceNo(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="KG-202511-0001"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Invoice Date
                  </label>
                  <input
                    type="date"
                    value={invoiceDate}
                    onChange={(e) => setInvoiceDate(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Buyer Details */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Buyer Details</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Name *
                  </label>
                  <input
                    type="text"
                    value={buyer.name}
                    onChange={(e) => setBuyer({ ...buyer, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Customer Name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone *
                  </label>
                  <input
                    type="tel"
                    value={buyer.phone}
                    onChange={(e) => setBuyer({ ...buyer, phone: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="+91 XXXXX XXXXX"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Address
                  </label>
                  <input
                    type="text"
                    value={buyer.address}
                    onChange={(e) => setBuyer({ ...buyer, address: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Street Address"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    City
                  </label>
                  <input
                    type="text"
                    value={buyer.city}
                    onChange={(e) => setBuyer({ ...buyer, city: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="City"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    State
                  </label>
                  <input
                    type="text"
                    value={buyer.state}
                    onChange={(e) => setBuyer({ ...buyer, state: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="State"
                  />
                </div>
              </div>
            </div>

            {/* Items */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Items</h2>
                <button
                  onClick={addItem}
                  className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Add Item
                </button>
              </div>
              <div className="space-y-4">
                {items.map((item, index) => (
                  <div key={index} className="grid grid-cols-12 gap-3 items-start">
                    <div className="col-span-5">
                      <input
                        type="text"
                        value={item.name}
                        onChange={(e) => updateItem(index, 'name', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                        placeholder="Item name"
                      />
                    </div>
                    <div className="col-span-2">
                      <input
                        type="number"
                        value={item.qty}
                        onChange={(e) => updateItem(index, 'qty', Number(e.target.value))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                        placeholder="Qty"
                        min="1"
                      />
                    </div>
                    <div className="col-span-2">
                      <input
                        type="number"
                        value={item.rate}
                        onChange={(e) => updateItem(index, 'rate', Number(e.target.value))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                        placeholder="Rate"
                        min="0"
                        step="0.01"
                      />
                    </div>
                    <div className="col-span-2">
                      <input
                        type="number"
                        value={item.tax_percent}
                        onChange={(e) => updateItem(index, 'tax_percent', Number(e.target.value))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                        placeholder="Tax %"
                        min="0"
                        max="100"
                      />
                    </div>
                    <div className="col-span-1 flex items-center justify-center">
                      {items.length > 1 && (
                        <button
                          onClick={() => removeItem(index)}
                          className="text-red-600 hover:text-red-700 text-sm"
                        >
                          ✕
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Summary & Actions */}
          <div className="space-y-6">
            {/* Totals Summary */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Summary</h2>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal:</span>
                  <span className="font-medium text-gray-900">
                    ₹{calculateSubtotal().toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Total Tax:</span>
                  <span className="font-medium text-gray-900">
                    ₹{calculateTotalTax().toFixed(2)}
                  </span>
                </div>
                <div className="border-t pt-3">
                  <div className="flex justify-between">
                    <span className="font-bold text-gray-900">Grand Total:</span>
                    <span className="font-bold text-xl text-gray-900">
                      ₹{calculateGrandTotal().toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 space-y-3">
              <button
                onClick={handleGeneratePDF}
                disabled={isGenerating}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                <FileText className="w-4 h-4" />
                {isGenerating ? 'Generating...' : 'Generate PDF'}
              </button>

              {pdfBlob && (
                <>
                  <button
                    onClick={handleDownloadPDF}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    Download PDF
                  </button>

                  <button
                    onClick={handleSendWhatsApp}
                    disabled={isSendingWhatsApp}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                  >
                    <Send className="w-4 h-4" />
                    {isSendingWhatsApp ? 'Sending...' : 'Send on WhatsApp'}
                  </button>

                  <button
                    onClick={() => setShowPreview(!showPreview)}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <Eye className="w-4 h-4" />
                    {showPreview ? 'Hide Preview' : 'Show Preview'}
                  </button>
                </>
              )}
            </div>

            {/* Preview */}
            {showPreview && pdfUrl && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Preview</h2>
                <InvoiceTemplate data={getInvoiceData()} />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Toast Notifications */}
      <ToastContainer toasts={toasts} onClose={closeToast} />
    </div>
  );
};
