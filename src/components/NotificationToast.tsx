import React, { useEffect } from 'react';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';

export interface Toast {
  id: string;
  type: 'success' | 'error' | 'info';
  title: string;
  messages: string[];
  duration?: number;
}

interface NotificationToastProps {
  toast: Toast;
  onClose: (id: string) => void;
}

export const NotificationToast: React.FC<NotificationToastProps> = ({ toast, onClose }) => {
  useEffect(() => {
    const duration = toast.duration || 5000;
    const timer = setTimeout(() => {
      onClose(toast.id);
    }, duration);

    return () => clearTimeout(timer);
  }, [toast.id, toast.duration, onClose]);

  const getIcon = () => {
    switch (toast.type) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'error':
        return <AlertCircle className="w-5 h-5 text-red-600" />;
      case 'info':
        return <Info className="w-5 h-5 text-blue-600" />;
    }
  };

  const getBackgroundColor = () => {
    switch (toast.type) {
      case 'success':
        return 'bg-green-50 border-green-200';
      case 'error':
        return 'bg-red-50 border-red-200';
      case 'info':
        return 'bg-blue-50 border-blue-200';
    }
  };

  return (
    <div className={`${getBackgroundColor()} border rounded-lg shadow-lg p-4 mb-3 min-w-[320px] max-w-md animate-slide-in`}>
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 mt-0.5">{getIcon()}</div>
        <div className="flex-1">
          <h4 className="text-sm font-semibold text-gray-900 mb-1">{toast.title}</h4>
          {toast.messages.length > 0 && (
            <div className="space-y-1">
              {toast.messages.map((message, index) => (
                <p key={index} className="text-sm text-gray-700">
                  {message}
                </p>
              ))}
            </div>
          )}
        </div>
        <button
          onClick={() => onClose(toast.id)}
          className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

interface ToastContainerProps {
  toasts: Toast[];
  onClose: (id: string) => void;
}

export const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, onClose }) => {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50">
      {toasts.map((toast) => (
        <NotificationToast key={toast.id} toast={toast} onClose={onClose} />
      ))}
    </div>
  );
};
