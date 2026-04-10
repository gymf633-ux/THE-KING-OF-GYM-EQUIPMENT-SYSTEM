import React, { useState, Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { X, Image as ImageIcon, Calendar, Send, Sparkles } from 'lucide-react';
import type { PostType, CreateGBPPostInput } from '../../types/gbpPost';

interface PostCreationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (post: CreateGBPPostInput) => void;
}

export const PostCreationModal: React.FC<PostCreationModalProps> = ({
  isOpen,
  onClose,
  onSave,
}) => {
  const [formData, setFormData] = useState<CreateGBPPostInput>({
    post_type: 'update',
    title: '',
    body: '',
    media_url: null,
    scheduled_at: null,
  });

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isScheduled, setIsScheduled] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const postData: CreateGBPPostInput = {
      ...formData,
      posted_at: isScheduled ? null : new Date().toISOString(),
    };

    onSave(postData);
    handleClose();
  };

  const handleClose = () => {
    setFormData({
      post_type: 'update',
      title: '',
      body: '',
      media_url: null,
      scheduled_at: null,
    });
    setImagePreview(null);
    setIsScheduled(false);
    onClose();
  };

  const handleImageUrlChange = (url: string) => {
    setFormData({ ...formData, media_url: url });
    setImagePreview(url);
  };

  const getPostTypeEmoji = (type: PostType) => {
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

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={handleClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white shadow-2xl transition-all">
                {/* Header */}
                <div className="bg-gradient-to-r from-indigo-600 to-blue-600 px-6 py-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                        <Sparkles className="w-6 h-6 text-white" />
                      </div>
                      <Dialog.Title className="text-xl font-bold text-white">
                        Create New Post
                      </Dialog.Title>
                    </div>
                    <button
                      onClick={handleClose}
                      className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                    >
                      <X className="w-5 h-5 text-white" />
                    </button>
                  </div>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                  {/* Post Type Selector */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Post Type
                    </label>
                    <div className="grid grid-cols-3 gap-3">
                      {(['update', 'offer', 'article'] as PostType[]).map((type) => (
                        <button
                          key={type}
                          type="button"
                          onClick={() => setFormData({ ...formData, post_type: type })}
                          className={`
                            p-4 rounded-xl border-2 transition-all
                            ${
                              formData.post_type === type
                                ? 'border-indigo-500 bg-indigo-50 shadow-md'
                                : 'border-gray-200 hover:border-gray-300 bg-white'
                            }
                          `}
                        >
                          <div className="text-3xl mb-2">{getPostTypeEmoji(type)}</div>
                          <div
                            className={`text-sm font-semibold capitalize ${
                              formData.post_type === type ? 'text-indigo-700' : 'text-gray-700'
                            }`}
                          >
                            {type}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Title */}
                  <div>
                    <label
                      htmlFor="title"
                      className="block text-sm font-semibold text-gray-700 mb-2"
                    >
                      Post Title *
                    </label>
                    <input
                      type="text"
                      id="title"
                      required
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="Enter an engaging title..."
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                    />
                  </div>

                  {/* Body */}
                  <div>
                    <label
                      htmlFor="body"
                      className="block text-sm font-semibold text-gray-700 mb-2"
                    >
                      Post Content *
                    </label>
                    <textarea
                      id="body"
                      required
                      rows={5}
                      value={formData.body}
                      onChange={(e) => setFormData({ ...formData, body: e.target.value })}
                      placeholder="Write your post content here..."
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all resize-none"
                    />
                    <div className="mt-1 text-xs text-gray-500">
                      {formData.body.length} characters
                    </div>
                  </div>

                  {/* Image URL */}
                  <div>
                    <label
                      htmlFor="imageUrl"
                      className="block text-sm font-semibold text-gray-700 mb-2"
                    >
                      Image URL (Optional)
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="url"
                        id="imageUrl"
                        value={formData.media_url || ''}
                        onChange={(e) => handleImageUrlChange(e.target.value)}
                        placeholder="https://example.com/image.jpg"
                        className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                      />
                      <button
                        type="button"
                        className="px-4 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors flex items-center gap-2"
                      >
                        <ImageIcon className="w-5 h-5" />
                        Browse
                      </button>
                    </div>
                    {imagePreview && (
                      <div className="mt-3 relative rounded-xl overflow-hidden border border-gray-200">
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="w-full h-48 object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setFormData({ ...formData, media_url: null });
                            setImagePreview(null);
                          }}
                          className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Schedule Option */}
                  <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-xl border border-blue-200">
                    <input
                      type="checkbox"
                      id="schedule"
                      checked={isScheduled}
                      onChange={(e) => setIsScheduled(e.target.checked)}
                      className="w-4 h-4 text-indigo-600 rounded focus:ring-2 focus:ring-indigo-500"
                    />
                    <label htmlFor="schedule" className="flex-1 flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-blue-600" />
                      <span className="text-sm font-medium text-gray-700">
                        Schedule for later
                      </span>
                    </label>
                  </div>

                  {isScheduled && (
                    <div>
                      <label
                        htmlFor="scheduledAt"
                        className="block text-sm font-semibold text-gray-700 mb-2"
                      >
                        Schedule Date & Time
                      </label>
                      <input
                        type="datetime-local"
                        id="scheduledAt"
                        value={formData.scheduled_at || ''}
                        onChange={(e) =>
                          setFormData({ ...formData, scheduled_at: e.target.value })
                        }
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                      />
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex gap-3 pt-4 border-t border-gray-200">
                    <button
                      type="button"
                      onClick={handleClose}
                      className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 px-6 py-3 bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-semibold rounded-xl hover:from-indigo-700 hover:to-blue-700 transition-all shadow-lg flex items-center justify-center gap-2"
                    >
                      <Send className="w-5 h-5" />
                      {isScheduled ? 'Schedule Post' : 'Publish Now'}
                    </button>
                  </div>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};
