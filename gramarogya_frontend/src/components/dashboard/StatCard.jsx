import React from "react";

const StatCard = ({
  title,
  value,
  icon: Icon,
  iconBg,
  iconColor,
  footer,
  footerIcon: FooterIcon,
  footerColor,
}) => {
  return (
    <div className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-slate-300 hover:shadow-lg">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">
            {title}
          </p>

          <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
            {value}
          </h2>
        </div>

        <div
          className={`flex h-12 w-12 items-center justify-center rounded-full transition-transform duration-200 group-hover:scale-110 ${iconBg}`}
        >
          <Icon className={iconColor} size={22} />
        </div>
      </div>

      {footer && (
        <div
          className={`mt-5 flex items-center gap-1 text-sm font-medium ${footerColor}`}
        >
          {FooterIcon && <FooterIcon size={15} />}
          <span>{footer}</span>
        </div>
      )}
    </div>
  );
};

export default StatCard;