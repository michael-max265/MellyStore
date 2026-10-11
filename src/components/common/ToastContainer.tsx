import React from 'react';
import { CheckCircle2, Info, AlertTriangle, X } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export const ToastContainer: React.FC = () => {
  const { toasts, dismissToast } = useStore();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none">
      {toasts.map(toast => (
        <div
          key={toast.id}
          className="pointer-events-auto bg-noir-950 text-white p-4 rounded-xl shadow-2xl border border-stone-800 flex items-start space-x-3 animate-toast-up"
        >
          {toast.type === 'success' && <CheckCircle2 className="w-4 h-4 text-champagne-400 mt-0.5 shrink-0" />}
          {toast.type === 'info' && <Info className="w-4 h-4 text-blue-400 mt-0.5 shrink-0" />}
          {toast.type === 'error' && <AlertTriangle className="w-4 h-4 text-rose-400 mt-0.5 shrink-0" />}

          <div className="flex-1">
            <h5 className="font-serif text-xs font-semibold text-white tracking-wide">{toast.title}</h5>
            <p className="text-[11px] text-stone-300 mt-0.5 font-light leading-snug">{toast.message}</p>
          </div>

          <button
            onClick={() => dismissToast(toast.id)}
            className="text-stone-400 hover:text-white transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      ))}
    </div>
  );
};
