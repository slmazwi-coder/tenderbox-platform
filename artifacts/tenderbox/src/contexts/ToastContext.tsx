import { createContext, useContext, useState, useCallback } from "react";
import { CheckCircle, AlertTriangle, XCircle, Info, X } from "lucide-react";

type ToastType = "success" | "warning" | "error" | "info";

interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContextValue {
  toast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextValue>({ toast: () => {} });

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const toast = useCallback((message: string, type: ToastType = "success") => {
    const id = Math.random().toString(36).slice(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 4500);
  }, []);

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      {toasts.length > 0 && (
        <div className="fixed bottom-6 right-6 z-[60] flex flex-col gap-2 w-full max-w-sm">
          {toasts.map((t) => <ToastItem key={t.id} toast={t} onDismiss={dismiss} />)}
        </div>
      )}
    </ToastContext.Provider>
  );
}

export function useToast() {
  return useContext(ToastContext);
}

const CONFIG: Record<ToastType, { icon: typeof CheckCircle; border: string; bg: string; iconCls: string }> = {
  success: { icon: CheckCircle, border: "border-success/30", bg: "bg-card", iconCls: "text-success" },
  warning: { icon: AlertTriangle, border: "border-warning/30", bg: "bg-card", iconCls: "text-warning" },
  error: { icon: XCircle, border: "border-danger/30", bg: "bg-card", iconCls: "text-danger" },
  info: { icon: Info, border: "border-primary/30", bg: "bg-card", iconCls: "text-primary" },
};

function ToastItem({ toast, onDismiss }: { toast: Toast; onDismiss: (id: string) => void }) {
  const { icon: Icon, border, bg, iconCls } = CONFIG[toast.type];
  return (
    <div className={`flex items-start gap-3 rounded-lg border ${border} ${bg} px-4 py-3 shadow-lg`}>
      <Icon className={`h-4 w-4 shrink-0 mt-0.5 ${iconCls}`} />
      <span className="flex-1 text-sm text-foreground">{toast.message}</span>
      <button onClick={() => onDismiss(toast.id)} className="shrink-0 text-muted-foreground hover:text-foreground">
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}
