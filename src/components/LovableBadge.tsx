
import React from 'react';
import { Logo } from '@/components/Logo';

export const LovableBadge = () => {
  return (
    <div className="fixed bottom-0 right-0 p-4 z-50">
      <div className="bg-white dark:bg-gray-900 rounded-full shadow-lg p-3 border border-gray-200 dark:border-gray-700">
        <Logo size="sm" collapsed={true} className="h-8 w-8" />
      </div>
    </div>
  );
};
