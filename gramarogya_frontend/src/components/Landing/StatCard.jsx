export default function StatCard({ value, label, icon: Icon, color, bg }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white/95 backdrop-blur-sm p-6 text-center shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
      <div className={`mx-auto flex h-12 w-12 items-center justify-center rounded-full ${bg}`}>
        <Icon className={`h-6 w-6 ${color}`} />
      </div>
      <p className="mt-3 text-2xl font-bold text-slate-900">{value}</p>
      <p className="text-sm text-slate-500">{label}</p>
    </div>
  );
}