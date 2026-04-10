import React from 'react';
import { LucideIcon } from 'lucide-react';

interface KPICardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: number;
  format?: 'number' | 'currency' | 'percentage' | 'rating';
  iconColor?: string;
  iconBgColor?: string;
}

export const KPICard: React.FC<KPICardProps> = ({
  title,
  value,
  icon: Icon,
  trend,
  format = 'number',
  iconColor = 'text-blue-600',
  iconBgColor = 'bg-blue-100',
}) => {
  const formatValue = (val: string | number): string => {
    if (typeof val === 'string') return val;
    
    switch (format) {
      case 'currency':
        return `₹${val.toLocaleString('en-IN', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
      case 'percentage':
        return `${val.toFixed(1)}%`;
      case 'rating':
        return `${val.toFixed(1)}⭐`;
      default:
        return val.toLocaleString();
    }
  };

  const getTrendColor = (): string => {
    if (trend === undefined) return '';
    return trend >= 0 ? 'text-green-600' : 'text-red-600';
  };

  const getTrendIcon = (): string => {
    if (trend === undefined) return '';
    return trend >= 0 ? '↑' : '↓';
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow duration-200">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-2">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mb-1">
            {formatValue(value)}
          </p>
          {trend !== undefined && (
            <div className={`flex items-center text-sm font-medium ${getTrendColor()}`}>
              <span className="mr-1">{getTrendIcon()}</span>
              <span>{Math.abs(trend).toFixed(1)}%</span>
              <span className="ml-1 text-gray-500 font-normal">vs yesterday</span>
            </div>
          )}
        </div>
        <div className={`${iconBgColor} ${iconColor} p-3 rounded-lg`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
};
