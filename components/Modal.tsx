import React from 'react';
import { X, CheckCircle, AlertTriangle } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  type?: 'alert' | 'confirm';
  title?: string;
  message: string;
  onConfirm?: () => void;
  onCancel: () => void;
  confirmLabel?: string;
  cancelLabel?: string;
}

export const Modal: React.FC<ModalProps> = ({ 
    isOpen, 
    type = 'alert', 
    title, 
    message, 
    onConfirm, 
    onCancel,
    confirmLabel = 'OK',
    cancelLabel = 'Cancel'
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in"
        onClick={type === 'alert' ? onCancel : undefined}
      />
      
      {/* Content */}
      <div className="relative bg-brand-dark border-2 border-gray-800 rounded-3xl p-6 w-full max-w-md shadow-2xl animate-pop-in">
        <div className="flex flex-col items-center text-center">
            {/* Icon */}
            <div className="mb-4">
                {type === 'alert' ? (
                     <div className="w-16 h-16 bg-brand-purple/20 rounded-full flex items-center justify-center">
                        <CheckCircle size={32} className="text-brand-purple" />
                     </div>
                ) : (
                    <div className="w-16 h-16 bg-brand-yellow/20 rounded-full flex items-center justify-center">
                        <AlertTriangle size={32} className="text-brand-yellow" />
                    </div>
                )}
            </div>

            {title && (
                <h3 className="text-xl font-black text-white mb-2 uppercase tracking-wide">
                    {title}
                </h3>
            )}
            
            <p className="text-gray-300 mb-8 leading-relaxed font-medium">
                {message}
            </p>

            <div className="flex gap-3 w-full">
                {type === 'confirm' && (
                    <button 
                        onClick={onCancel}
                        className="flex-1 py-3 rounded-xl font-bold uppercase tracking-wider bg-gray-800 text-gray-400 hover:bg-gray-700 transition-colors"
                    >
                        {cancelLabel}
                    </button>
                )}
                <button 
                    onClick={() => {
                        if (onConfirm) onConfirm();
                        onCancel(); // Close modal
                    }}
                    className={`flex-1 py-3 rounded-xl font-bold uppercase tracking-wider text-white shadow-lg transition-transform active:scale-95
                        ${type === 'confirm' ? 'bg-brand-red hover:bg-brand-redDark' : 'bg-brand-purple hover:bg-brand-purpleDark'}
                    `}
                >
                    {confirmLabel}
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};