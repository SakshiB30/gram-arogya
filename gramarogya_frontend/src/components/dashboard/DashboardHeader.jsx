export default function DashboardHeader({ userName, roleTitle, subtitle }) {
  return (
    <div>
      <h1 className="text-3xl font-extrabold text-slate-900">
        Good Morning, {userName} <span>👋</span>
      </h1>
      <p className="mt-1 text-slate-500">
        {roleTitle}
        {subtitle ? ` • ${subtitle}` : ""}
      </p>
    </div>
  );
}