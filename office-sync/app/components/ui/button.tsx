import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

export function Button({ children, className, ...props }: ButtonProps) {
  return (
    <button
      className={`px-4 py-2 font-medium rounded-md transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
