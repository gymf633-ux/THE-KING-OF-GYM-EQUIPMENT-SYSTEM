import React from 'react';
import { Lead, LeadStatus } from '../../types/lead';
import { Phone, Calendar, MessageSquare, Bell, User, Edit } from 'lucide-react';

interface LeadCardProps {
  lead: Lead;
  onEdit: (lead: Lead) => void;
  onSendWhatsApp: (lead: Lead) => void;
  onCreateReminder: (lead: Lead) => void;
}

const statusColors: Record<LeadStatus, string> = {
  new: 'bg-blue-100 text-blue-800',
  warm: 'bg-yellow-100 text-yellow-800',
  hot: 'bg-orange-100 text-orange-800',
  won: 'bg-green-100 text-green-800',
  lost: 'bg-gray-100 text-gray-800',
};

const sourceLabels: Record<string, string> = {
  call: 'Call',
  gbp: 'Google Business',
  instagram: 'Instagram',
  manual: 'Manual Entry',
};

export const LeadCard: React.FC<LeadCardProps> = ({
  lead,
  onEdit,
  onSendWhatsApp,
  onCreateReminder,
}) => {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-lg font-semibold text-gray-900">{lead.name}</h3>
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusColors[lead.status]}`}>
              {lead.status.toUpperCase()}
            </span>
          </div>
          <div className="flex items-center text-sm text-gray-600 gap-4">
            <div className="flex items-center gap-1">
              <Phone className="w-4 h-4" />
              <span>{lead.phone}</span>
            </div>
            <span className="text-gray-400">•</span>
            <span>{sourceLabels[lead.source]}</span>
          </div>
        </div>
        <button
          onClick={() => onEdit(lead)}
          className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          title="Edit Lead"
        >
          <Edit className="w-4 h-4" />
        </button>
      </div>

      {(lead.interest_category || lead.assigned_to) && (
        <div className="mb-3 space-y-1">
          {lead.interest_category && (
            <p className="text-sm text-gray-600">
              <span className="font-medium">Interest:</span> {lead.interest_category}
            </p>
          )}
          {lead.assigned_to && (
            <div className="flex items-center gap-1 text-sm text-gray-600">
              <User className="w-4 h-4" />
              <span className="font-medium">Assigned to:</span> {lead.assigned_to}
            </div>
          )}
        </div>
      )}

      {lead.notes && (
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">{lead.notes}</p>
      )}

      {(lead.last_contact_at || lead.next_followup_at) && (
        <div className="flex items-center gap-4 text-xs text-gray-500 mb-3">
          {lead.last_contact_at && (
            <div className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              <span>Last: {new Date(lead.last_contact_at).toLocaleDateString()}</span>
            </div>
          )}
          {lead.next_followup_at && (
            <div className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              <span>Next: {new Date(lead.next_followup_at).toLocaleDateString()}</span>
            </div>
          )}
        </div>
      )}

      <div className="flex gap-2 pt-3 border-t border-gray-100">
        <button
          onClick={() => onSendWhatsApp(lead)}
          className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-lg transition-colors"
        >
          <MessageSquare className="w-4 h-4" />
          Send WA
        </button>
        <button
          onClick={() => onCreateReminder(lead)}
          className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
        >
          <Bell className="w-4 h-4" />
          Reminder
        </button>
      </div>
    </div>
  );
};
