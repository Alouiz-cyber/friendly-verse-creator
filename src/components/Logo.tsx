
import React from 'react';
import { cn } from '@/lib/utils';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  collapsed?: boolean;
}

export const Logo: React.FC<LogoProps> = ({
  className,
  size = 'md',
  collapsed = false,
}) => {
  // Size adjustments
  const sizeMap = {
    sm: 'h-10',
    md: 'h-16',
    lg: 'h-20',
  };
  
  return (
    <div className={cn('flex items-center gap-2', className)}>
      {/* Main logo image - the figure on layers */}
      <div className={cn(sizeMap[size], 'w-auto relative')}>
        <img 
          src="/lovable-uploads/54107364-35c4-4fea-ae6d-2a3829518d2e.png"
          alt="OGEC Logo"
          className={cn(
            'h-full w-auto object-contain',
            // Apply mix-blend-mode for better visibility on different backgrounds
            'mix-blend-mode-normal dark:brightness-110 dark:contrast-125'
          )}
          style={{
            filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.1))'
          }}
        />
      </div>

      {/* Brand text - only show when not collapsed */}
      {!collapsed && (
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
