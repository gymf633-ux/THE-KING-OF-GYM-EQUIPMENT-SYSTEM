import React, { useState, useMemo, useEffect } from 'react';
import { Plus, Search, Filter } from 'lucide-react';
import { Lead, LeadStatus, LeadSource, CreateLeadInput } from '../types/lead';
import { LeadCard } from '../components/leads/LeadCard';
import { LeadModal } from '../components/leads/LeadModal';
import { WhatsAppModal, ReminderModal } from '../components/leads/ActionModals';
import { ToastContainer, Toast } from '../components/NotificationToast';
import { getMockLeads } from '../store/leadsMock';
import { getMockReminders } from '../store/remindersMock';
import { automationService, applyLeadDefaults } from '../services/automations';

export const LeadsList: React.FC = () => {
  const [leads, setLeads] = useState<Lead[]>(getMockLeads());
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<LeadStatus | 'all'>('all');
  const [sourceFilter, setSourceFilter] = useState<LeadSource | 'all'>('all');
  const [assigneeFilter, setAssigneeFilter] = useState<string>('all');
  const [toasts, setToasts] = useState<Toast[]>([]);
  
  // Modal states
  const [isLeadModalOpen, setIsLeadModalOpen] = useState(false);
  const [isWhatsAppModalOpen, setIsWhatsAppModalOpen] = useState(false);
  const [isReminderModalOpen, setIsReminderModalOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);

  // Initialize automation service
  useEffect(() => {
    automationService.initialize(getMockReminders());
  }, []);

  // Get unique assignees for filter
  const assignees = useMemo(() => {
    const uniqueAssignees = new Set(
      leads.map(lead => lead.assigned_to).filter((a): a is string => !!a)
    );
    return Array.from(uniqueAssignees);
  }, [leads]);

  // Filter leads
  const filteredLeads = useMemo(() => {
    return leads.filter(lead => {
      const matchesSearch = 
        lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.phone.includes(searchTerm) ||
        (lead.interest_category?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false);
      
      const matchesStatus = statusFilter === 'all' || lead.status === statusFilter;
      const matchesSource = sourceFilter === 'all' || lead.source === sourceFilter;
      const matchesAssignee = assigneeFilter === 'all' || lead.assigned_to === assigneeFilter;

      return matchesSearch && matchesStatus && matchesSource && matchesAssignee;
    });
  }, [leads, searchTerm, statusFilter, sourceFilter, assigneeFilter]);

  // Stats
  const stats = useMemo(() => {
    return {
      total: leads.length,
      new: leads.filter(l => l.status === 'new').length,
      hot: leads.filter(l => l.status === 'hot').length,
      won: leads.filter(l => l.status === 'won').length,
    };
  }, [leads]);

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

  const handleAddLead = () => {
    setSelectedLead(null);
    setIsLeadModalOpen(true);
  };

  const handleEditLead = (lead: Lead) => {
    setSelectedLead(lead);
    setIsLeadModalOpen(true);
  };

  const handleSaveLead = async (leadData: CreateLeadInput | Lead) => {
    if ('id' in leadData) {
      // Edit existing lead - check for status change
      const oldLead = leads.find(l => l.id === leadData.id);
      const updatedLead = { ...leadData, updated_at: new Date().toISOString() };
      
      setLeads(leads.map(l => l.id === leadData.id ? updatedLead : l));

      // Trigger automation for status change
      if (oldLead && oldLead.status !== leadData.status) {
        const result = await automationService.processEvent({
          type: 'LEAD_STATUS_CHANGED',
          payload: {
            lead: updatedLead,
            oldStatus: oldLead.status,
            newStatus: leadData.status,
          },
        });

        if (result.notifications && result.notifications.length > 0) {
          showToast('success', 'Automation Triggered', result.notifications);
        }
      }
    } else {
      // Add new lead with automation defaults
      const leadWithDefaults = applyLeadDefaults(leadData);
      
      const newLead: Lead = {
        ...leadWithDefaults,
        id: Math.max(...leads.map(l => l.id)) + 1,
        status: leadWithDefaults.status || 'new',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      
      setLeads([newLead, ...leads]);

      // Trigger automation for lead creation
      const result = await automationService.processEvent({
        type: 'LEAD_CREATED',
        payload: newLead,
      });

      if (result.notifications && result.notifications.length > 0) {
        showToast('success', 'Lead Created & Automation Triggered', result.notifications);
      }
    }
  };

  const handleSendWhatsApp = (lead: Lead) => {
    setSelectedLead(lead);
    setIsWhatsAppModalOpen(true);
  };

  const handleCreateReminder = (lead: Lead) => {
    setSelectedLead(lead);
    setIsReminderModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Leads</h1>
              <p className="mt-1 text-sm text-gray-500">
                Manage and track your sales leads
              </p>
            </div>
            <button
              onClick={handleAddLead}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-5 h-5" />
              Add Lead
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-600">Total Leads</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <div className="bg-blue-50 rounded-lg p-4">
              <p className="text-sm text-blue-600">New</p>
              <p className="text-2xl font-bold text-blue-700">{stats.new}</p>
            </div>
            <div className="bg-orange-50 rounded-lg p-4">
              <p className="text-sm text-orange-600">Hot</p>
              <p className="text-2xl font-bold text-orange-700">{stats.hot}</p>
            </div>
            <div className="bg-green-50 rounded-lg p-4">
              <p className="text-sm text-green-600">Won</p>
              <p className="text-2xl font-bold text-green-700">{stats.won}</p>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search leads by name, phone, or interest..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div className="flex gap-2">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as LeadStatus | 'all')}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Status</option>
                <option value="new">New</option>
                <option value="warm">Warm</option>
                <option value="hot">Hot</option>
                <option value="won">Won</option>
                <option value="lost">Lost</option>
              </select>

              <select
                value={sourceFilter}
                onChange={(e) => setSourceFilter(e.target.value as LeadSource | 'all')}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Sources</option>
                <option value="call">Call</option>
                <option value="gbp">Google Business</option>
                <option value="instagram">Instagram</option>
                <option value="manual">Manual</option>
              </select>

              <select
                value={assigneeFilter}
                onChange={(e) => setAssigneeFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Assignees</option>
                {assignees.map(assignee => (
                  <option key={assignee} value={assignee}>{assignee}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Leads Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {filteredLeads.length === 0 ? (
          <div className="text-center py-12">
            <Filter className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No leads found</h3>
            <p className="text-gray-500">
              {searchTerm || statusFilter !== 'all' || sourceFilter !== 'all' || assigneeFilter !== 'all'
                ? 'Try adjusting your filters or search term'
                : 'Get started by adding your first lead'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredLeads.map(lead => (
              <LeadCard
                key={lead.id}
                lead={lead}
                onEdit={handleEditLead}
                onSendWhatsApp={handleSendWhatsApp}
                onCreateReminder={handleCreateReminder}
              />
            ))}
          </div>
        )}
      </div>

      {/* Modals */}
      <LeadModal
        isOpen={isLeadModalOpen}
        onClose={() => setIsLeadModalOpen(false)}
        onSave={handleSaveLead}
        lead={selectedLead}
      />

      <WhatsAppModal
        isOpen={isWhatsAppModalOpen}
        onClose={() => setIsWhatsAppModalOpen(false)}
        lead={selectedLead}
      />

      <ReminderModal
        isOpen={isReminderModalOpen}
        onClose={() => setIsReminderModalOpen(false)}
        lead={selectedLead}
      />

      {/* Toast Notifications */}
      <ToastContainer toasts={toasts} onClose={closeToast} />
    </div>
  );
};
