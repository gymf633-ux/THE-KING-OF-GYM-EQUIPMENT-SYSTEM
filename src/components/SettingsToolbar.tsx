import React from 'react';
import { motion } from 'framer-motion';
import { Languages, Gauge } from 'lucide-react';
import { useSettings } from '../store/useSettings';

const languages = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'hi', name: 'हिन्दी', flag: '🇮🇳' },
  { code: 'gu', name: 'ગુજરાતી', flag: '🇮🇳' },
  { code: 'zh', name: '中文', flag: '🇨🇳' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'ar', name: 'العربية', flag: '🇸🇦' },
];

const animationSpeeds = [
  { value: 0.5, label: 'Slow', description: '0.5×' },
  { value: 1, label: 'Normal', description: '1×' },
  { value: 1.5, label: 'Fast', description: '1.5×' },
  { value: 2, label: 'Very Fast', description: '2×' },
];

export const SettingsToolbar: React.FC = () => {
  const { language, animationSpeed, updateLanguage, updateAnimationSpeed } = useSettings();
  const [showLanguageMenu, setShowLanguageMenu] = React.useState(false);
  const [showSpeedMenu, setShowSpeedMenu] = React.useState(false);

  const selectedLanguage = languages.find(lang => lang.code === language) || languages[0];
  const selectedSpeed = animationSpeeds.find(s => s.value === animationSpeed) || animationSpeeds[1];

  return (
    <div className="flex items-center gap-3 px-4 py-2 bg-white border-b border-gray-200">
      {/* Language Switcher */}
      <div className="relative">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowLanguageMenu(!showLanguageMenu)}
          className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <Languages className="w-4 h-4" />
          <span className="hidden sm:inline">{selectedLanguage.flag}</span>
          <span className="hidden md:inline">{selectedLanguage.name}</span>
        </motion.button>

        {showLanguageMenu && (
          <>
            <div 
              className="fixed inset-0 z-10" 
              onClick={() => setShowLanguageMenu(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute top-full left-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-20"
            >
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => {
                    updateLanguage(lang.code);
                    setShowLanguageMenu(false);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-2 text-sm hover:bg-gray-50 transition-colors ${
                    lang.code === language ? 'bg-blue-50 text-blue-700' : 'text-gray-700'
                  }`}
                >
                  <span className="text-lg">{lang.flag}</span>
                  <span className="font-medium">{lang.name}</span>
                </button>
              ))}
            </motion.div>
          </>
        )}
      </div>

      {/* Animation Speed Control */}
      <div className="relative">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowSpeedMenu(!showSpeedMenu)}
          className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <Gauge className="w-4 h-4" />
          <span className="hidden sm:inline">{selectedSpeed.description}</span>
        </motion.button>

        {showSpeedMenu && (
          <>
            <div 
              className="fixed inset-0 z-10" 
              onClick={() => setShowSpeedMenu(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute top-full left-0 mt-2 w-40 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-20"
            >
              {animationSpeeds.map((speed) => (
                <button
                  key={speed.value}
                  onClick={() => {
                    updateAnimationSpeed(speed.value);
                    setShowSpeedMenu(false);
                  }}
                  className={`w-full flex items-center justify-between px-4 py-2 text-sm hover:bg-gray-50 transition-colors ${
                    speed.value === animationSpeed ? 'bg-blue-50 text-blue-700' : 'text-gray-700'
                  }`}
                >
                  <span className="font-medium">{speed.label}</span>
                  <span className="text-xs text-gray-500">{speed.description}</span>
                </button>
              ))}
            </motion.div>
          </>
        )}
      </div>
    </div>
  );
};
