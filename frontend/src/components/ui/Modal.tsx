import { useEffect } from 'react';
import type { ReactNode } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  widthClass?: string;
}

export default function Modal({ open, onClose, title, children, widthClass = 'max-w-lg' }: ModalProps) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      <div
        className="absolute inset-0 bg-navy-deep/40 backdrop-blur-[2px] animate-fade-up"
        onClick={onClose}
      />
      <div
        className={`relative w-full ${widthClass} bg-surface-raised rounded-t-3xl sm:rounded-3xl shadow-[var(--shadow-card-hover)] max-h-[90vh] overflow-y-auto animate-fade-up`}
      >
        {title && (
          <div className="sticky top-0 flex items-center justify-between px-6 py-4 border-b border-line bg-surface-raised/95 backdrop-blur rounded-t-3xl">
            <h3 className="font-display font-semibold text-ink text-lg">{title}</h3>
            <button
              onClick={onClose}
              aria-label="Close"
              className="focus-ring rounded-full p-1.5 text-ink-faint hover:bg-surface hover:text-ink transition-colors"
            >
              <X size={18} />
            </button>
          </div>
        )}
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}
