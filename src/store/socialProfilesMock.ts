import type { SocialProfile } from '../types/socialProfile';

// Mock social profiles data
let socialProfiles: SocialProfile[] = [
  {
    id: 'sp-1',
    platform: 'facebook',
    profile_url: 'https://facebook.com/thekingofgymequipment',
    access_token: 'PLACEHOLDER_FB_TOKEN',
    token_expiry: '2025-12-31',
    status: 'active',
    profile_name: 'The King of Gym Equipment',
    follower_count: 5420,
    last_synced: '2025-01-12',
    created_at: '2024-01-01',
    updated_at: '2025-01-12'
  },
  {
    id: 'sp-2',
    platform: 'instagram',
    profile_url: 'https://instagram.com/kingofgymequipment',
    access_token: 'PLACEHOLDER_IG_TOKEN',
    token_expiry: '2025-12-31',
    status: 'active',
    profile_name: '@kingofgymequipment',
    follower_count: 8760,
    last_synced: '2025-01-12',
    created_at: '2024-01-01',
    updated_at: '2025-01-12'
  },
  {
    id: 'sp-3',
    platform: 'linkedin',
    profile_url: 'https://linkedin.com/company/the-king-of-gym-equipment',
    access_token: 'PLACEHOLDER_LI_TOKEN',
    token_expiry: '2025-12-31',
    status: 'active',
    profile_name: 'The King of Gym Equipment',
    follower_count: 1250,
    last_synced: '2025-01-12',
    created_at: '2024-02-01',
    updated_at: '2025-01-12'
  },
  {
    id: 'sp-4',
    platform: 'youtube',
    profile_url: 'https://youtube.com/@thekingofgymequipment',
    status: 'disconnected',
    profile_name: 'The King of Gym Equipment',
    created_at: '2024-03-01',
    updated_at: '2024-12-01'
  },
  {
    id: 'sp-5',
    platform: 'pinterest',
    profile_url: 'https://pinterest.com/kingofgymequip',
    status: 'disconnected',
    created_at: '2024-04-01',
    updated_at: '2024-12-01'
  },
  {
    id: 'sp-6',
    platform: 'google_business',
    profile_url: 'https://g.page/thekingofgymequipment',
    access_token: 'GBP_ACCESS_TOKEN_PLACEHOLDER',
    token_expiry: '2026-01-31',
    status: 'active',
    profile_name: 'The King of Gym Equipment',
    last_synced: '2025-11-12',
    created_at: '2024-01-01',
    updated_at: '2025-11-12'
  }
];

// Get all social profiles
export function getMockSocialProfiles(): SocialProfile[] {
  return [...socialProfiles];
}

// Get active social profiles
export function getMockActiveSocialProfiles(): SocialProfile[] {
  return socialProfiles.filter(p => p.status === 'active');
}

// Get profiles by platform
export function getMockProfileByPlatform(platform: SocialProfile['platform']): SocialProfile | undefined {
  return socialProfiles.find(p => p.platform === platform);
}

// Update social profile
export function updateMockSocialProfile(id: string, updates: Partial<SocialProfile>): SocialProfile | null {
  const index = socialProfiles.findIndex(p => p.id === id);
  if (index === -1) return null;

  socialProfiles[index] = {
    ...socialProfiles[index],
    ...updates,
    updated_at: new Date().toISOString().split('T')[0]
  };

  return socialProfiles[index];
}

// Add new social profile
export function addMockSocialProfile(profile: Omit<SocialProfile, 'id' | 'created_at' | 'updated_at'>): SocialProfile {
  const newProfile: SocialProfile = {
    ...profile,
    id: `sp-${Date.now()}`,
    created_at: new Date().toISOString().split('T')[0],
    updated_at: new Date().toISOString().split('T')[0]
  };

  socialProfiles.push(newProfile);
  return newProfile;
}

// Get profiles with expired tokens (for reminders)
export function getMockExpiredProfiles(): SocialProfile[] {
  const today = new Date().toISOString().split('T')[0];
  return socialProfiles.filter(p => {
    if (!p.token_expiry) return false;
    return p.token_expiry < today;
  });
}

// Sync profile (update last_synced timestamp)
export function syncMockProfile(id: string): boolean {
  const profile = socialProfiles.find(p => p.id === id);
  if (!profile) return false;

  profile.last_synced = new Date().toISOString().split('T')[0];
  profile.updated_at = new Date().toISOString().split('T')[0];
  return true;
}
