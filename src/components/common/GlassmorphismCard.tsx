import React from 'react';

interface GlassmorphismCardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'light' | 'dark';
}

export const GlassmorphismCard: React.FC<GlassmorphismCardProps> = ({
  children,
  className = '',
  variant = 'light'
}) => {
  const variantClasses = {
    light: 'bg-white/30 backdrop-blur-glass border border-white/20',
    dark: 'bg-black/30 backdrop-blur-glass border border-white/10'
  };

  return (
    <div className={`
      rounded-2xl shadow-xl
      ${variantClasses[variant]}
      ${className}
    `}>
      {children}
    </div>
  );
};