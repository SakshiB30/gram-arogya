const DashboardHeader = ({
  userName,
  roleTitle,
  subtitle,
}) => {
  return (
    <div className="rounded-2xl bg-blue-50 p-6 shadow-sm">
      <h1 className="text-3xl font-bold text-slate-900">
        Welcome, {userName}
      </h1>

      <p className="mt-2 text-lg font-medium text-blue-700">
        {roleTitle}
      </p>

      <p className="mt-3 text-slate-600">
        {subtitle}
      </p>
    </div>
  );
};

export default DashboardHeader;