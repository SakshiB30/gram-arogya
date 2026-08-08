import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { dashboardConfig } from "./config/dashboardConfig";

const QuickActions = () => {

  const { user } = useSelector((state) => state.auth);

  const actions =
    dashboardConfig[user?.role]?.actions || [];


  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <h2 className="text-lg font-bold text-slate-900">
        Quick Actions
      </h2>


      {/* =====================================================
          ACTION CARDS
      ===================================================== */}

      <div
        className={`
          mt-5
          grid
          gap-4
          ${
            actions.length === 1
              ? "grid-cols-1"
              : actions.length === 2
              ? "grid-cols-1 sm:grid-cols-2"
              : actions.length === 3
              ? "grid-cols-1 sm:grid-cols-3"
              : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
          }
        `}
      >

        {actions.map((action) => {

          const Icon = action.icon;

          return (
            <Link
              key={action.title}
              to={action.path}
              className="
                flex
                min-h-[130px]
                flex-col
                items-center
                justify-center
                rounded-xl
                border
                border-slate-200
                p-5
                transition
                duration-200
                hover:-translate-y-1
                hover:bg-slate-50
                hover:shadow-md
              "
            >

              {/* =================================================
                  ICON
              ================================================= */}

              <div
                className={`
                  mb-3
                  flex
                  h-12
                  w-12
                  items-center
                  justify-center
                  rounded-full
                  ${action.bg}
                `}
              >

                <Icon
                  size={22}
                  className={action.color}
                />

              </div>


              {/* =================================================
                  TITLE
              ================================================= */}

              <span className="text-center text-sm font-medium text-slate-700">

                {action.title}

              </span>

            </Link>
          );

        })}

      </div>

    </div>
  );
};

export default QuickActions;
