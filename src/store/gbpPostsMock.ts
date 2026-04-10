import type { GBPPost } from '../types/gbpPost';

export const mockGBPPosts: GBPPost[] = [
  {
    id: 1,
    post_type: 'offer',
    title: '10% Off on All Gym Equipment!',
    body: 'This week\'s special offer: 10% off on all gym equipment! Limited time only. Visit our showroom or call us today!',
    media_url: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800',
    scheduled_at: null,
    posted_at: '2025-11-12T10:11:50Z',
    created_at: '2025-11-12T10:11:50Z',
    updated_at: '2025-11-12T10:11:50Z',
  },
  {
    id: 2,
    post_type: 'offer',
    title: 'Power Rack Special - 20% Off!',
    body: 'Get 20% off on all Power Racks this weekend only. Perfect for home and commercial gyms. Book now!',
    media_url: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800',
    scheduled_at: null,
    posted_at: '2025-11-10T09:00:00Z',
    created_at: '2025-11-09T16:00:00Z',
    updated_at: '2025-11-10T09:00:00Z',
  },
  {
    id: 3,
    post_type: 'update',
    title: 'New Showroom Location!',
    body: 'We\'re now at Shalin Sky, RO Water Plant, Ahmedabad! Visit us Monday-Saturday 9 AM - 7 PM to see our complete range of gym equipment!',
    media_url: null,
    scheduled_at: null,
    posted_at: '2025-11-08T10:30:00Z',
    created_at: '2025-11-08T10:00:00Z',
    updated_at: '2025-11-08T10:30:00Z',
  },
  {
    id: 4,
    post_type: 'article',
    title: 'Complete Guide to Setting Up Your Home Gym',
    body: 'Discover expert tips on creating the perfect home gym setup. From essential equipment to space planning - we\'ve got you covered!',
    media_url: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800',
    scheduled_at: null,
    posted_at: '2025-11-05T14:00:00Z',
    created_at: '2025-11-04T11:00:00Z',
    updated_at: '2025-11-05T14:00:00Z',
  },
  {
    id: 5,
    post_type: 'offer',
    title: 'Year-End Clearance Sale',
    body: 'Huge discounts on selected gym equipment! Benches, dumbbells, and more. Limited stock available!',
    media_url: null,
    scheduled_at: '2025-11-29T06:00:00Z',
    posted_at: null,
    created_at: '2025-11-11T10:00:00Z',
    updated_at: '2025-11-11T10:00:00Z',
  },
];

export const getMockGBPPosts = (): GBPPost[] => [...mockGBPPosts];
export const getMockGBPPostById = (id: number) => mockGBPPosts.find(p => p.id === id);
export const getMockGBPPostsByType = (type: GBPPost['post_type']) => mockGBPPosts.filter(p => p.post_type === type);
export const getMockScheduledGBPPosts = () => mockGBPPosts.filter(p => p.scheduled_at && !p.posted_at);
export const getMockPostedGBPPosts = () => mockGBPPosts.filter(p => p.posted_at !== null);
