import React, { useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import cn from '@/lib/utils';
import Button from './button';

export interface DialogProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  className?: string;
}

const Dialog: React.FC<DialogProps> = ({
  isOpen,
  onClose,
  title,
  children,
  className = '',
}) => {
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === overlayRef.current) onClose();
  };

  return (
    <div
      ref={overlayRef}
      onClick={handleOverlayClick}
      className="fixed inset-0 z-50 flex items-center justify-center bg-gray-950/40 p-4 backdrop-blur-sm transition-opacity duration-300 dark:bg-gray-950/60"
    >
      <div
        className={cn(
          'relative w-full max-w-lg scale-100 rounded-2xl border border-gray-200/50 bg-white shadow-xl backdrop-blur-md transition-all duration-300 dark:border-gray-800/50 dark:bg-gray-900/90 max-h-[90svh] flex flex-col',
          className
        )}
      >
        {/* Dialog Header */}
        <div className="flex items-center justify-between border-b border-gray-200/50 p-6 dark:border-gray-800/50">
          {title && (
            <h3 className="text-lg font-bold tracking-tight text-gray-900 dark:text-white my-0">
              {title}
            </h3>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-8 w-8 rounded-lg text-gray-400 hover:text-gray-900 dark:hover:text-white cursor-pointer"
          >
            <X className="h-4.5 w-4.5" />
          </Button>
        </div>

        {/* Dialog Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Dialog;
