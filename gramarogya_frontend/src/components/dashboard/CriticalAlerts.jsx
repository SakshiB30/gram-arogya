import { useState } from "react";
import { 
  AlertTriangle, 
  ChevronRight, 
  Pill, 
  ShieldCheck, 
  Activity, 
  CalendarClock,
  Heart,
  User,
  FileText,
  X,
  Eye,
  EyeOff,
  ArrowUpRight,
  Clock as ClockIcon
} from "lucide-react";

// =====================================================
// CONFIGURATION
// =====================================================

const ALERT_CONFIG = {
  HIGH_RISK: { 
    label: "Critical",
    box: "border-red-200 bg-gradient-to-br from-red-50 via-rose-50 to-pink-50 hover:from-red-100 hover:via-rose-100 hover:to-pink-100", 
    title: "text-red-800", 
    desc: "text-red-700", 
    link: "text-red-700 hover:text-red-900",
    icon: AlertTriangle,
    iconBg: "bg-red-500 text-white shadow-lg shadow-red-500/30",
    badge: "bg-red-500 text-white",
    border: "border-l-4 border-l-red-500",
    progress: "bg-red-500"
  },
  UPCOMING_VISIT: { 
    label: "Scheduled",
    box: "border-blue-200 bg-gradient-to-br from-blue-50 via-sky-50 to-cyan-50 hover:from-blue-100 hover:via-sky-100 hover:to-cyan-100", 
    title: "text-blue-800", 
    desc: "text-blue-700", 
    link: "text-blue-700 hover:text-blue-900",
    icon: CalendarClock,
    iconBg: "bg-blue-500 text-white shadow-lg shadow-blue-500/30",
    badge: "bg-blue-500 text-white",
    border: "border-l-4 border-l-blue-500",
    progress: "bg-blue-500"
  },
  TB_PATIENT: { 
    label: "Health Alert",
    box: "border-purple-200 bg-gradient-to-br from-purple-50 via-violet-50 to-fuchsia-50 hover:from-purple-100 hover:via-violet-100 hover:to-fuchsia-100", 
    title: "text-purple-800", 
    desc: "text-purple-700", 
    link: "text-purple-700 hover:text-purple-900",
    icon: Heart,
    iconBg: "bg-purple-500 text-white shadow-lg shadow-purple-500/30",
    badge: "bg-purple-500 text-white",
    border: "border-l-4 border-l-purple-500",
    progress: "bg-purple-500"
  },
  VERIFICATION: { 
    label: "Pending",
    box: "border-emerald-200 bg-gradient-to-br from-emerald-50 via-teal-50 to-green-50 hover:from-emerald-100 hover:via-teal-100 hover:to-green-100", 
    title: "text-emerald-800", 
    desc: "text-emerald-700", 
    link: "text-emerald-700 hover:text-emerald-900",
    icon: ShieldCheck,
    iconBg: "bg-emerald-500 text-white shadow-lg shadow-emerald-500/30",
    badge: "bg-emerald-500 text-white",
    border: "border-l-4 border-l-emerald-500",
    progress: "bg-emerald-500"
  },
  MEDICINE: { 
    label: "Medication",
    box: "border-amber-200 bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 hover:from-amber-100 hover:via-orange-100 hover:to-yellow-100", 
    title: "text-amber-800", 
    desc: "text-amber-700", 
    link: "text-amber-700 hover:text-amber-900",
    icon: Pill,
    iconBg: "bg-amber-500 text-white shadow-lg shadow-amber-500/30",
    badge: "bg-amber-500 text-white",
    border: "border-l-4 border-l-amber-500",
    progress: "bg-amber-500"
  },
  default: { 
    label: "Info",
    box: "border-slate-200 bg-gradient-to-br from-slate-50 via-gray-50 to-zinc-50 hover:from-slate-100 hover:via-gray-100 hover:to-zinc-100", 
    title: "text-slate-800", 
    desc: "text-slate-700", 
    link: "text-slate-700 hover:text-slate-900",
    icon: FileText,
    iconBg: "bg-slate-500 text-white shadow-lg shadow-slate-500/30",
    badge: "bg-slate-500 text-white",
    border: "border-l-4 border-l-slate-500",
    progress: "bg-slate-500"
  },
};

// =====================================================
// UTILITY FUNCTIONS
// =====================================================

const getTimeAgo = (timestamp) => {
  if (!timestamp) return null;
  const now = new Date();
  const alertTime = new Date(timestamp);
  const diffMs = now - alertTime;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return { label: "Just now", urgent: true };
  if (diffMins < 60) return { label: `${diffMins}m ago`, urgent: diffMins < 15 };
  if (diffHours < 24) return { label: `${diffHours}h ago`, urgent: false };
  return { label: `${diffDays}d ago`, urgent: false };
};

const getPriorityLevel = (type) => {
  const priorities = {
    HIGH_RISK: { level: 1, label: "Critical", color: "text-red-600 bg-red-100" },
    TB_PATIENT: { level: 2, label: "High", color: "text-orange-600 bg-orange-100" },
    MEDICINE: { level: 3, label: "Medium", color: "text-amber-600 bg-amber-100" },
    UPCOMING_VISIT: { level: 4, label: "Low", color: "text-blue-600 bg-blue-100" },
    VERIFICATION: { level: 5, label: "Info", color: "text-emerald-600 bg-emerald-100" },
  };
  return priorities[type] || { level: 5, label: "Info", color: "text-slate-600 bg-slate-100" };
};

// =====================================================
// SUB-COMPONENTS
// =====================================================

const AlertBadge = ({ type, label }) => {
  const priority = getPriorityLevel(type);
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${priority.color}`}>
      <span className="inline-block h-1.5 w-1.5 rounded-full bg-current" />
      {label || priority.label}
    </span>
  );
};

const AlertProgress = ({ type, progress }) => {
  const config = ALERT_CONFIG[type] || ALERT_CONFIG.default;
  if (!progress) return null;
  
  return (
    <div className="mt-3 w-full">
      <div className="flex items-center justify-between gap-2">
        <span className="text-[10px] font-medium text-slate-500">Progress</span>
        <span className="text-[10px] font-semibold text-slate-700">{progress}%</span>
      </div>
      <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-slate-200">
        <div 
          className={`h-full rounded-full transition-all duration-1000 ${config.progress}`}
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
};

const AlertMeta = ({ alert }) => {
  const items = [];
  
  if (alert.patientName) {
    items.push({ icon: User, label: alert.patientName });
  }
  if (alert.location) {
    items.push({ icon: Activity, label: alert.location });
  }
  if (alert.category) {
    items.push({ icon: FileText, label: alert.category });
  }

  if (items.length === 0) return null;

  return (
    <div className="mt-2 flex flex-wrap items-center gap-3">
      {items.map((item, idx) => (
        <div key={idx} className="flex items-center gap-1.5">
          <item.icon size={12} className="text-slate-400" />
          <span className="text-xs text-slate-600">{item.label}</span>
        </div>
      ))}
    </div>
  );
};

// =====================================================
// MAIN COMPONENT
// =====================================================

export default function CriticalAlerts({ alerts = [], onDismiss, onViewAll }) {
  const [dismissedAlerts, setDismissedAlerts] = useState(new Set());
  const [expandedAlerts, setExpandedAlerts] = useState(new Set());

  const handleDismiss = (alertId) => {
    setDismissedAlerts(prev => new Set([...prev, alertId]));
    if (onDismiss) onDismiss(alertId);
  };

  const toggleExpand = (alertId) => {
    setExpandedAlerts(prev => {
      const newSet = new Set(prev);
      if (newSet.has(alertId)) {
        newSet.delete(alertId);
      } else {
        newSet.add(alertId);
      }
      return newSet;
    });
  };

  const visibleAlerts = alerts.filter(alert => !dismissedAlerts.has(alert.id));

  if (visibleAlerts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-white p-12 text-center transition-all hover:border-emerald-200">
        <div className="relative">
          <div className="mb-4 text-6xl">✅</div>
          <div className="absolute -right-2 -top-2">
            <span className="inline-flex h-3 w-3 animate-ping rounded-full bg-emerald-400" />
          </div>
        </div>
        <h3 className="text-lg font-semibold text-slate-700">All Clear!</h3>
        <p className="mt-1 text-sm text-slate-400">No critical alerts requiring your attention</p>
        {onViewAll && (
          <button
            onClick={onViewAll}
            className="mt-4 inline-flex items-center gap-1 rounded-lg bg-slate-100 px-4 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-200"
          >
            View All Alerts
            <ArrowUpRight size={14} />
          </button>
        )}
      </div>
    );
  }

  // Show only latest 5 alerts with option to view more
  const displayAlerts = visibleAlerts.slice(0, 5);
  const hasMore = visibleAlerts.length > 5;

  return (
    <div className="space-y-4">
      {displayAlerts.map((alert) => {
        const config = ALERT_CONFIG[alert.type] || ALERT_CONFIG.default;
        const Icon = config.icon;
        const timeInfo = getTimeAgo(alert.createdAt || alert.timestamp);
        const isExpanded = expandedAlerts.has(alert.id);
        const priority = getPriorityLevel(alert.type);

        return (
          <div
            key={alert.id}
            className={`group relative overflow-hidden rounded-xl border bg-white p-4 transition-all duration-300 hover:shadow-xl hover:scale-[1.01] ${config.border} ${config.box}`}
          >
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-linear-to-r from-white/0 via-white/0 to-white/50 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

            {/* Content */}
            <div className="relative flex items-start gap-4">
              {/* Icon */}
              <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${config.iconBg} transition-transform duration-300 group-hover:scale-110`}>
                <Icon size={20} />
              </div>

              {/* Main Content */}
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <h4 className={`text-sm font-semibold ${config.title}`}>
                      {alert.title}
                    </h4>
                    <AlertBadge type={alert.type} label={alert.priorityLabel} />
                    {alert.isNew && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-2 py-0.5 text-[10px] font-semibold text-blue-600">
                        <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-blue-500" />
                        New
                      </span>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-2 shrink-0">
                    {timeInfo && (
                      <span className={`text-xs ${timeInfo.urgent ? 'font-semibold text-red-500 animate-pulse' : 'text-slate-400'}`}>
                        {timeInfo.urgent && <ClockIcon size={12} className="inline mr-1" />}
                        {timeInfo.label}
                      </span>
                    )}
                    
                    {/* Action Buttons */}
                    <div className="flex items-center gap-1">
                      {alert.details && (
                        <button
                          onClick={() => toggleExpand(alert.id)}
                          className="rounded-lg p-1 text-slate-400 transition-colors hover:bg-white/50 hover:text-slate-600"
                          aria-label={isExpanded ? "Show less" : "Show more"}
                        >
                          {isExpanded ? <EyeOff size={14} /> : <Eye size={14} />}
                        </button>
                      )}
                      <button
                        onClick={() => handleDismiss(alert.id)}
                        className="rounded-lg p-1 text-slate-400 transition-colors hover:bg-white/50 hover:text-red-500"
                        aria-label="Dismiss alert"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  </div>
                </div>

                <p className={`mt-1 text-sm ${config.desc}`}>
                  {alert.description}
                </p>

                {/* Meta Information */}
                <AlertMeta alert={alert} />

                {/* Expanded Details */}
                {isExpanded && alert.details && (
                  <div className="mt-3 rounded-lg bg-white/60 p-3 backdrop-blur-sm">
                    <p className="text-xs text-slate-600">{alert.details}</p>
                  </div>
                )}

                {/* Progress Bar */}
                {alert.progress !== undefined && (
                  <AlertProgress type={alert.type} progress={alert.progress} />
                )}

                {/* Action Buttons */}
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  {alert.actionLabel && alert.actionHref && (
                    <a
                      href={alert.actionHref}
                      className={`inline-flex items-center gap-1.5 text-sm font-medium transition-all hover:gap-2.5 ${config.link}`}
                    >
                      {alert.actionLabel}
                      <ChevronRight size={14} className="transition-transform group-hover:translate-x-0.5" />
                    </a>
                  )}
                  
                  {alert.secondaryAction && (
                    <button
                      onClick={alert.secondaryAction.onClick}
                      className="inline-flex items-center gap-1 rounded-lg bg-white/60 px-3 py-1 text-xs font-medium text-slate-600 transition-colors hover:bg-white/80"
                    >
                      {alert.secondaryAction.label}
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Priority Badge - Top Right Corner */}
            <div className="absolute -right-8 -top-8 h-16 w-16 rotate-45 bg-gradient-to-r from-red-500/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            
            {priority.level <= 2 && (
              <div className="absolute right-4 top-4">
                <span className="inline-flex h-2 w-2 animate-ping rounded-full bg-red-400" />
                <span className="absolute inline-flex h-2 w-2 rounded-full bg-red-500" />
              </div>
            )}
          </div>
        );
      })}

      {/* View More Footer */}
      {hasMore && (
        <div className="flex items-center justify-between rounded-xl border border-dashed border-slate-200 bg-white/50 p-3 backdrop-blur-sm">
          <span className="text-xs text-slate-500">
            +{visibleAlerts.length - 5} more alerts
          </span>
          <button
            onClick={onViewAll}
            className="inline-flex items-center gap-1 text-sm font-medium text-blue-600 transition-colors hover:text-blue-800"
          >
            View All
            <ArrowUpRight size={14} />
          </button>
        </div>
      )}
    </div>
  );
}
