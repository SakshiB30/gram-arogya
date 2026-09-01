const toneStyles = {
  amber: {
    border: "border-2 border-amber-300",
    iconBg: "bg-amber-100",
    iconColor: "text-amber-500",
    value: "text-amber-500",
    title: "text-slate-500",
  },
  red: {
    border: "border-2 border-red-300",
    iconBg: "bg-red-100",
    iconColor: "text-red-500",
    value: "text-red-600",
    title: "text-red-600 font-semibold",
  },
  default: {
    border: "border border-slate-200",
    iconBg: "bg-blue-100",
    iconColor: "text-blue-600",
    value: "text-slate-900",
    title: "text-slate-500",
  },
};

export default function StatCard({ title, value, icon: Icon, highlight, iconBg, iconColor }) {
  const tone = toneStyles[highlight] || toneStyles.default;

  return (
    <div
      className={`rounded-2xl bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-lg ${tone.border}`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className={`text-sm font-medium ${tone.title}`}>{title}</p>
          <h2 className={`mt-2 text-3xl font-bold tracking-tight ${tone.value}`}>{value}</h2>
        </div>

        <div
          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full ${
            iconBg || tone.iconBg
          }`}
        >
          <Icon size={22} className={iconColor || tone.iconColor} />
        </div>
      </div>
    </div>
  );
}