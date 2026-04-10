import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { DollarSign, TrendingUp, Package, User, Phone, CheckCircle, Clock, AlertCircle, Calendar } from 'lucide-react';
import { getMockSales } from '../store/salesMock';
import type { Sale } from '../types/sale';

export const SalesPage: React.FC = () => {
  const sales = useMemo(() => getMockSales(), []);

  const stats = useMemo(() => {
    const totalRevenue = sales.reduce((sum, s) => sum + s.total, 0);
    const totalSales = sales.length;
    const paidSales = sales.filter(s => s.payment_status === 'paid');
    const pendingSales = sales.filter(s => s.payment_status === 'pending');

    return {
      totalRevenue,
      totalSales,
      paidAmount: paidSales.reduce((sum, s) => sum + s.total, 0),
      pendingAmount: pendingSales.reduce((sum, s) => sum + s.total, 0),
      avgSaleValue: totalSales > 0 ? totalRevenue / totalSales : 0
    };
  }, [sales]);

  const getPaymentStatusIcon = (status: Sale['payment_status']) => {
    switch (status) {
      case 'paid': return CheckCircle;
      case 'pending': return Clock;
      case 'partial': return AlertCircle;
      default: return Clock;
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-green-50 to-emerald-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl shadow-xl p-8 text-white"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
              <DollarSign className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Sales & Invoices</h1>
              <p className="text-green-100 mt-1">
                Track all sales transactions and invoice details
              </p>
            </div>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-xl shadow-lg p-6"
          >
            <div className="flex items-center gap-2 mb-2">
              <DollarSign className="w-5 h-5 text-green-600" />
              <h3 className="text-sm font-medium text-gray-700">Total Revenue</h3>
            </div>
            <p className="text-2xl font-bold text-green-600">${stats.totalRevenue.toLocaleString()}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl shadow-lg p-6"
          >
            <div className="flex items-center gap-2 mb-2">
              <Package className="w-5 h-5 text-indigo-600" />
              <h3 className="text-sm font-medium text-gray-700">Total Sales</h3>
            </div>
            <p className="text-3xl font-bold text-indigo-600">{stats.totalSales}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-xl shadow-lg p-6"
          >
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="w-5 h-5 text-blue-600" />
              <h3 className="text-sm font-medium text-gray-700">Paid Amount</h3>
            </div>
            <p className="text-2xl font-bold text-blue-600">${stats.paidAmount.toLocaleString()}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-xl shadow-lg p-6"
          >
            <div className="flex items-center gap-2 mb-2">
              <Clock className="w-5 h-5 text-orange-600" />
              <h3 className="text-sm font-medium text-gray-700">Pending</h3>
            </div>
            <p className="text-2xl font-bold text-orange-600">${stats.pendingAmount.toLocaleString()}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white rounded-xl shadow-lg p-6"
          >
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-5 h-5 text-purple-600" />
              <h3 className="text-sm font-medium text-gray-700">Avg. Sale Value</h3>
            </div>
            <p className="text-2xl font-bold text-purple-600">${stats.avgSaleValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
          </motion.div>
        </div>

        {/* Sales List */}
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">All Sales</h2>
          <div className="space-y-4">
            {sales.map((sale, index) => {
              const StatusIcon = getPaymentStatusIcon(sale.payment_status);

              return (
                <motion.div
                  key={sale.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-indigo-100 rounded-lg">
                          <Package className="w-5 h-5 text-indigo-600" />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-gray-800">{sale.invoice_no}</h3>
                          <div className="flex items-center gap-3 mt-1">
                            <div className="flex items-center gap-1">
                              <User className="w-4 h-4 text-gray-400" />
                              <p className="text-sm text-gray-600">{sale.customer_name}</p>
                            </div>
                            <div className="flex items-center gap-1">
                              <Phone className="w-4 h-4 text-gray-400" />
                              <p className="text-sm text-gray-600">{sale.customer_phone}</p>
                            </div>
                            <div className="flex items-center gap-1">
                              <Calendar className="w-4 h-4 text-gray-400" />
                              <p className="text-sm text-gray-600">
                                {new Date(sale.date).toLocaleDateString('en-US', {
                                  year: 'numeric',
                                  month: 'short',
                                  day: 'numeric'
                                })}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="text-right ml-4">
                      <div className="flex items-center gap-2 justify-end mb-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${getPaymentStatusColor(sale.payment_status)}`}>
                          <StatusIcon className="w-3 h-3" />
                          {sale.payment_status.toUpperCase()}
                        </span>
                      </div>
                      <p className="text-2xl font-bold text-green-600">
                        ${sale.total.toLocaleString()}
                      </p>
                      {sale.sent_on_whatsapp && (
                        <p className="text-xs text-blue-600 mt-1">✓ Sent on WhatsApp</p>
                      )}
                    </div>
                  </div>

                  {/* Items Table */}
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                          <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700">Item</th>
                          <th className="px-4 py-2 text-right text-xs font-semibold text-gray-700">Quantity</th>
                          <th className="px-4 py-2 text-right text-xs font-semibold text-gray-700">Unit Price</th>
                          <th className="px-4 py-2 text-right text-xs font-semibold text-gray-700">Total</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {sale.items.map((item) => (
                          <tr key={item.id} className="hover:bg-gray-50">
                            <td className="px-4 py-3 text-sm text-gray-800">{item.name}</td>
                            <td className="px-4 py-3 text-sm text-gray-600 text-right">{item.quantity}</td>
                            <td className="px-4 py-3 text-sm text-gray-600 text-right">
                              ${item.unit_price.toLocaleString()}
                            </td>
                            <td className="px-4 py-3 text-sm font-medium text-gray-800 text-right">
                              ${item.total.toLocaleString()}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot className="bg-gray-50 border-t border-gray-200">
                        <tr>
                          <td colSpan={3} className="px-4 py-2 text-sm font-medium text-gray-700 text-right">
                            Subtotal:
                          </td>
                          <td className="px-4 py-2 text-sm font-semibold text-gray-800 text-right">
                            ${sale.subtotal.toLocaleString()}
                          </td>
                        </tr>
                        <tr>
                          <td colSpan={3} className="px-4 py-2 text-sm font-medium text-gray-700 text-right">
                            Tax:
                          </td>
                          <td className="px-4 py-2 text-sm font-semibold text-gray-800 text-right">
                            ${sale.taxes.toLocaleString()}
                          </td>
                        </tr>
                        <tr>
                          <td colSpan={3} className="px-4 py-2 text-sm font-bold text-gray-900 text-right">
                            Total:
                          </td>
                          <td className="px-4 py-2 text-lg font-bold text-green-600 text-right">
                            ${sale.total.toLocaleString()}
                          </td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
