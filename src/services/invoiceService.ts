import jsPDF from 'jspdf';
import type { InvoiceData } from '../components/invoice/InvoiceTemplate';

/**
 * Invoice Service for PDF generation
 */
class InvoiceService {
  /**
   * Generate invoice number in format: KG-YYYYMM-####
   */
  generateInvoiceNumber(lastNumber?: string): string {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const prefix = `KG-${year}${month}`;

    let sequence = 1;

    if (lastNumber && lastNumber.startsWith(prefix)) {
      // Extract sequence from last number
      const parts = lastNumber.split('-');
      if (parts.length === 3) {
        const lastSeq = parseInt(parts[2], 10);
        if (!isNaN(lastSeq)) {
          sequence = lastSeq + 1;
        }
      }
    }

    const sequenceStr = String(sequence).padStart(4, '0');
    return `${prefix}-${sequenceStr}`;
  }

  /**
   * Generate PDF from invoice data
   */
  async generatePDF(data: InvoiceData): Promise<Blob> {
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 15;
    const contentWidth = pageWidth - (2 * margin);
    let yPos = margin;

    // Helper function to add text with auto wrap
    const addText = (text: string, x: number, y: number, options?: any) => {
      pdf.text(text, x, y, options);
    };

    // Header - Seller Info
    pdf.setFontSize(20);
    pdf.setFont('helvetica', 'bold');
    addText(data.seller.name, margin, yPos);
    yPos += 8;

    pdf.setFontSize(9);
    pdf.setFont('helvetica', 'normal');
    addText(data.seller.address, margin, yPos);
    yPos += 4;
    addText(`${data.seller.city}, ${data.seller.state} - ${data.seller.pincode}`, margin, yPos);
    yPos += 4;

    if (data.seller.phone) {
      addText(`Phone: ${data.seller.phone}`, margin, yPos);
      yPos += 4;
    }
    if (data.seller.email) {
      addText(`Email: ${data.seller.email}`, margin, yPos);
      yPos += 4;
    }

    pdf.setFont('helvetica', 'bold');
    addText(`GSTIN: ${data.seller.gstin}`, margin, yPos);
    yPos += 10;

    // Invoice Title and Details (Right side)
    const rightX = pageWidth - margin;
    pdf.setFontSize(24);
    pdf.setFont('helvetica', 'bold');
    addText('INVOICE', rightX, margin, { align: 'right' });

    pdf.setFontSize(9);
    pdf.setFont('helvetica', 'normal');
    addText(`Invoice No: ${data.invoice_no}`, rightX, margin + 10, { align: 'right' });
    addText(`Date: ${new Date(data.date).toLocaleDateString('en-IN')}`, rightX, margin + 15, { align: 'right' });

    // Horizontal line
    pdf.setDrawColor(0);
    pdf.setLineWidth(0.5);
    pdf.line(margin, yPos, pageWidth - margin, yPos);
    yPos += 8;

    // Buyer Info
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'bold');
    addText('BILL TO:', margin, yPos);
    yPos += 6;

    pdf.setFontSize(9);
    pdf.setFont('helvetica', 'bold');
    addText(data.buyer.name, margin + 2, yPos);
    yPos += 4;

    pdf.setFont('helvetica', 'normal');
    addText(`Phone: ${data.buyer.phone}`, margin + 2, yPos);
    yPos += 4;

    if (data.buyer.address) {
      let buyerAddress = data.buyer.address;
      if (data.buyer.city) buyerAddress += `, ${data.buyer.city}`;
      if (data.buyer.state) buyerAddress += `, ${data.buyer.state}`;
      if (data.buyer.pincode) buyerAddress += ` - ${data.buyer.pincode}`;
      
      const addressLines = pdf.splitTextToSize(buyerAddress, contentWidth - 4);
      addressLines.forEach((line: string) => {
        addText(line, margin + 2, yPos);
        yPos += 4;
      });
    }

    if (data.buyer.gstin) {
      addText(`GSTIN: ${data.buyer.gstin}`, margin + 2, yPos);
      yPos += 4;
    }

    yPos += 6;

    // Items Table Header
    const colX = {
      no: margin,
      item: margin + 10,
      qty: margin + 100,
      rate: margin + 120,
      tax: margin + 145,
      amount: margin + 165,
    };

    // Table header background
    pdf.setFillColor(50, 50, 50);
    pdf.rect(margin, yPos - 4, contentWidth, 7, 'F');

    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(9);
    pdf.setFont('helvetica', 'bold');
    addText('#', colX.no + 1, yPos);
    addText('Item Description', colX.item, yPos);
    addText('Qty', colX.qty + 8, yPos, { align: 'right' });
    addText('Rate', colX.rate + 10, yPos, { align: 'right' });
    addText('Tax %', colX.tax + 8, yPos, { align: 'right' });
    addText('Amount', colX.amount + 25, yPos, { align: 'right' });
    yPos += 8;

    // Reset text color
    pdf.setTextColor(0, 0, 0);
    pdf.setFont('helvetica', 'normal');

    // Items
    let subtotal = 0;
    let totalTax = 0;

    data.items.forEach((item, index) => {
      const itemSubtotal = item.qty * item.rate;
      const itemTax = (itemSubtotal * item.tax_percent) / 100;
      const itemTotal = itemSubtotal + itemTax;

      subtotal += itemSubtotal;
      totalTax += itemTax;

      // Check if we need a new page
      if (yPos > pageHeight - 60) {
        pdf.addPage();
        yPos = margin;
      }

      addText(String(index + 1), colX.no + 1, yPos);
      
      const itemName = pdf.splitTextToSize(item.name, 80);
      addText(itemName[0], colX.item, yPos);
      
      addText(String(item.qty), colX.qty + 8, yPos, { align: 'right' });
      addText(`₹${item.rate.toFixed(2)}`, colX.rate + 10, yPos, { align: 'right' });
      addText(`${item.tax_percent}%`, colX.tax + 8, yPos, { align: 'right' });
      
      pdf.setFont('helvetica', 'bold');
      addText(`₹${itemTotal.toFixed(2)}`, colX.amount + 25, yPos, { align: 'right' });
      pdf.setFont('helvetica', 'normal');
      
      yPos += 6;

      // Thin line between items
      pdf.setDrawColor(220, 220, 220);
      pdf.setLineWidth(0.1);
      pdf.line(margin, yPos, pageWidth - margin, yPos);
      yPos += 2;
    });

    yPos += 6;

    // Totals section
    const totalsX = pageWidth - margin - 60;
    const totalsValueX = pageWidth - margin;

    pdf.setFontSize(9);
    pdf.setFont('helvetica', 'normal');
    
    addText('Subtotal:', totalsX, yPos);
    addText(`₹${subtotal.toFixed(2)}`, totalsValueX, yPos, { align: 'right' });
    yPos += 5;

    addText('Total Tax:', totalsX, yPos);
    addText(`₹${totalTax.toFixed(2)}`, totalsValueX, yPos, { align: 'right' });
    yPos += 8;

    // Grand total box
    pdf.setFillColor(50, 50, 50);
    pdf.rect(totalsX - 5, yPos - 4, 65, 8, 'F');
    
    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(11);
    pdf.setFont('helvetica', 'bold');
    addText('Grand Total:', totalsX, yPos);
    addText(`₹${(subtotal + totalTax).toFixed(2)}`, totalsValueX, yPos, { align: 'right' });
    
    pdf.setTextColor(0, 0, 0);
    yPos += 15;

    // Footer
    yPos = pageHeight - 35;
    pdf.setDrawColor(200, 200, 200);
    pdf.setLineWidth(0.3);
    pdf.line(margin, yPos, pageWidth - margin, yPos);
    yPos += 6;

    pdf.setFontSize(8);
    pdf.setFont('helvetica', 'bold');
    addText('Terms & Conditions:', margin, yPos);
    yPos += 4;

    pdf.setFont('helvetica', 'normal');
    addText('1. Payment due within 15 days', margin, yPos);
    yPos += 3.5;
    addText('2. Please quote invoice number when paying', margin, yPos);

    // Signature
    const sigX = pageWidth - margin - 40;
    pdf.setDrawColor(100, 100, 100);
    pdf.line(sigX, pageHeight - 20, pageWidth - margin, pageHeight - 20);
    pdf.setFontSize(8);
    addText('Authorized Signature', sigX + 10, pageHeight - 15, { align: 'center' });

    // Return as Blob
    return pdf.output('blob');
  }

  /**
   * Download PDF file
   */
  downloadPDF(blob: Blob, filename: string): void {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  /**
   * Get blob URL for preview or WhatsApp sharing
   */
  getBlobURL(blob: Blob): string {
    return URL.createObjectURL(blob);
  }
}

export const invoiceService = new InvoiceService();
