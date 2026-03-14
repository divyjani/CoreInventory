import React, { ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger';
}

export default function Button({ children, variant = 'primary', className = '', ...props }: ButtonProps) {
  const baseStyle = "px-4 py-2 rounded-lg font-medium transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2";
  
  const variants = {
    primary: "bg-primary-500 hover:bg-primary-600 text-white focus:ring-primary-500",
    secondary: "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 focus:ring-gray-200",
    danger: "bg-danger-500 hover:bg-red-600 text-white focus:ring-danger-500"
  };

  return (
    <button 
      className={`${baseStyle} ${variants[variant]} disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
