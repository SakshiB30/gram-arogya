const DashboardHeader = ({ userName, roleTitle, subtitle }) => {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-50 via-blue-50 to-indigo-50 p-6 shadow-sm ring-1 ring-blue-100/50">
      <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-blue-200/20 blur-3xl" />

      <div className="relative">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">
          Welcome, {userName}
        </h1>

        <p className="mt-2 text-lg font-semibold text-blue-700">
          {roleTitle}
        </p>

        <p className="mt-3 text-slate-600">
          {subtitle}
        </p>
      </div>
    </div>
  );
};

export default DashboardHeader;