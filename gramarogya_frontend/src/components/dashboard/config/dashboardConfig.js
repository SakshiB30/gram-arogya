import {
  Users,
  CalendarCheck,
  CalendarClock,
  ClipboardList,
  HeartPulse,
  Baby,
  Activity,
  UserRound,
  ShieldCheck,
  FileText,
  Pill,
} from "lucide-react";

export const dashboardConfig = {
  ASHA: {
    header: {
      roleTitle: "ASHA Worker",
      subtitle:
        "Manage beneficiaries, visits and community healthcare activities.",
    },

    stats: [
      {
        key: "totalBeneficiaries",
        title: "Total Beneficiaries",
        icon: Users,
        iconBg: "bg-blue-100",
        iconColor: "text-blue-600",
      },
      {
        key: "todayVisits",
        title: "Today's Visits",
        icon: CalendarCheck,
        iconBg: "bg-green-100",
        iconColor: "text-green-600",
      },
      {
        key: "pregnantWomen",
        title: "Pregnant Women",
        icon: HeartPulse,
        iconBg: "bg-pink-100",
        iconColor: "text-pink-600",
      },
      {
        key: "children",
        title: "Children",
        icon: Baby,
        iconBg: "bg-yellow-100",
        iconColor: "text-yellow-600",
      },
    ],

    actions: [
      {
        title: "Add Beneficiary",
        path: "/app/beneficiaries/add",
        icon: Users,
        bg: "bg-blue-100",
        color: "text-blue-600",
      },
      {
        title: "New Visit",
        path: "/app/visit/add",
        icon: CalendarCheck,
        bg: "bg-green-100",
        color: "text-green-600",
      },
      {
        title: "Health Record",
        path: "/app/health-records/add",
        icon: Activity,
        bg: "bg-red-100",
        color: "text-red-600",
      },
    ],
  },

  ANM: {
    header: {
      roleTitle: "ANM",
      subtitle:
        "Monitor ASHA workers, beneficiaries and community health services.",
    },

    stats: [
      {
        key: "totalBeneficiaries",
        title: "Beneficiaries",
        icon: Users,
        iconBg: "bg-blue-100",
        iconColor: "text-blue-600",
      },
      {
        key: "totalVisits",
        title: "Total Visits",
        icon: ClipboardList,
        iconBg: "bg-green-100",
        iconColor: "text-green-600",
      },
      {
        key: "todayVisits",
        title: "Today's Visits",
        icon: CalendarCheck,
        iconBg: "bg-violet-100",
        iconColor: "text-violet-600",
      },
      {
        key: "upcomingVisits",
        title: "Upcoming Visits",
        icon: CalendarClock,
        iconBg: "bg-orange-100",
        iconColor: "text-orange-600",
      },
    ],

    actions: [
      {
        title: "Beneficiaries",
        path: "/app/beneficiaries",
        icon: Users,
        bg: "bg-blue-100",
        color: "text-blue-600",
      },
      {
        title: "Visits",
        path: "/app/visits",
        icon: CalendarCheck,
        bg: "bg-green-100",
        color: "text-green-600",
      },
      {
        title: "Reports",
        path: "/app/reports",
        icon: FileText,
        bg: "bg-violet-100",
        color: "text-violet-600",
      },
      {
        title: "ASHA Performance",
        path: "/app/reports",
        icon: Activity,
        bg: "bg-orange-100",
        color: "text-orange-600",
      },
    ],
  },

  ADMIN: {
    header: {
      roleTitle: "Administrator",
      subtitle:
        "Monitor GramArogya system, users and healthcare activities.",
    },

    stats: [
      {
        key: "totalBeneficiaries",
        title: "Total Beneficiaries",
        icon: Users,
        iconBg: "bg-blue-100",
        iconColor: "text-blue-600",
      },
      {
        key: "totalUsers",
        title: "Health Workers",
        icon: UserRound,
        iconBg: "bg-green-100",
        iconColor: "text-green-600",
      },
      {
        key: "totalAnms",
        title: "ANMs",
        icon: Activity,
        iconBg: "bg-violet-100",
        iconColor: "text-violet-600",
      },
      {
        key: "totalAshas",
        title: "ASHAs",
        icon: HeartPulse,
        iconBg: "bg-orange-100",
        iconColor: "text-orange-600",
      },
    ],

    actions: [
      {
        title: "Verify Users",
        path: "/app/users/verifications",
        icon: ShieldCheck,
        bg: "bg-violet-100",
        color: "text-violet-600",
      },
      {
        title: "Manage Users",
        path: "/app/users",
        icon: UserRound,
        bg: "bg-blue-100",
        color: "text-blue-600",
      },
      {
        title: "Reports",
        path: "/app/reports",
        icon: FileText,
        bg: "bg-green-100",
        color: "text-green-600",
      },
      {
        title: "Medicine Inventory",
        path: "/app/inventory",
        icon: Pill,
        bg: "bg-orange-100",
        color: "text-orange-600",
      },
    ],
  },
};