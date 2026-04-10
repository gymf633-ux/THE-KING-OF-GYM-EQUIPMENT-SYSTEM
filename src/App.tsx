import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { MainLayout } from './layouts/MainLayout';
import { Dashboard } from './pages/Dashboard';
import { LeadsList } from './pages/LeadsList';
import { WhatsAppPage } from './pages/WhatsAppPage';
import { InvoicePage } from './pages/InvoicePage';
import ReviewsPage from './pages/ReviewsPage';
import SettingsPage from './pages/SettingsPage';
import InstallPage from './pages/InstallPage';
import { GBPOptimizerPage } from './pages/GBPOptimizerPage';
import { CampaignsPage } from './pages/CampaignsPage';
import { SalesPage } from './pages/SalesPage';
import { SystemUpdateNotification } from './components/SystemUpdateNotification';
import { ExcelUploadPage } from './pages/ExcelUploadPage';
import { ExcelDashboardPage } from './pages/ExcelDashboardPage';

function App() {
  return (
    <BrowserRouter>
      <SystemUpdateNotification />
      <Routes>
        {/* Main App Routes (with layout and sidebar) */}
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="leads" element={<LeadsList />} />
          <Route path="install" element={<InstallPage />} />
          {/* Placeholder routes for other pages */}
          <Route path="campaigns" element={<CampaignsPage />} />
          <Route path="whatsapp" element={<WhatsAppPage />} />
          <Route path="sales" element={<SalesPage />} />
          <Route path="invoices" element={<InvoicePage />} />
          <Route path="reviews" element={<ReviewsPage />} />
          <Route path="gbp" element={<GBPOptimizerPage />} />
          <Route path="projects" element={<div className="p-8">Projects - Coming Soon</div>} />
          <Route path="reminders" element={<div className="p-8">Reminders - Coming Soon</div>} />
          <Route path="staff" element={<div className="p-8">Staff - Coming Soon</div>} />
          <Route path="settings" element={<SettingsPage />} />
          <Route path="reports" element={<div className="p-8">Reports - Coming Soon</div>} />
          <Route path="excel-upload" element={<ExcelUploadPage />} />
          <Route path="excel-dashboard/:id" element={<ExcelDashboardPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
