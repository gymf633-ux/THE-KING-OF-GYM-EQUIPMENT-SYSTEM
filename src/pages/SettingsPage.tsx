import React, { useState } from 'react';
import { Settings, Building2, Link2, CheckCircle, AlertCircle, RefreshCw, ExternalLink, Calendar } from 'lucide-react';
import { getMockSocialProfiles, syncMockProfile, updateMockSocialProfile, getMockExpiredProfiles } from '../store/socialProfilesMock';
import { getMockCompanyDetails, updateMockCompanyDetails } from '../store/companyMock';
import { checkExpiredTokens, syncAllSocialProfiles } from '../services/integrations';
import { GBPCredentialsCard } from '../components/settings/GBPCredentialsCard';
import type { SocialProfile, CompanyDetails } from '../types/socialProfile';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<'company' | 'social' | 'integrations' | 'gbp'>('company');
  const [socialProfiles, setSocialProfiles] = useState<SocialProfile[]>(getMockSocialProfiles());
  const [companyDetails, setCompanyDetails] = useState<CompanyDetails>(getMockCompanyDetails());
  const [isSyncing, setIsSyncing] = useState(false);
  const [editingCompany, setEditingCompany] = useState(false);

  const handleSyncAll = async () => {
    setIsSyncing(true);
    try {
      await syncAllSocialProfiles();
      setSocialProfiles(getMockSocialProfiles());
      alert('✅ All social profiles synced successfully!');
    } catch (error) {
      alert('❌ Failed to sync profiles. Please try again.');
    } finally {
      setIsSyncing(false);
    }
  };

  const handleSyncSingle = async (profileId: string) => {
    const success = syncMockProfile(profileId);
    if (success) {
      setSocialProfiles(getMockSocialProfiles());
      alert('✅ Profile synced successfully!');
    }
  };

  const handleToggleStatus = (profileId: string) => {
    const profile = socialProfiles.find(p => p.id === profileId);
    if (!profile) return;

    const newStatus = profile.status === 'active' ? 'disconnected' : 'active';
    updateMockSocialProfile(profileId, { status: newStatus });
    setSocialProfiles(getMockSocialProfiles());
  };

  const handleCheckTokens = () => {
    const expiring = checkExpiredTokens();
    if (expiring.length > 0) {
      alert(`⚠️ ${expiring.length} token(s) expiring soon:\n${expiring.map(p => p.platform).join(', ')}`);
    } else {
      alert('✅ All tokens are valid!');
    }
  };

  const handleSaveCompany = () => {
    updateMockCompanyDetails(companyDetails);
    setEditingCompany(false);
    alert('✅ Company details saved!');
  };

  const getPlatformIcon = (platform: string) => {
    const icons: Record<string, string> = {
      facebook: '📘',
      instagram: '📷',
      linkedin: '💼',
      pinterest: '📌',
      youtube: '▶️',
      google_business: '🏢'
    };
    return icons[platform] || '🔗';
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      active: 'bg-green-100 text-green-800',
      expired: 'bg-red-100 text-red-800',
      disconnected: 'bg-gray-100 text-gray-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <Settings className="w-8 h-8 text-blue-600" />
            Settings
          </h1>
          <p className="text-gray-600 mt-1">Manage company details and social integrations</p>
        </div>
        
        <button
          onClick={handleCheckTokens}
          className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors flex items-center gap-2"
        >
          <AlertCircle className="w-5 h-5" />
          Check Tokens
        </button>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <div className="flex space-x-8">
          <button
            onClick={() => setActiveTab('company')}
            className={`pb-4 px-2 border-b-2 font-medium transition-colors ${
              activeTab === 'company'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <Building2 className="w-5 h-5 inline-block mr-2" />
            Company Details
          </button>
          
          <button
            onClick={() => setActiveTab('social')}
            className={`pb-4 px-2 border-b-2 font-medium transition-colors ${
              activeTab === 'social'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <Link2 className="w-5 h-5 inline-block mr-2" />
            Social Profiles
          </button>
          
          <button
            onClick={() => setActiveTab('integrations')}
            className={`pb-4 px-2 border-b-2 font-medium transition-colors ${
              activeTab === 'integrations'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <RefreshCw className="w-5 h-5 inline-block mr-2" />
            API Integrations
          </button>
          
          <button
            onClick={() => setActiveTab('gbp')}
            className={`pb-4 px-2 border-b-2 font-medium transition-colors ${
              activeTab === 'gbp'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            🏢 <span className="ml-2">GBP Credentials</span>
          </button>
        </div>
      </div>

      {/* Company Details Tab */}
      {activeTab === 'company' && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Company Information</h2>
            {!editingCompany ? (
              <button
                onClick={() => setEditingCompany(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Edit Details
              </button>
            ) : (
              <div className="flex gap-2">
                <button
                  onClick={handleSaveCompany}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  Save
                </button>
                <button
                  onClick={() => {
                    setEditingCompany(false);
                    setCompanyDetails(getMockCompanyDetails());
                  }}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Company Name</label>
              <input
                type="text"
                value={companyDetails.company_name}
                onChange={(e) => setCompanyDetails({ ...companyDetails, company_name: e.target.value })}
                disabled={!editingCompany}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
              <input
                type="text"
                value={companyDetails.phone}
                onChange={(e) => setCompanyDetails({ ...companyDetails, phone: e.target.value })}
                disabled={!editingCompany}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <input
                type="email"
                value={companyDetails.email}
                onChange={(e) => setCompanyDetails({ ...companyDetails, email: e.target.value })}
                disabled={!editingCompany}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">GST Number</label>
              <input
                type="text"
                value={companyDetails.gst_number || ''}
                onChange={(e) => setCompanyDetails({ ...companyDetails, gst_number: e.target.value })}
                disabled={!editingCompany}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
              <textarea
                value={companyDetails.address}
                onChange={(e) => setCompanyDetails({ ...companyDetails, address: e.target.value })}
                disabled={!editingCompany}
                rows={2}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Primary Website</label>
              <input
                type="url"
                value={companyDetails.website_primary}
                onChange={(e) => setCompanyDetails({ ...companyDetails, website_primary: e.target.value })}
                disabled={!editingCompany}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Secondary Website</label>
              <input
                type="url"
                value={companyDetails.website_secondary || ''}
                onChange={(e) => setCompanyDetails({ ...companyDetails, website_secondary: e.target.value })}
                disabled={!editingCompany}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
              />
            </div>
          </div>
        </div>
      )}

      {/* Social Profiles Tab */}
      {activeTab === 'social' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between mb-4">
            <p className="text-gray-600">Manage your social media connections</p>
            <button
              onClick={handleSyncAll}
              disabled={isSyncing}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 disabled:opacity-50"
            >
              <RefreshCw className={`w-5 h-5 ${isSyncing ? 'animate-spin' : ''}`} />
              {isSyncing ? 'Syncing...' : 'Sync All'}
            </button>
          </div>

          {socialProfiles.map((profile) => (
            <div
              key={profile.id}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4 flex-1">
                  <div className="text-4xl">{getPlatformIcon(profile.platform)}</div>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900 capitalize">
                        {profile.platform.replace('_', ' ')}
                      </h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(profile.status)}`}>
                        {profile.status}
                      </span>
                    </div>

                    {profile.profile_name && (
                      <p className="text-gray-700 mb-2">{profile.profile_name}</p>
                    )}

                    <a
                      href={profile.profile_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 text-sm flex items-center gap-1 mb-2"
                    >
                      {profile.profile_url}
                      <ExternalLink className="w-3 h-3" />
                    </a>

                    <div className="flex items-center gap-4 text-sm text-gray-600 mt-3">
                      {profile.follower_count && (
                        <span>👥 {profile.follower_count.toLocaleString()} followers</span>
                      )}
                      {profile.last_synced && (
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          Last synced: {profile.last_synced}
                        </span>
                      )}
                      {profile.token_expiry && (
                        <span className="flex items-center gap-1">
                          <AlertCircle className="w-4 h-4" />
                          Token expires: {profile.token_expiry}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => handleToggleStatus(profile.id)}
                    className={`px-4 py-2 rounded-lg transition-colors ${
                      profile.status === 'active'
                        ? 'bg-red-100 text-red-700 hover:bg-red-200'
                        : 'bg-green-100 text-green-700 hover:bg-green-200'
                    }`}
                  >
                    {profile.status === 'active' ? 'Disconnect' : 'Connect'}
                  </button>
                  
                  {profile.status === 'active' && (
                    <button
                      onClick={() => handleSyncSingle(profile.id)}
                      className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors flex items-center gap-2"
                    >
                      <RefreshCw className="w-4 h-4" />
                      Sync
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Integrations Tab */}
      {activeTab === 'integrations' && (
        <div className="space-y-6">
          {/* WhatsApp Integration */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  💬 WhatsApp Cloud API
                  <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                    Connected
                  </span>
                </h3>
                <p className="text-sm text-gray-600 mt-1">Auto-reply with ChatGPT-5 | Lead capture enabled</p>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 space-y-2 text-sm">
              <p><strong>Business Phone:</strong> 7228800146</p>
              <p><strong>Webhook URL:</strong> https://backend.youware.com/webhooks/whatsapp</p>
              <p><strong>AI Model:</strong> ChatGPT-5 (openai-gpt-5)</p>
              <p><strong>24-hour rule:</strong> Enabled (Free-form replies within 24h, templates after)</p>
              <div className="mt-3">
                <p className="font-medium mb-1">Approved Templates:</p>
                <ul className="list-disc list-inside text-gray-600 ml-2">
                  <li>quotation_followup</li>
                  <li>invoice_due</li>
                  <li>payment_thanks</li>
                  <li>amc_renewal</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Daily AI Post */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  🤖 Daily AI Post Generator
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                    Scheduled
                  </span>
                </h3>
                <p className="text-sm text-gray-600 mt-1">Auto-generate and publish to all platforms | Daily 10:00 IST</p>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 space-y-2 text-sm">
              <p><strong>AI Model:</strong> GPT-4o (openai-gpt-4o)</p>
              <p><strong>Schedule:</strong> Daily at 10:00 AM IST</p>
              <p><strong>Content:</strong> 100-140 words + 3 hashtags + 1 CTA</p>
              <p><strong>Active Platforms:</strong> Facebook, Instagram, LinkedIn</p>
              <p><strong>Images:</strong> Project photos with logo watermark</p>
              <p className="mt-3 text-yellow-700">⚠️ Token refresh automation: Pending implementation</p>
            </div>
          </div>

          {/* Google Business Profile */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  🏢 Google Business Profile
                  <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                    Active
                  </span>
                </h3>
                <p className="text-sm text-gray-600 mt-1">Review link integration | Business info sync</p>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 space-y-2 text-sm">
              <p><strong>Profile URL:</strong> https://g.page/thekingofgymequipment</p>
              <p><strong>Review Collection:</strong> Enabled</p>
              <p><strong>Business Hours:</strong> Synced</p>
              <p><strong>Location:</strong> Mumbai, Maharashtra, India</p>
            </div>
          </div>

          {/* Implementation Notes */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
            <h4 className="font-semibold text-yellow-900 mb-2">📝 Implementation Notes</h4>
            <ul className="text-sm text-yellow-800 space-y-1 list-disc list-inside">
              <li>Current implementation uses mock data and simulated API calls</li>
              <li>Replace with actual Meta/LinkedIn/Pinterest API integrations</li>
              <li>Set up Cloudflare Workers for WhatsApp webhook endpoint</li>
              <li>Implement token refresh automation before expiry</li>
              <li>Configure cron job for daily post scheduling</li>
              <li>Add error handling and retry logic for API failures</li>
              <li>See <code>src/services/integrations.ts</code> for TODOs</li>
            </ul>
          </div>
        </div>
      )}

      {/* GBP Credentials Tab */}
      {activeTab === 'gbp' && (
        <GBPCredentialsCard />
      )}
    </div>
  );
}
