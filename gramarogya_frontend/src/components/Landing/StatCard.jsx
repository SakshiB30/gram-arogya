export default function StatCard({
    value,
    label
}) {
    return (
        <div className="rounded-xl border border-slate-200 bg-white py-8 text-center shadow-sm">
            <p className="text-3xl font-bold text-blue-700">
                {value}
            </p>

            <p className="mt-1 text-sm text-slate-500">
                {label}
            </p>
        </div>
    );
}