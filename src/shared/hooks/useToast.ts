import { 
  // useState, 
  useCallback 
} from 'react';
import type { ToastProps } from '@/shared/ui/Toast';
import { create } from 'zustand';

type ToastInput = Omit<ToastProps, 'id' | 'onClose'>;

interface ToastStore {
  toasts: ToastProps[];
  addToast: (toast: ToastInput) => void;
  removeToast: (id: string) => void;
}

// pakai zustand biar data toast bisa dipakai bareng di semua komponen/halaman.
const useToastStore = create<ToastStore>()((set, get) => ({
  toasts: [],
  addToast: (toast) => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    const newToast: ToastProps = {
      ...toast,
      id,
      onClose: get().removeToast, // close toast dari store global.
    };
    set((state) => ({ toasts: [...state.toasts, newToast] }));
  },
  removeToast: (id) => {
    set((state) => ({ toasts: state.toasts.filter((toast) => toast.id !== id) }));
  },
}));

export function useToast() {
  // before: dari skafold, toast disimpan dengan useState per komponen
  // const [toasts, setToasts] = useState<ToastProps[]>([]);
  // const addToast = useCallback((toast: ToastInput) => {
  //   const id = `toast-${Date.now()}-${Math.random()}`;
  //   const newToast: ToastProps = {
  //     ...toast,
  //     id,
  //     onClose: (toastId: string) => {
  //       setToasts((prev) => prev.filter((t) => t.id !== toastId));
  //     },
  //   };
  //   setToasts((prev) => [...prev, newToast]);
  // }, []);

  // after: cara pakai tetap sama tapi sumber state-nya dipusatkan di store zustand (global) supaya dipakai bersama antar halaman.
  const toasts = useToastStore((state) => state.toasts);
  const addToast = useToastStore((state) => state.addToast);

  const success = useCallback(
    (title: string, message?: string) => {
      addToast({ type: 'success', title, message });
    },
    [addToast]
  );

  const error = useCallback(
    (title: string, message?: string) => {
      addToast({ type: 'error', title, message });
    },
    [addToast]
  );

  const info = useCallback(
    (title: string, message?: string) => {
      addToast({ type: 'info', title, message });
    },
    [addToast]
  );

  const warning = useCallback(
    (title: string, message?: string) => {
      addToast({ type: 'warning', title, message });
    },
    [addToast]
  );

  return {
    toasts,
    addToast,
    success,
    error,
    info,
    warning,
  };
}
