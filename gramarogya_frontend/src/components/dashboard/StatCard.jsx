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
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm hover:shadow-md transition">

      {/* Header */}
      <div className="flex items-center justify-between">

        <div>
          <p className="text-sm font-medium text-slate-500">
            {title}
          </p>

          <h2 className="mt-2 text-3xl font-bold text-slate-900">
            {value}
          </h2>
        </div>

        <div
          className={`flex h-12 w-12 items-center justify-center rounded-full ${iconBg}`}
        >
          <Icon className={iconColor} size={22} />
        </div>

      </div>

      {/* Footer */}

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