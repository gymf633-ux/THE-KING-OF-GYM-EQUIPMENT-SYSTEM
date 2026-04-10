import React from 'react';
import { Smartphone, Apple, Globe, Download, ExternalLink, CheckCircle, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const InstallPage: React.FC = () => {
  const navigate = useNavigate();
  const handleAndroidInstall = () => {
    // Mock Android installation - can be APK download or Play Store redirect
    const playStoreUrl = 'https://play.google.com/store/apps/details?id=com.thekingofgym.crm';
    const apkUrl = '/downloads/thekingofgym-crm.apk';
    
    // For now, show alert with options
    const choice = confirm(
      'Android Installation Options:\n\n' +
      'OK = Open Play Store\n' +
      'Cancel = Download APK directly'
    );
    
    if (choice) {
      window.open(playStoreUrl, '_blank');
    } else {
      // Trigger APK download
      const link = document.createElement('a');
      link.href = apkUrl;
      link.download = 'thekingofgym-crm.apk';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleIOSInstall = () => {
    // Mock iOS installation - TestFlight or App Store
    const appStoreUrl = 'https://apps.apple.com/app/thekingofgym-crm/id123456789';
    const testFlightUrl = 'https://testflight.apple.com/join/ABCD1234';
    
    // Show installation instructions modal
    alert(
      'iOS Installation:\n\n' +
      '1. Install from App Store (recommended)\n' +
      '2. Or join TestFlight Beta\n\n' +
      'Opening App Store...'
    );
    
    window.open(appStoreUrl, '_blank');
  };

  const handleWebAppOpen = () => {
    // Open the web app - redirect to dashboard
    window.location.href = '/';
  };

  return (
    <div className="min-h-full bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header with Back Button */}
      <div className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-4">
            {/* Back Button */}
            <button
              onClick={() => navigate(-1)}
              className="flex items-center justify-center w-10 h-10 rounded-lg bg-gray-100 hover:bg-gray-200 active:bg-gray-300 transition-colors"
              title="वापस जाएं"
            >
              <ArrowLeft className="w-5 h-5 text-gray-700" />
            </button>
            
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center">
                <Smartphone className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">The King of Gym Equipment</h1>
                <p className="text-sm text-gray-600">CRM Installation Center</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            अपने सभी Devices पर Install करें
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Android, iOS या Web - जहां चाहें वहां अपना CRM access करें। 
            एक ही account, सभी platforms पर sync।
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
          <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
            <CheckCircle className="w-6 h-6 text-green-600 mb-2" />
            <p className="text-sm font-medium text-gray-900">Cross-Platform Sync</p>
            <p className="text-xs text-gray-600 mt-1">सभी devices पर real-time data sync</p>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
            <CheckCircle className="w-6 h-6 text-green-600 mb-2" />
            <p className="text-sm font-medium text-gray-900">Offline Access</p>
            <p className="text-xs text-gray-600 mt-1">बिना internet के भी काम करें</p>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
            <CheckCircle className="w-6 h-6 text-green-600 mb-2" />
            <p className="text-sm font-medium text-gray-900">Secure & Fast</p>
            <p className="text-xs text-gray-600 mt-1">Bank-level security protection</p>
          </div>
        </div>

        {/* Platform Installation Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Android Card */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-shadow">
            <div className="bg-gradient-to-br from-green-500 to-green-600 p-8 text-white text-center">
              <Smartphone className="w-16 h-16 mx-auto mb-3" />
              <h3 className="text-xl font-bold">Android</h3>
              <p className="text-sm text-green-100 mt-1">Android 8.0+</p>
            </div>
            <div className="p-6">
              <ul className="space-y-2 mb-6 text-sm text-gray-600">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Play Store से direct install</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>या APK file download करें</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Auto-update support</span>
                </li>
              </ul>
              <button
                onClick={handleAndroidInstall}
                className="w-full bg-green-600 text-white font-semibold py-3 px-6 rounded-lg hover:bg-green-700 active:bg-green-800 transition-colors flex items-center justify-center gap-2"
              >
                <Download className="w-5 h-5" />
                Android Install करें
              </button>
            </div>
          </div>

          {/* iOS Card */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-shadow">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-8 text-white text-center">
              <Apple className="w-16 h-16 mx-auto mb-3" />
              <h3 className="text-xl font-bold">iOS</h3>
              <p className="text-sm text-blue-100 mt-1">iOS 14.0+</p>
            </div>
            <div className="p-6">
              <ul className="space-y-2 mb-6 text-sm text-gray-600">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                  <span>App Store से download</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                  <span>TestFlight beta access</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                  <span>iPhone और iPad support</span>
                </li>
              </ul>
              <button
                onClick={handleIOSInstall}
                className="w-full bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg hover:bg-blue-700 active:bg-blue-800 transition-colors flex items-center justify-center gap-2"
              >
                <Apple className="w-5 h-5" />
                iOS Install करें
              </button>
            </div>
          </div>

          {/* Web App Card */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-shadow">
            <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-8 text-white text-center">
              <Globe className="w-16 h-16 mx-auto mb-3" />
              <h3 className="text-xl font-bold">Web App</h3>
              <p className="text-sm text-purple-100 mt-1">All Browsers</p>
            </div>
            <div className="p-6">
              <ul className="space-y-2 mb-6 text-sm text-gray-600">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-purple-600 mt-0.5 flex-shrink-0" />
                  <span>कोई installation नहीं चाहिए</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-purple-600 mt-0.5 flex-shrink-0" />
                  <span>Browser में सीधे खोलें</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-purple-600 mt-0.5 flex-shrink-0" />
                  <span>Desktop और Mobile support</span>
                </li>
              </ul>
              <button
                onClick={handleWebAppOpen}
                className="w-full bg-purple-600 text-white font-semibold py-3 px-6 rounded-lg hover:bg-purple-700 active:bg-purple-800 transition-colors flex items-center justify-center gap-2"
              >
                <ExternalLink className="w-5 h-5" />
                Web App खोलें
              </button>
            </div>
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-12 bg-blue-50 rounded-xl p-6 border border-blue-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">📱 Installation Tips</h3>
          <ul className="space-y-2 text-sm text-gray-700">
            <li className="flex items-start gap-2">
              <span className="text-blue-600 font-bold">•</span>
              <span><strong>Android:</strong> अगर Play Store available नहीं है तो APK से direct install करें</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 font-bold">•</span>
              <span><strong>iOS:</strong> TestFlight से latest beta features access करें</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 font-bold">•</span>
              <span><strong>Web:</strong> किसी भी device से browser में login करें - installation की जरूरत नहीं</span>
            </li>
          </ul>
        </div>

        {/* Support Section */}
        <div className="mt-8 text-center text-sm text-gray-600">
          <p>Installation में समस्या? <a href="/settings" className="text-blue-600 hover:underline">Support से संपर्क करें</a></p>
        </div>
      </div>
    </div>
  );
};

export default InstallPage;
