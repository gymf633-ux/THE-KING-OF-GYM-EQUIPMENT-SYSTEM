import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RefreshCw, X, Download } from 'lucide-react';
import { useSettings } from '../store/useSettings';

interface SystemUpdate {
  id: number;
  version: string;
  title: string;
  description: string | null;
  update_type: 'feature' | 'bugfix' | 'design' | 'performance';
  requires_reload: number;
  created_at: string;
}

const UPDATE_CHECK_INTERVAL = 60000; // Check every 60 seconds
const BACKEND_URL = 'https://backend.youware.com';

export const SystemUpdateNotification: React.FC = () => {
  const [latestUpdate, setLatestUpdate] = useState<SystemUpdate | null>(null);
  const [showNotification, setShowNotification] = useState(false);
  const [dismissedVersion, setDismissedVersion] = useState<string | null>(null);
  const { animationSpeed } = useSettings();

  const checkForUpdates = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/updates/latest`);
      const data = await response.json();
      
      if (data.success && data.update) {
        const update = data.update as SystemUpdate;
        const currentVersion = localStorage.getItem('app_version') || '1.0.0';
        
        // Show notification if there's a new update and it hasn't been dismissed
        if (update.version !== currentVersion && update.version !== dismissedVersion) {
          setLatestUpdate(update);
          setShowNotification(true);
        }
      }
    } catch (error) {
      console.error('Failed to check for updates:', error);
    }
  };

  useEffect(() => {
    // Check immediately on mount
    checkForUpdates();
    
    // Set up periodic checking
    const interval = setInterval(checkForUpdates, UPDATE_CHECK_INTERVAL);
    
    return () => clearInterval(interval);
  }, [dismissedVersion]);

  const handleUpdate = () => {
    if (latestUpdate) {
      localStorage.setItem('app_version', latestUpdate.version);
      if (latestUpdate.requires_reload) {
        window.location.reload();
      } else {
        setShowNotification(false);
      }
    }
  };

  const handleDismiss = () => {
    if (latestUpdate) {
      setDismissedVersion(latestUpdate.version);
    }
    setShowNotification(false);
  };

  const getUpdateIcon = () => {
    switch (latestUpdate?.update_type) {
      case 'feature':
        return <Download className="w-5 h-5 text-blue-600" />;
      case 'bugfix':
        return <RefreshCw className="w-5 h-5 text-green-600" />;
      case 'design':
        return <Download className="w-5 h-5 text-purple-600" />;
      case 'performance':
        return <RefreshCw className="w-5 h-5 text-orange-600" />;
      default:
        return <RefreshCw className="w-5 h-5 text-blue-600" />;
    }
  };

  const getUpdateColor = () => {
    switch (latestUpdate?.update_type) {
      case 'feature':
        return 'from-blue-500 to-blue-600';
      case 'bugfix':
        return 'from-green-500 to-green-600';
      case 'design':
        return 'from-purple-500 to-purple-600';
      case 'performance':
        return 'from-orange-500 to-orange-600';
      default:
        return 'from-blue-500 to-blue-600';
    }
  };

  return (
    <AnimatePresence>
      {showNotification && latestUpdate && (
        <motion.div
          initial={{ opacity: 0, y: -100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -100 }}
          transition={{ duration: 0.5 / animationSpeed, type: 'spring', damping: 20 }}
          className="fixed top-4 right-4 z-50 max-w-md"
        >
          <div className={`bg-gradient-to-r ${getUpdateColor()} p-1 rounded-lg shadow-2xl`}>
            <div className="bg-white rounded-lg p-4">
              <div className="flex items-start gap-3">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2 / animationSpeed, repeat: Infinity, ease: 'linear' }}
                  className="flex-shrink-0"
                >
                  {getUpdateIcon()}
                </motion.div>
                
                <div className="flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="font-bold text-gray-900">
                        {latestUpdate.title}
                      </h3>
                      <p className="text-xs text-gray-600 mt-1">
                        Version {latestUpdate.version}
                      </p>
                    </div>
                    <button
                      onClick={handleDismiss}
                      className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  
                  {latestUpdate.description && (
                    <p className="text-sm text-gray-700 mt-2">
                      {latestUpdate.description}
                    </p>
                  )}
                  
                  <div className="flex gap-2 mt-4">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleUpdate}
                      className={`flex-1 px-4 py-2 bg-gradient-to-r ${getUpdateColor()} text-white text-sm font-medium rounded-lg hover:shadow-lg transition-shadow`}
                    >
                      {latestUpdate.requires_reload ? 'Update & Reload' : 'Update Now'}
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleDismiss}
                      className="px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      Later
                    </motion.button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
