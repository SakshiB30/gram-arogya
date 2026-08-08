export default function FeatureCard({ icon: Icon, iconBg, iconColor, title, children }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white/95 backdrop-blur-sm p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
      <div className={`inline-flex h-11 w-11 items-center justify-center rounded-xl ${iconBg}`}>
        <Icon className={`h-5 w-5 ${iconColor}`} />
      </div>
      <h3 className="mt-5 text-lg font-semibold text-slate-900">{title}</h3>
      <div className="mt-3 text-sm text-slate-600">{children}</div>
    </div>
  );
}