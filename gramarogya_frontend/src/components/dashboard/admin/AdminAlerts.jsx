import { AlertTriangle } from "lucide-react";

export default function AdminAlerts({ alerts }) {
  const priorityColor = (priority) => {
    switch (priority) {
      case "HIGH":
        return "bg-red-100 text-red-700";

      case "MEDIUM":
        return "bg-yellow-100 text-yellow-700";

      case "LOW":
        return "bg-green-100 text-green-700";

      default:
        return "bg-slate-100 text-slate-700";
    }
  };

  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm">

      <div className="mb-6 flex items-center gap-2">
        <AlertTriangle
          className="text-red-500"
          size={22}
        />

        <h2 className="text-lg font-semibold">
          Critical Alerts
        </h2>
      </div>

      {alerts.length === 0 ? (

        <div className="py-10 text-center text-slate-400">
          No active alerts
        </div>

      ) : (

        <div className="space-y-4">

          {alerts.map((alert) => (

            <div
              key={alert.id}
              className="rounded-xl border border-slate-100 p-4 transition hover:bg-slate-50"
            >

              <div className="flex items-center justify-between">

                <h3 className="font-semibold text-slate-800">
                  {alert.title}
                </h3>

                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${priorityColor(
                    alert.priority
                  )}`}
                >
                  {alert.priority}
                </span>

              </div>

              <p className="mt-2 text-sm text-slate-600">
                {alert.description}
              </p>

              <div className="mt-3">
                <span className="rounded bg-slate-100 px-2 py-1 text-xs text-slate-600">
                  {alert.type}
                </span>
              </div>

            </div>

          ))}

        </div>

      )}

    </div>
  );
}