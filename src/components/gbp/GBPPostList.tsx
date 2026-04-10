import React from 'react';
import { Calendar, Image, FileText } from 'lucide-react';
import type { GBPPost } from '../../types/gbpPost';

interface GBPPostListProps {
  posts: GBPPost[];
}

export const GBPPostList: React.FC<GBPPostListProps> = ({ posts }) => {
  const getPostTypeIcon = (type: GBPPost['post_type']) => {
    switch (type) {
      case 'offer':
        return '🎁';
      case 'update':
        return '📢';
      case 'article':
        return '📝';
      default:
        return '📄';
    }
  };

  const getPostTypeColor = (type: GBPPost['post_type']) => {
    switch (type) {
      case 'offer':
        return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'update':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'article':
        return 'bg-purple-100 text-purple-700 border-purple-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const formatDate = (dateStr: string | null | undefined) => {
    if (!dateStr) return 'Not posted yet';
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    }).format(date);
  };

  return (
    <div className="space-y-4">
      {posts.map((post) => (
        <div
          key={post.id}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all duration-200"
        >
          <div className="flex items-start gap-4">
            {/* Media Preview */}
            {post.media_url ? (
              <div className="flex-shrink-0 w-24 h-24 rounded-lg overflow-hidden bg-gray-100">
                <img
                  src={post.media_url}
                  alt={post.title}
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div className="flex-shrink-0 w-24 h-24 rounded-lg bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                <FileText className="w-10 h-10 text-gray-400" />
              </div>
            )}

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{getPostTypeIcon(post.post_type)}</span>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide border ${getPostTypeColor(
                      post.post_type
                    )}`}
                  >
                    {post.post_type}
                  </span>
                </div>
                {post.scheduled_at && !post.posted_at && (
                  <span className="flex items-center gap-1 text-xs text-amber-600 bg-amber-50 px-2 py-1 rounded-full border border-amber-200">
                    <Calendar className="w-3 h-3" />
                    Scheduled
                  </span>
                )}
                {post.posted_at && (
                  <span className="flex items-center gap-1 text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full border border-green-200">
                    ✓ Posted
                  </span>
                )}
              </div>

              <h3 className="text-lg font-bold text-gray-900 mb-2">{post.title}</h3>
              <p className="text-sm text-gray-600 mb-3 line-clamp-2">{post.body}</p>

              <div className="flex items-center gap-4 text-xs text-gray-500">
                <div className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  {post.posted_at ? (
                    <span>Posted: {formatDate(post.posted_at)}</span>
                  ) : post.scheduled_at ? (
                    <span>Scheduled: {formatDate(post.scheduled_at)}</span>
                  ) : (
                    <span>Draft</span>
                  )}
                </div>
                {post.media_url && (
                  <div className="flex items-center gap-1 text-blue-600">
                    <Image className="w-3.5 h-3.5" />
                    <span>Has media</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
