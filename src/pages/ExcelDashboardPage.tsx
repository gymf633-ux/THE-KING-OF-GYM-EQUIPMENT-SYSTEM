import React, { useMemo, useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft, Download, Share2, Copy, CheckCheck, Filter, X,
} from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

import { useExcelDashboardStore } from '../store/excelDashboardStore';
import { DashboardSession } from '../types/tradeData';
import {
  filterRecords, getUniqueYears, getUniqueProducts,
  groupByMonth, groupByYear, groupByProduct,
  groupByExporter, groupByPort, avgRateByMonth, computeKPIs,
} from '../utils/dataProcessor';

import { KPISummaryCards } from '../components/charts/KPISummaryCards';
import { MonthlyTrendChart } from '../components/charts/MonthlyTrendChart';
import { YearOnYearChart } from '../components/charts/YearOnYearChart';
import { ProductDonutChart } from '../components/charts/ProductDonutChart';
import { ExporterComparisonChart } from '../components/charts/ExporterComparisonChart';
import { TopPortsChart } from '../components/charts/TopPortsChart';
import { AvgRateChart } from '../components/charts/AvgRateChart';

export const ExcelDashboardPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const dashboardRef = useRef<HTMLDivElement>(null);

  const { loadSession } = useExcelDashboardStore();
  const [session, setSession] = useState<DashboardSession | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [copied, setCopied] = useState(false);
  const [pdfGenerating, setPdfGenerating] = useState(false);

  // Filters
  const [yearFilter, setYearFilter] = useState<string>('');
  const [productFilter, setProductFilter] = useState<string>('');

  useEffect(() => {
    if (!id) { setNotFound(true); return; }
    const s = loadSession(id);
    if (s) {
      setSession(s);
    } else {
      setNotFound(true);
    }
  }, [id, loadSession]);

  // Auto-trigger PDF if ?action=report
  useEffect(() => {
    if (session && searchParams.get('action') === 'report') {
      setTimeout(() => handleDownloadPDF(), 800);
    }
  }, [session, searchParams]);

  const years = useMemo(() => session ? getUniqueYears(session.data) : [], [session]);
  const products = useMemo(() => session ? getUniqueProducts(session.data) : [], [session]);

  const filtered = useMemo(() => {
    if (!session) return [];
    return filterRecords(session.data, yearFilter || null, productFilter || null);
  }, [session, yearFilter, productFilter]);

  const kpi = useMemo(() => computeKPIs(filtered), [filtered]);
  const monthly = useMemo(() => groupByMonth(filtered), [filtered]);
  const yearly = useMemo(() => groupByYear(filtered), [filtered]);
  const byProduct = useMemo(() => groupByProduct(filtered), [filtered]);
  const byExporter = useMemo(() => groupByExporter(filtered), [filtered]);
  const byPort = useMemo(() => groupByPort(filtered), [filtered]);
  const rateByMonth = useMemo(() => avgRateByMonth(filtered), [filtered]);

  const shareUrl = id ? `${window.location.origin}/excel-dashboard/${id}` : '';

  const copyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadPDF = async () => {
    if (!dashboardRef.current || pdfGenerating) return;
    setPdfGenerating(true);
    try {
      const canvas = await html2canvas(dashboardRef.current, {
        scale: 1.5,
        useCORS: true,
        backgroundColor: '#f9fafb',
      });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({ orientation: 'landscape', unit: 'px', format: 'a4' });
      const pdfW = pdf.internal.pageSize.getWidth();
      const pdfH = pdf.internal.pageSize.getHeight();
      const ratio = canvas.height / canvas.width;
      const imgH = pdfW * ratio;

      let y = 0;
      let remaining = imgH;
      while (remaining > 0) {
        if (y > 0) pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, -y, pdfW, imgH);
        y += pdfH;
        remaining -= pdfH;
      }

      const fileName = session?.fileName.replace(/\.[^/.]+$/, '') ?? 'dashboard';
      pdf.save(`${fileName}-dashboard.pdf`);
    } finally {
      setPdfGenerating(false);
    }
  };

  const activeFilters = [
    yearFilter && { label: `Year: ${yearFilter}`, clear: () => setYearFilter('') },
    productFilter && { label: `Product: ${productFilter}`, clear: () => setProductFilter('') },
  ].filter(Boolean) as { label: string; clear: () => void }[];

  // ─── Not Found ────────────────────────────────────────────────────────────
  if (notFound) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="text-center max-w-md">
          <div className="text-5xl mb-4">📊</div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Dashboard Not Found</h2>
          <p className="text-sm text-gray-500 mb-6">
            This dashboard link may have expired or the data was cleared from this browser.
          </p>
          <button
            onClick={() => navigate('/excel-upload')}
            className="px-5 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 transition-colors"
          >
            Upload New File
          </button>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-pulse text-gray-400 text-sm">Loading dashboard…</div>
      </div>
    );
  }

  // ─── Dashboard ────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sticky Header */}
      <div className="sticky top-0 z-20 bg-white border-b border-gray-200 px-6 py-3 flex items-center gap-4 shadow-sm">
        <button
          onClick={() => navigate('/excel-upload')}
          className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>

        <div className="flex-1 min-w-0">
          <h1 className="text-sm font-bold text-gray-900 truncate">{session.fileName}</h1>
          <p className="text-xs text-gray-400">
            Uploaded {new Date(session.uploadedAt).toLocaleString()} · {session.data.length.toLocaleString()} records
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={copyLink}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 border border-gray-200 text-gray-600 rounded-lg text-xs hover:bg-gray-100 transition-colors"
          >
            {copied ? <CheckCheck className="w-3.5 h-3.5 text-green-500" /> : <Share2 className="w-3.5 h-3.5" />}
            {copied ? 'Copied!' : 'Share'}
          </button>
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={handleDownloadPDF}
            disabled={pdfGenerating}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-semibold hover:bg-blue-700 transition-colors disabled:opacity-60"
          >
            <Download className="w-3.5 h-3.5" />
            {pdfGenerating ? 'Generating…' : 'PDF'}
          </motion.button>
        </div>
      </div>

      {/* Dashboard Content */}
      <div ref={dashboardRef} id="dashboard-root" className="p-6 space-y-6 max-w-7xl mx-auto">

        {/* Filter Bar */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 flex flex-wrap items-center gap-3">
          <Filter className="w-4 h-4 text-gray-400 shrink-0" />
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Filters</span>

          <select
            value={yearFilter}
            onChange={(e) => setYearFilter(e.target.value)}
            className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-300"
          >
            <option value="">All Years</option>
            {years.map((y) => <option key={y} value={y}>{y}</option>)}
          </select>

          <select
            value={productFilter}
            onChange={(e) => setProductFilter(e.target.value)}
            className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-300"
          >
            <option value="">All Products</option>
            {products.map((p) => <option key={p} value={p}>{p}</option>)}
          </select>

          {activeFilters.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {activeFilters.map((f) => (
                <span
                  key={f.label}
                  className="flex items-center gap-1.5 px-2.5 py-1 bg-blue-50 border border-blue-200 text-blue-700 text-xs rounded-full"
                >
                  {f.label}
                  <button onClick={f.clear} className="hover:text-blue-900">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
              <button
                onClick={() => { setYearFilter(''); setProductFilter(''); }}
                className="text-xs text-gray-400 hover:text-gray-600 underline"
              >
                Reset all
              </button>
            </div>
          )}

          <span className="ml-auto text-xs text-gray-400">
            {filtered.length.toLocaleString()} / {session.data.length.toLocaleString()} rows
          </span>
        </div>

        {/* KPI Cards */}
        <KPISummaryCards kpi={kpi} />

        {/* Row 1: Monthly Trend + Product Donut */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <MonthlyTrendChart data={monthly} />
          </div>
          <div>
            <ProductDonutChart data={byProduct} />
          </div>
        </div>

        {/* Row 2: Year-on-Year + Exporter Comparison */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <YearOnYearChart data={yearly} />
          <ExporterComparisonChart data={byExporter} />
        </div>

        {/* Row 3: Top Ports + Avg Rate Trend */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <TopPortsChart data={byPort} />
          <AvgRateChart data={rateByMonth} />
        </div>

        {/* Footer */}
        <div className="text-center text-xs text-gray-300 py-4">
          Generated from {session.fileName} · The King of Gym Equipment System
        </div>
      </div>
    </div>
  );
};

export default ExcelDashboardPage;
