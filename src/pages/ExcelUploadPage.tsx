import React, { useCallback, useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Upload, FileSpreadsheet, CheckCircle, AlertCircle, Clock,
  BarChart2, FileText, RefreshCw, Info, Lock, Copy, ExternalLink,
} from 'lucide-react';
import { useExcelDashboardStore } from '../store/excelDashboardStore';
import { formatCurrency, formatNumber } from '../utils/dataProcessor';

type CommandMode = 'upload' | 'status' | null;

export const ExcelUploadPage: React.FC = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [commandMode, setCommandMode] = useState<CommandMode>(null);
  const [copied, setCopied] = useState(false);

  const {
    uploadPhase, currentSession, lastSessionId, errorMessage,
    isLockedByOther, getLockInfo, processFile, resetUpload,
    getStatus, navigateToDashboard,
  } = useExcelDashboardStore();

  const locked = isLockedByOther();
  const lockInfo = getLockInfo();
  const statusInfo = getStatus();

  // Auto-navigate to dashboard when confirmed and not in command mode
  useEffect(() => {
    if (uploadPhase === 'confirmed' && currentSession && commandMode === null) {
      // Stay on page to show confirmation
    }
  }, [uploadPhase, currentSession, commandMode]);

  const handleFiles = useCallback((files: FileList | null) => {
    if (!files || files.length === 0) return;
    const file = files[0];
    const ext = file.name.split('.').pop()?.toLowerCase();
    if (!['xlsx', 'xls', 'csv'].includes(ext ?? '')) {
      alert('Please upload an Excel (.xlsx, .xls) or CSV (.csv) file.');
      return;
    }
    processFile(file);
    setCommandMode(null);
  }, [processFile]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    handleFiles(e.dataTransfer.files);
  }, [handleFiles]);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(true);
  };

  const handleDragLeave = () => setDragging(false);

  const handleBrowse = () => fileInputRef.current?.click();

  const dashboardLink = lastSessionId
    ? `${window.location.origin}/excel-dashboard/${lastSessionId}`
    : null;

  const copyLink = () => {
    if (dashboardLink) {
      navigator.clipboard.writeText(dashboardLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleCommandDashboard = () => {
    const path = navigateToDashboard();
    if (path) navigate(path);
  };

  const handleCommandReport = () => {
    const path = navigateToDashboard();
    if (path) navigate(`${path}?action=report`);
  };

  // ─── Command Bar ──────────────────────────────────────────────────────────
  const CommandBar = () => (
    <div className="flex flex-wrap gap-2 mb-6">
      {[
        { cmd: '/-', label: 'New Upload', icon: <Upload className="w-3.5 h-3.5" />, action: () => { resetUpload(); setCommandMode('upload'); } },
        { cmd: '/status', label: 'Last Upload', icon: <Info className="w-3.5 h-3.5" />, action: () => setCommandMode('status') },
        { cmd: '/dashboard', label: 'View Dashboard', icon: <BarChart2 className="w-3.5 h-3.5" />, action: handleCommandDashboard, disabled: !lastSessionId },
        { cmd: '/report', label: 'Download PDF', icon: <FileText className="w-3.5 h-3.5" />, action: handleCommandReport, disabled: !lastSessionId },
      ].map(({ cmd, label, icon, action, disabled }) => (
        <motion.button
          key={cmd}
          whileHover={{ scale: disabled ? 1 : 1.03 }}
          whileTap={{ scale: disabled ? 1 : 0.97 }}
          onClick={disabled ? undefined : action}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
            disabled
              ? 'bg-gray-50 text-gray-300 border-gray-100 cursor-not-allowed'
              : 'bg-white text-gray-700 border-gray-200 hover:border-blue-400 hover:text-blue-700 hover:bg-blue-50 shadow-sm'
          }`}
        >
          {icon}
          <code className="font-mono text-xs">{cmd}</code>
          <span className="text-gray-400">—</span>
          {label}
        </motion.button>
      ))}
    </div>
  );

  // ─── Lock Screen ──────────────────────────────────────────────────────────
  if (locked) {
    const lockedMins = lockInfo
      ? Math.round((Date.now() - lockInfo.lockedAt) / 60000)
      : 0;
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 max-w-md w-full text-center"
        >
          <div className="inline-flex p-3 bg-amber-50 rounded-full mb-4">
            <Lock className="w-8 h-8 text-amber-500" />
          </div>
          <h2 className="text-lg font-bold text-gray-900 mb-2">System In Use</h2>
          <p className="text-sm text-gray-500 mb-4">
            Another user is currently uploading data. The system will be available again shortly.
          </p>
          <p className="text-xs text-gray-400 mb-6">
            Upload started {lockedMins} minute{lockedMins !== 1 ? 's' : ''} ago · auto-expires after 30 min
          </p>
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={() => window.location.reload()}
            className="flex items-center gap-2 mx-auto px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm hover:bg-gray-200 transition-colors"
          >
            <RefreshCw className="w-4 h-4" /> Check Again
          </motion.button>
        </motion.div>
      </div>
    );
  }

  // ─── Main Layout ──────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Excel → Dashboard</h1>
          <p className="text-sm text-gray-500 mt-1">
            Upload a trade/shipment Excel file to generate an interactive Power BI-style dashboard.
          </p>
        </div>

        <CommandBar />

        <AnimatePresence mode="wait">
          {/* ── Status View ── */}
          {commandMode === 'status' && (
            <motion.div
              key="status"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6"
            >
              <h2 className="text-base font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <Info className="w-5 h-5 text-blue-500" /> Last Upload Info
              </h2>
              {statusInfo ? (
                <div className="space-y-3">
                  <Row label="File" value={statusInfo.fileName} />
                  <Row label="Uploaded" value={new Date(statusInfo.uploadedAt).toLocaleString()} />
                  <Row label="Records" value={statusInfo.recordCount.toLocaleString()} />
                  <Row label="Total Qty" value={`${formatNumber(statusInfo.kpi.totalQuantityKg)} kg`} />
                  <Row label="Total Value" value={formatCurrency(statusInfo.kpi.totalValue)} />
                  <Row label="Avg Rate/kg" value={`$${statusInfo.kpi.avgRatePerKg.toFixed(2)}`} />
                  <Row label="Exporters" value={statusInfo.kpi.uniqueExporters.toString()} />
                  {dashboardLink && (
                    <div className="pt-3 border-t border-gray-100">
                      <button
                        onClick={handleCommandDashboard}
                        className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 font-medium"
                      >
                        <ExternalLink className="w-4 h-4" /> View Dashboard
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-sm text-gray-400">No uploads yet in this browser session.</p>
              )}
            </motion.div>
          )}

          {/* ── Idle / Upload Zone ── */}
          {(commandMode === 'upload' || commandMode === null) && uploadPhase === 'idle' && (
            <motion.div
              key="idle"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
            >
              {errorMessage && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-red-500 mt-0.5 shrink-0" />
                  <p className="text-sm text-red-700">{errorMessage}</p>
                </div>
              )}

              <div
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onClick={handleBrowse}
                className={`border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all duration-200 ${
                  dragging
                    ? 'border-blue-400 bg-blue-50 scale-[1.01]'
                    : 'border-gray-300 bg-white hover:border-blue-400 hover:bg-blue-50/30'
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".xlsx,.xls,.csv"
                  className="hidden"
                  onChange={(e) => handleFiles(e.target.files)}
                />
                <motion.div
                  animate={{ scale: dragging ? 1.1 : 1 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                  className="inline-flex p-4 bg-blue-50 rounded-full mb-4"
                >
                  <FileSpreadsheet className="w-10 h-10 text-blue-500" />
                </motion.div>
                <h3 className="text-base font-semibold text-gray-800 mb-1">
                  {dragging ? 'Drop your file here' : 'Drag & Drop your Excel file'}
                </h3>
                <p className="text-sm text-gray-500 mb-4">or click to browse</p>
                <div className="inline-flex gap-2">
                  {['.xlsx', '.xls', '.csv'].map((ext) => (
                    <span key={ext} className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-md font-mono">
                      {ext}
                    </span>
                  ))}
                </div>
              </div>

              <p className="text-xs text-gray-400 text-center mt-3">
                Expected columns: Date, Product, Exporter, Port, Quantity (kg), Rate/kg, Value
              </p>
            </motion.div>
          )}

          {/* ── Uploading ── */}
          {uploadPhase === 'uploading' && (
            <motion.div
              key="uploading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="bg-white rounded-2xl border border-gray-200 shadow-sm p-10 text-center"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                className="inline-flex p-3 bg-blue-50 rounded-full mb-4"
              >
                <Upload className="w-8 h-8 text-blue-500" />
              </motion.div>
              <h3 className="text-base font-semibold text-gray-800 mb-1">Uploading File…</h3>
              <p className="text-sm text-gray-400">Reading spreadsheet data</p>
            </motion.div>
          )}

          {/* ── Processing ── */}
          {uploadPhase === 'processing' && (
            <motion.div
              key="processing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="bg-white rounded-2xl border border-gray-200 shadow-sm p-10 text-center"
            >
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ repeat: Infinity, duration: 1.2 }}
                className="inline-flex p-3 bg-purple-50 rounded-full mb-4"
              >
                <Clock className="w-8 h-8 text-purple-500" />
              </motion.div>
              <h3 className="text-base font-semibold text-gray-800 mb-1">Analyzing Data…</h3>
              <p className="text-sm text-gray-400">Computing KPIs and building charts</p>
            </motion.div>
          )}

          {/* ── Confirmed ── */}
          {uploadPhase === 'confirmed' && currentSession && (
            <motion.div
              key="confirmed"
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6"
            >
              <div className="flex items-center gap-3 mb-5">
                <div className="p-2 bg-green-50 rounded-full">
                  <CheckCircle className="w-7 h-7 text-green-500" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-gray-900">Processing Complete!</h3>
                  <p className="text-xs text-gray-400">{currentSession.fileName}</p>
                </div>
              </div>

              {/* Mini KPI grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-5">
                {[
                  { label: 'Records', value: currentSession.kpi.totalRecords.toLocaleString() },
                  { label: 'Qty (kg)', value: formatNumber(currentSession.kpi.totalQuantityKg) },
                  { label: 'Total Value', value: formatCurrency(currentSession.kpi.totalValue) },
                  { label: 'Avg Rate/kg', value: `$${currentSession.kpi.avgRatePerKg.toFixed(2)}` },
                  { label: 'Exporters', value: currentSession.kpi.uniqueExporters.toString() },
                ].map(({ label, value }) => (
                  <div key={label} className="bg-gray-50 rounded-xl p-3">
                    <p className="text-xs text-gray-400">{label}</p>
                    <p className="text-lg font-bold text-gray-800">{value}</p>
                  </div>
                ))}
              </div>

              {/* Shareable link */}
              {dashboardLink && (
                <div className="mb-4 p-3 bg-blue-50 rounded-xl border border-blue-100">
                  <p className="text-xs font-medium text-blue-700 mb-1.5">Shareable Dashboard Link</p>
                  <div className="flex items-center gap-2">
                    <code className="text-xs text-blue-600 flex-1 truncate">{dashboardLink}</code>
                    <button
                      onClick={copyLink}
                      className="shrink-0 flex items-center gap-1 px-2 py-1 bg-white border border-blue-200 rounded-md text-xs text-blue-700 hover:bg-blue-100 transition-colors"
                    >
                      <Copy className="w-3 h-3" />
                      {copied ? 'Copied!' : 'Copy'}
                    </button>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-3 flex-wrap">
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={() => navigate(`/excel-dashboard/${currentSession.id}`)}
                  className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 transition-colors shadow-sm"
                >
                  <BarChart2 className="w-4 h-4" /> View Dashboard
                </motion.button>
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={resetUpload}
                  className="flex items-center gap-2 px-4 py-2.5 bg-gray-100 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-200 transition-colors"
                >
                  <Upload className="w-4 h-4" /> Upload Another
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

const Row: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div className="flex justify-between items-center py-1.5 border-b border-gray-50">
    <span className="text-xs text-gray-400 font-medium">{label}</span>
    <span className="text-xs text-gray-800 font-semibold">{value}</span>
  </div>
);

export default ExcelUploadPage;
