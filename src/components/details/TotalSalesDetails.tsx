import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Calendar, User, Phone, Package, DollarSign, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { getMockSales } from '../../store/salesMock';
import type { Sale } from '../../types/sale';

interface TotalSalesDetailsProps {
  onClose?: () => void;
}

interface DateWiseSales {
  date: string;
  sales: Sale[];
  totalAmount: number;
  totalSales: number;
}

export const TotalSalesDetails: React.FC<TotalSalesDetailsProps> = ({ onClose }) => {
  const sales = useMemo(() => getMockSales(), []);

  // Group sales by date
  const dateWiseSales = useMemo(() => {
    const groupedByDate: Record<string, Sale[]> = {};
    
    sales.forEach(sale => {
      const date = new Date(sale.date).toISOString().split('T')[0];
      if (!groupedByDate[date]) {
        groupedByDate[date] = [];
      }
      groupedByDate[date].push(sale);
    });

    const metrics: DateWiseSales[] = Object.entries(groupedByDate)
      .map(([date, dateSales]) => ({
        date,
        sales: dateSales,
        totalAmount: dateSales.reduce((sum, s) => sum + s.total, 0),
        totalSales: dateSales.length
      }))
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return metrics;
  }, [sales]);

  const totalMetrics = useMemo(() => {
    const totalRevenue = sales.reduce((sum, s) => sum + s.total, 0);
    const totalSales = sales.length;
    const paidSales = sales.filter(s => s.payment_status === 'paid');
    const pendingSales = sales.filter(s => s.payment_status === 'pending');
    const partialSales = sales.filter(s => s.payment_status === 'partial');

    return {
      totalRevenue,
      totalSales,
      paidCount: paidSales.length,
      paidAmount: paidSales.reduce((sum, s) => sum + s.total, 0),
      pendingCount: pendingSales.length,
      pendingAmount: pendingSales.reduce((sum, s) => sum + s.total, 0),
      partialCount: partialSales.length,
      partialAmount: partialSales.reduce((sum, s) => sum + s.total, 0),
    };
  }, [sales]);

  const getPaymentStatusIcon = (status: Sale['payment_status']) => {
    switch (status) {
      case 'paid':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'pending':
        return <Clock className="w-5 h-5 text-orange-600" />;
      case 'partial':
        return <AlertCircle className="w-5 h-5 text-yellow-600" />;
      default:
        return null;
    }
  };

  const getPaymentStatusColor = (status: Sale['payment_status']) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-700';
      case 'pending': return 'bg-orange-100 text-orange-700';
      case 'partial': return 'bg-yellow-100 text-yellow-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-xl p-6 border border-indigo-200">
          <div className="flex items-center gap-2 mb-2">
            <DollarSign className="w-5 h-5 text-indigo-600" />
            <h4 className="text-sm font-medium text-gray-700">Total Revenue</h4>
          </div>
          <p className="text-3xl font-bold text-indigo-600">
            ${totalMetrics.totalRevenue.toLocaleString()}
          </p>
          <p className="text-xs text-gray-600 mt-1">{totalMetrics.totalSales} sales</p>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <h4 className="text-sm font-medium text-gray-700">Paid</h4>
          </div>
          <p className="text-3xl font-bold text-green-600">
            ${totalMetrics.paidAmount.toLocaleString()}
          </p>
          <p className="text-xs text-gray-600 mt-1">{totalMetrics.paidCount} invoices</p>
        </div>

        <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl p-6 border border-orange-200">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="w-5 h-5 text-orange-600" />
            <h4 className="text-sm font-medium text-gray-700">Pending</h4>
          </div>
          <p className="text-3xl font-bold text-orange-600">
            ${totalMetrics.pendingAmount.toLocaleString()}
          </p>
          <p className="text-xs text-gray-600 mt-1">{totalMetrics.pendingCount} invoices</p>
        </div>

        <div className="bg-gradient-to-br from-yellow-50 to-amber-50 rounded-xl p-6 border border-yellow-200">
          <div className="flex items-center gap-2 mb-2">
            <AlertCircle className="w-5 h-5 text-yellow-600" />
            <h4 className="text-sm font-medium text-gray-700">Partial</h4>
          </div>
          <p className="text-3xl font-bold text-yellow-600">
            ${totalMetrics.partialAmount.toLocaleString()}
          </p>
          <p className="text-xs text-gray-600 mt-1">{totalMetrics.partialCount} invoices</p>
        </div>
      </div>

      {/* Date-wise Sales */}
      <div>
        <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-indigo-600" />
          Sales by Date
        </h3>

        <div className="space-y-4">
          {dateWiseSales.map((dateGroup, index) => (
            <motion.div
              key={dateGroup.date}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
            >
              {/* Date Header */}
              <div className="bg-gray-50 px-6 py-3 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-gray-800">
                      {new Date(dateGroup.date).toLocaleDateString('en-US', { 
                        weekday: 'long', 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-xs text-gray-500">Sales Count</p>
                      <p className="text-lg font-bold text-gray-800">{dateGroup.totalSales}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-500">Total Amount</p>
                      <p className="text-lg font-bold text-indigo-600">
                        ${dateGroup.totalAmount.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Sales List */}
              <div className="divide-y divide-gray-100">
                {dateGroup.sales.map((sale) => (
                  <div
                    key={sale.id}
                    className="px-6 py-4 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="p-2 bg-indigo-100 rounded-lg">
                            <Package className="w-4 h-4 text-indigo-600" />
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-800">{sale.invoice_no}</h4>
                            <div className="flex items-center gap-3 mt-1">
                              <div className="flex items-center gap-1">
                                <User className="w-3 h-3 text-gray-400" />
                                <p className="text-sm text-gray-600">{sale.customer_name}</p>
                              </div>
                              <div className="flex items-center gap-1">
                                <Phone className="w-3 h-3 text-gray-400" />
                                <p className="text-sm text-gray-600">{sale.customer_phone}</p>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Items List */}
                        <div className="ml-12 space-y-1">
                          {sale.items.map((item) => (
                            <div key={item.id} className="flex items-center justify-between text-sm">
                              <span className="text-gray-600">
                                {item.name} × {item.quantity}
                              </span>
                              <span className="font-medium text-gray-800">
                                ${item.total.toLocaleString()}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="text-right ml-4">
                        <div className="flex items-center gap-2 justify-end mb-2">
                          {getPaymentStatusIcon(sale.payment_status)}
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPaymentStatusColor(sale.payment_status)}`}>
                            {sale.payment_status.toUpperCase()}
                          </span>
                        </div>
                        <div className="mb-1">
                          <p className="text-xs text-gray-500">Subtotal</p>
                          <p className="text-sm font-medium text-gray-800">
                            ${sale.subtotal.toLocaleString()}
                          </p>
                        </div>
                        <div className="mb-1">
                          <p className="text-xs text-gray-500">Tax</p>
                          <p className="text-sm font-medium text-gray-800">
                            ${sale.taxes.toLocaleString()}
                          </p>
                        </div>
                        <div className="pt-2 border-t border-gray-200">
                          <p className="text-xs text-gray-500">Total</p>
                          <p className="text-xl font-bold text-indigo-600">
                            ${sale.total.toLocaleString()}
                          </p>
                        </div>
                        {sale.sent_on_whatsapp && (
                          <p className="text-xs text-green-600 mt-2">
                            ✓ Sent on WhatsApp
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};
