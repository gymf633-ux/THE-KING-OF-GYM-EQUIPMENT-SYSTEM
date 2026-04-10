import React, { useState, useEffect } from 'react';
import { Save, Send, MessageSquare, CheckCircle, XCircle, Info, Link2, RefreshCw, ExternalLink } from 'lucide-react';
import { getMockSettings, updateMockSettings } from '../store/settingsMock';
import { getMockLeads } from '../store/leadsMock';
import { getMockSocialProfiles, syncMockProfile } from '../store/socialProfilesMock';
import { whatsappService, WHATSAPP_TEMPLATES } from '../services/whatsapp';
import { WhatsAppAPI } from '../types/settings';
import { Lead } from '../types/lead';
import { SocialProfile } from '../types/socialProfile';
import { Toast, ToastContainer } from '../components/NotificationToast';

export const WhatsAppPage: React.FC = () => {
  const [settings, setSettings] = useState(getMockSettings());
  const [config, setConfig] = useState<WhatsAppAPI>(settings.whatsapp_api);
  const [testRecipient, setTestRecipient] = useState('');
  const [testMessage, setTestMessage] = useState('Hello! This is a test message from CRM.');
  const [selectedTemplate, setSelectedTemplate] = useState<keyof typeof WHATSAPP_TEMPLATES>('lead_conversion');
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [messageType, setMessageType] = useState<'text' | 'template'>('text');
  const [isSending, setIsSending] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [socialProfiles, setSocialProfiles] = useState<SocialProfile[]>(getMockSocialProfiles());

  const leads = getMockLeads();

  useEffect(() => {
    // Pre-select first lead for template testing
    if (leads.length > 0) {
      setSelectedLead(leads[0]);
      setTestRecipient(leads[0].phone);
    }
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

  const handleSaveSettings = () => {
    const validation = whatsappService.validateConfig(config);
    
    if (!validation.valid) {
      showToast('error', 'Invalid Configuration', validation.errors);
      return;
    }

    updateMockSettings({
      whatsapp_api: config,
    });
    
    setSettings(getMockSettings());
    showToast('success', 'Settings Saved', ['WhatsApp API configuration updated successfully']);
  };

  const handleSendTest = async () => {
    // Validate config
    const validation = whatsappService.validateConfig(config);
    if (!validation.valid) {
      showToast('error', 'Invalid Configuration', validation.errors);
      return;
    }

    // Validate recipient
    if (!testRecipient) {
      showToast('error', 'Missing Recipient', ['Please enter a phone number']);
      return;
    }

    setIsSending(true);

    try {
      let result;

      if (messageType === 'text') {
        // Send simple text message
        result = await whatsappService.sendTextMessage(config, testRecipient, testMessage);
      } else {
        // Send template message
        if (!selectedLead) {
          showToast('error', 'No Lead Selected', ['Please select a lead for template testing']);
          setIsSending(false);
          return;
        }

        const variables = whatsappService.mapTemplateVariables(selectedTemplate, selectedLead);
        result = await whatsappService.sendTemplateMessage(
          config,
          testRecipient,
          selectedTemplate,
          variables
        );
      }

      if (result.success) {
        showToast('success', 'Message Sent!', [
          `Message ID: ${result.messageId}`,
          `Recipient: ${testRecipient}`,
          messageType === 'template' ? `Template: ${selectedTemplate}` : 'Type: Text',
        ]);
      } else {
        showToast('error', 'Send Failed', [
          result.error || 'Unknown error occurred',
          result.details ? JSON.stringify(result.details, null, 2) : '',
        ].filter(Boolean));
      }
    } catch (error) {
      showToast('error', 'Error', [
        error instanceof Error ? error.message : 'Failed to send message',
      ]);
    } finally {
      setIsSending(false);
    }
  };

  const templateConfig = WHATSAPP_TEMPLATES[selectedTemplate];
  const previewVariables = selectedLead ? whatsappService.mapTemplateVariables(selectedTemplate, selectedLead) : [];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-3 mb-2">
            <MessageSquare className="w-8 h-8 text-green-600" />
            <h1 className="text-3xl font-bold text-gray-900">WhatsApp Integration</h1>
          </div>
          <p className="text-sm text-gray-500">
            Configure WhatsApp Cloud API and test message delivery
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* API Configuration */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">API Configuration</h2>
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <div className="flex items-start gap-2">
                <Info className="w-5 h-5 text-blue-600 mt-0.5" />
                <div className="text-sm text-blue-800">
                  <p className="font-medium mb-1">Setup Instructions:</p>
                  <ol className="list-decimal ml-4 space-y-1">
                    <li>Go to Meta for Developers</li>
                    <li>Get temporary token + Phone Number ID</li>
                    <li>Approve templates in Meta Business Manager</li>
                    <li>Save configuration below</li>
                  </ol>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Access Token *
                </label>
                <input
                  type="password"
                  value={config.token}
                  onChange={(e) => setConfig({ ...config, token: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="EAAxxxxxxxxxxxxxx"
                />
                <p className="text-xs text-gray-500 mt-1">From Meta for Developers</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number ID *
                </label>
                <input
                  type="text"
                  value={config.phone_number_id}
                  onChange={(e) => setConfig({ ...config, phone_number_id: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="123456789012345"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Sender ID (Display Number)
                </label>
                <input
                  type="text"
                  value={config.sender_id}
                  onChange={(e) => setConfig({ ...config, sender_id: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="+1234567890"
                />
              </div>

              <button
                onClick={handleSaveSettings}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Save className="w-4 h-4" />
                Save Configuration
              </button>
            </div>
          </div>

          {/* Send Test Message */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Send Test Message</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Message Type
                </label>
                <div className="flex gap-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      checked={messageType === 'text'}
                      onChange={() => setMessageType('text')}
                      className="mr-2"
                    />
                    <span className="text-sm">Text Message</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      checked={messageType === 'template'}
                      onChange={() => setMessageType('template')}
                      className="mr-2"
                    />
                    <span className="text-sm">Template Message</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Recipient Phone Number *
                </label>
                <input
                  type="tel"
                  value={testRecipient}
                  onChange={(e) => setTestRecipient(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="+91 XXXXX XXXXX"
                />
              </div>

              {messageType === 'text' ? (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Message Text *
                  </label>
                  <textarea
                    value={testMessage}
                    onChange={(e) => setTestMessage(e.target.value)}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter your message here..."
                  />
                </div>
              ) : (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Select Template
                    </label>
                    <select
                      value={selectedTemplate}
                      onChange={(e) => setSelectedTemplate(e.target.value as keyof typeof WHATSAPP_TEMPLATES)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="lead_conversion">Lead Conversion</option>
                      <option value="repeat_sale">Repeat Sale</option>
                      <option value="google_review">Google Review</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Select Lead (for data mapping)
                    </label>
                    <select
                      value={selectedLead?.id || ''}
                      onChange={(e) => {
                        const lead = leads.find(l => l.id === Number(e.target.value));
                        setSelectedLead(lead || null);
                        if (lead) setTestRecipient(lead.phone);
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      {leads.map(lead => (
                        <option key={lead.id} value={lead.id}>
                          {lead.name} - {lead.phone}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Template Preview */}
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <p className="text-xs font-medium text-gray-600 mb-2">Template Preview:</p>
                    <p className="text-sm text-gray-800 mb-3">{templateConfig.body}</p>
                    
                    <p className="text-xs font-medium text-gray-600 mb-2">Variable Mapping:</p>
                    <div className="space-y-1">
                      {templateConfig.variables.map((variable, index) => (
                        <div key={variable.key} className="text-xs text-gray-600">
                          <span className="font-medium">{variable.key}</span> = {previewVariables[index] || '(empty)'}
                          <span className="text-gray-400 ml-2">({variable.description})</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}

              <button
                onClick={handleSendTest}
                disabled={isSending}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                <Send className="w-4 h-4" />
                {isSending ? 'Sending...' : 'Send Test Message'}
              </button>
            </div>
          </div>
        </div>

        {/* Available Templates */}
        <div className="mt-6 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Available Templates</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {Object.entries(WHATSAPP_TEMPLATES).map(([key, template]) => (
              <div key={key} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium text-gray-900">{template.name}</h3>
                  <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded">
                    {template.category}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-3">{template.body}</p>
                <div className="space-y-1">
                  {template.variables.map(v => (
                    <p key={v.key} className="text-xs text-gray-500">
                      {v.key} → {v.description}
                    </p>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Social Profiles Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Connected Social Profiles</h2>
              <p className="text-sm text-gray-500 mt-1">
                Manage your social media integrations for WhatsApp messaging
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {socialProfiles.map((profile) => (
              <div
                key={profile.id}
                className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{getPlatformIcon(profile.platform)}</span>
                    <div>
                      <h3 className="font-medium text-gray-900 capitalize">
                        {profile.platform.replace('_', ' ')}
                      </h3>
                      <p className="text-xs text-gray-500">{profile.username || 'Not set'}</p>
                    </div>
                  </div>
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${getStatusColor(profile.status)}`}
                  >
                    {profile.status}
                  </span>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-600">Token:</span>
                    <span className="text-gray-900 font-mono">
                      {profile.access_token ? '•••••••' : 'Not set'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-600">Followers:</span>
                    <span className="text-gray-900 font-semibold">
                      {profile.followers_count?.toLocaleString() || 0}
                    </span>
                  </div>
                  {profile.token_expires_at && (
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-600">Expires:</span>
                      <span className="text-gray-900">
                        {new Date(profile.token_expires_at).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                </div>

                <div className="mt-4 flex gap-2">
                  <button
                    onClick={() => {
                      const success = syncMockProfile(profile.id);
                      if (success) {
                        setSocialProfiles(getMockSocialProfiles());
                        showToast('success', 'Profile Synced', [
                          `${profile.platform} profile updated successfully`,
                        ]);
                      }
                    }}
                    className="flex-1 flex items-center justify-center gap-1 px-3 py-1.5 text-xs font-medium text-blue-700 bg-blue-50 rounded hover:bg-blue-100 transition-colors"
                  >
                    <RefreshCw className="w-3 h-3" />
                    Sync
                  </button>
                  {profile.profile_url && (
                    <a
                      href={profile.profile_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-1 px-3 py-1.5 text-xs font-medium text-gray-700 bg-gray-50 rounded hover:bg-gray-100 transition-colors"
                    >
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>

          {socialProfiles.length === 0 && (
            <div className="text-center py-12">
              <Link2 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-sm font-medium text-gray-900 mb-1">
                No Social Profiles Connected
              </h3>
              <p className="text-sm text-gray-500">
                Connect your social media accounts in Settings to manage them here
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Toast Notifications */}
      <ToastContainer toasts={toasts} onClose={closeToast} />
    </div>
  );

  // Helper functions
  function getPlatformIcon(platform: string) {
    const icons: Record<string, string> = {
      facebook: '📘',
      instagram: '📷',
      linkedin: '💼',
      pinterest: '📌',
      youtube: '▶️',
      google_business: '🏢',
    };
    return icons[platform] || '🔗';
  }

  function getStatusColor(status: string) {
    const colors: Record<string, string> = {
      active: 'bg-green-100 text-green-800',
      expired: 'bg-red-100 text-red-800',
      disconnected: 'bg-gray-100 text-gray-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  }
};
