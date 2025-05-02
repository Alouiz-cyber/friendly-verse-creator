
import React from 'react';
import { cn } from '@/lib/utils';
import { useTheme } from '@/contexts/ThemeContext';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
}

export const Logo: React.FC<LogoProps> = ({
  className,
  size = 'md',
  showText = false,
}) => {
  const { theme } = useTheme();
  
  // Size adjustments
  const sizeMap = {
    sm: 'h-10',
    md: 'h-16',
    lg: 'h-20',
  };
  
  return (
    <div className={cn('flex items-center gap-2', className)}>
      {/* SVG with adaptive coloring based on theme */}
      <img 
        src={`/logo.svg`}
        alt="OGEC logo" 
        className={cn(
          sizeMap[size], 
          'w-auto',
          theme === 'dark' ? 'filter invert opacity-90' : ''
        )}
      />

      {/* Brand text - only show when requested */}
      {showText && (
        <div className={cn('flex flex-col')}>
          <span
            className={cn(
              'font-extrabold tracking-tight',
              size === 'sm' ? 'text-base' : size === 'md' ? 'text-2xl' : 'text-3xl',
              'text-[#22223B] dark:text-white',
              'leading-6'
            )}
            style={{ fontFamily: "'Montserrat', 'Cairo', sans-serif" }}
          >
            OGEC
          </span>
          <span
            className={cn(
              'font-bold',
              size === 'sm' ? 'text-xs' : size === 'md' ? 'text-base' : 'text-lg',
              'text-[#221B44] dark:text-[#dedaff]',
              'leading-tight'
            )}
            dir="rtl"
            style={{ fontFamily: "'Cairo', 'Montserrat', sans-serif", letterSpacing: 0 }}
          >
            فرع فم الواد
          </span>
        </div>
      )}
    </div>
  );
};
