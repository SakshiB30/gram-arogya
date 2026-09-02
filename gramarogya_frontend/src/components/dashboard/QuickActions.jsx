import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { dashboardConfig } from "./config/dashboardConfig";

const QuickActions = ({ className = "" }) => {
  const { user } = useSelector((state) => state.auth);
  const actions = dashboardConfig[user?.role]?.actions || [];

  return (
    <div className={className}>
      {actions.map((action) => {
        const Icon = action.icon;
        return (
          <Link
            key={action.title}
            to={action.path}
            className="flex flex-col items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-5 text-center transition-all duration-200 hover:border-blue-400 hover:bg-blue-50 hover:shadow-md active:scale-95"
          >
            <div className="rounded-full bg-blue-100 p-2.5 text-blue-600">
              <Icon size={20} />
            </div>
            <span className="text-sm font-semibold text-slate-700">
              {action.title}
            </span>
          </Link>
        );
      })}
    </div>
  );
};

export default QuickActions;