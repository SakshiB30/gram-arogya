import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { dashboardConfig } from "./config/dashboardConfig";

const QuickActions = () => {
  const { user } = useSelector((state) => state.auth);
  const actions = dashboardConfig[user?.role]?.actions || [];

  return (
    <div className="flex flex-wrap justify-end gap-3">
      {actions.map((action) => {
        const Icon = action.icon;
        return (
          <Link
            key={action.title}
            to={action.path}
            className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-5 py-3 text-sm font-semibold text-slate-700 shadow-sm transition-colors hover:bg-slate-100"
          >
            <Icon size={16} />
            {action.title}
          </Link>
        );
      })}
    </div>
  );
};

export default QuickActions;
