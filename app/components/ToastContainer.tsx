"use client";

import React from 'react';
import { CheckCircle2, X, AlertTriangle, Info } from 'lucide-react';
import type { ToastMessage } from '@/app/types';

interface ToastContainerProps {
  toasts: ToastMessage[];
  removeToast: (id: string) => void;
}

const iconMap = {
  success: <CheckCircle2 className="w-5 h-5" />,
  error: <X className="w-5 h-5" />,
  warning: <AlertTriangle className="w-5 h-5" />,
  info: <Info className="w-5 h-5" />,
};

const styleMap = {
  success: 'bg-green-500 text-white border-black',
  error: 'bg-red-600 text-white border-black',
  warning: 'bg-yellow-400 text-black border-black',
  info: 'bg-blue-600 text-white border-black',
};

export default function ToastContainer({ toasts, removeToast }: ToastContainerProps) {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-3 pointer-events-none">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`pointer-events-auto animate-in slide-in-from-bottom-4 fade-in duration-300
            flex items-center gap-3 px-6 py-4 rounded-2xl border-4 font-bold text-sm
            shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] min-w-[280px] max-w-[420px]
            ${styleMap[t.type]}
          `}
        >
          <span className="shrink-0">{iconMap[t.type]}</span>
          <span className="flex-1">{t.message}</span>
          <button
            onClick={() => removeToast(t.id)}
            className="shrink-0 hover:opacity-70 transition-opacity"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
}
