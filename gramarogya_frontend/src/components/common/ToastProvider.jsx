import {
  useCallback,
  useMemo,
  useState,
} from "react";
import {
  AlertTriangle,
  CheckCircle2,
  Info,
  X,
  XCircle,
} from "lucide-react";
import { ToastContext } from "./toastContext";

const styles = {
  success: {
    icon: CheckCircle2,
    border: "border-emerald-200",
    bg: "bg-emerald-50",
    text: "text-emerald-800",
    iconText: "text-emerald-600",
  },
  error: {
    icon: XCircle,
    border: "border-red-200",
    bg: "bg-red-50",
    text: "text-red-800",
    iconText: "text-red-600",
  },
  warning: {
    icon: AlertTriangle,
    border: "border-amber-200",
    bg: "bg-amber-50",
    text: "text-amber-800",
    iconText: "text-amber-600",
  },
  info: {
    icon: Info,
    border: "border-blue-200",
    bg: "bg-blue-50",
    text: "text-blue-800",
    iconText: "text-blue-600",
  },
};

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const dismissToast = useCallback((id) => {
    setToasts((current) =>
      current.filter((toast) => toast.id !== id)
    );
  }, []);

  const showToast = useCallback(
    ({ type = "info", title, message, duration = 4500 }) => {
      const id = crypto.randomUUID();

      setToasts((current) => [
        ...current,
        { id, type, title, message },
      ]);

      window.setTimeout(() => {
        dismissToast(id);
      }, duration);

      return id;
    },
    [dismissToast]
  );

  const value = useMemo(
    () => ({ showToast, dismissToast }),
    [showToast, dismissToast]
  );

  return (
    <ToastContext.Provider value={value}>
      {children}

      <div className="fixed right-4 top-4 z-[100] flex w-[calc(100vw-2rem)] max-w-sm flex-col gap-3">
        {toasts.map((toast) => {
          const style = styles[toast.type] || styles.info;
          const Icon = style.icon;

          return (
            <div
              key={toast.id}
              className={`rounded-lg border ${style.border} ${style.bg} p-4 shadow-lg shadow-slate-900/10`}
              role="status"
            >
              <div className="flex items-start gap-3">
                <Icon
                  className={`mt-0.5 h-5 w-5 shrink-0 ${style.iconText}`}
                />

                <div className={`min-w-0 flex-1 ${style.text}`}>
                  {toast.title && (
                    <p className="text-sm font-semibold">
                      {toast.title}
                    </p>
                  )}

                  {toast.message && (
                    <p className="mt-1 text-sm leading-5">
                      {toast.message}
                    </p>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => dismissToast(toast.id)}
                  className="rounded p-1 text-slate-400 hover:bg-white/60 hover:text-slate-700"
                  aria-label="Dismiss notification"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}
