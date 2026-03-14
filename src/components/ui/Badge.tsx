import React, { ReactNode } from 'react';

type BadgeProps = {
  children: ReactNode;
  variant: 'neutral' | 'info' | 'warning' | 'success' | 'danger';
  className?: string;
};

export default function Badge({ children, variant, className = '' }: BadgeProps) {
  const variants = {
    neutral: 'bg-gray-100 text-gray-700 border-gray-200',
    info: 'bg-blue-100 text-info-500 border-blue-200',
    warning: 'bg-orange-100 text-warning-500 border-orange-200',
    success: 'bg-green-100 text-success-500 border-green-200',
    danger: 'bg-red-100 text-danger-500 border-red-200',
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
}
