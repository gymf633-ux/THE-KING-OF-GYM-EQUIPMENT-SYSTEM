import { create } from 'zustand';
import { mockSettings, updateMockSettings } from './settingsMock';
import type { Settings } from '../types/settings';

interface SettingsState {
  settings: Settings;
  language: string;
  animationSpeed: number;
  updateLanguage: (language: string) => void;
  updateAnimationSpeed: (speed: number) => void;
  updateSettings: (updates: Partial<Settings>) => void;
}

export const useSettings = create<SettingsState>((set) => ({
  settings: mockSettings,
  language: mockSettings.language || 'en',
  animationSpeed: mockSettings.animation_speed || 1,
  
  updateLanguage: (language: string) => {
    const updated = updateMockSettings({ language });
    set({ settings: updated, language });
  },
  
  updateAnimationSpeed: (speed: number) => {
    const updated = updateMockSettings({ animation_speed: speed });
    set({ settings: updated, animationSpeed: speed });
  },
  
  updateSettings: (updates: Partial<Settings>) => {
    const updated = updateMockSettings(updates);
    set({ 
      settings: updated,
      language: updated.language || 'en',
      animationSpeed: updated.animation_speed || 1,
    });
  },
}));
