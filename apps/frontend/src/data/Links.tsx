import type { ReactNode } from "react";
import {
  CardBoardIcon,
  DashIcon,
  HelpIcons,
  HumanIcon,
  PieIcon,
  SettingIcon,
  SheetIcon,
  VolumeIcon,
} from "../components/ui/Icons";
import Dashboard from "../features/dashboard/Dashboard";
import Employees from "../features/employees/Employees";
import Help from "../features/Help/Help";
import Settings from "../features/settings/Settings";
import Teams from "../features/teams/Teams";
import Roles from "../features/roles/Roles";
import PunchIns from "../features/punchIns/PunchIns";
import Leaves from "../features/leaves/Leaves";
import Holidays from "../features/holidays/Holidays";
import Goals from "../features/goals/Goals";
import Reviews from "../features/reviews/Reviews";
import Salary from "../features/salary/Salary";
import Bonuses from "../features/bonuses/Bonuses";
import Chats from "../features/chats/Chats";
import Announcements from "../features/Announcements/Anoucemnts";
import EmployeeDetails from "../features/employeeDetails/EmployeeDetails";
import TaskDetails from "../features/taskDetails/TaskDetails";
import SalaryDetails from "../features/salary/components/SalaryDetails";
type NavItem = {
  href: string;
  label: string;
  icon?: ReactNode;
  component: ReactNode;
  matchType?: string;
  type?: "main" | "footer" | "group";
  index?: boolean;
};

type NavGroup = {
  groupName: string;
  groupIcon: ReactNode;
  type: "group";
  items: NavItem[];
};
// direct links
export const directNvaLink: NavItem[] = [
  {
    href: "/",
    label: "Dashboard",
    matchType: "exact",
    icon: <PieIcon />,
    component: <Dashboard />,
    type: "main",
  },
  {
    href: "/settings",
    label: "Settings",
    icon: <SettingIcon />,
    component: <Settings />,
    type: "footer",
  },
  {
    href: "/help",
    label: "Help",
    icon: <HelpIcons />,
    component: <Help />,
    type: "footer",
  },

  {
    href: "/employees/:id",
    label: "Employee Details",
    component: <EmployeeDetails />,
  },
  {
    href: "/goals/:id",
    label: "Goal Details",
    component: <TaskDetails />,
  },
  {
    href: "/salary/:id",
    label: "Salary Details",
    component: <SalaryDetails />,
  },
];
// nested links
export const navLinkGroups: NavGroup[] = [
  {
    groupName: "People",
    groupIcon: <HumanIcon />,
    type: "group",
    items: [
      {
        href: "/employees",
        label: "Employees",
        component: <Employees />,
      },
      {
        href: "/teams",
        label: "Teams",
        component: <Teams />,
      },
      {
        href: "/role",
        label: "Roles",
        component: <Roles />,
      },
    ],
  },
  {
    groupName: "Attendance",
    groupIcon: <SheetIcon />,
    type: "group",
    items: [
      {
        href: "/punch-Ins",
        label: "Punch Ins",
        component: <PunchIns />,
      },
      {
        href: "/leaves",
        label: "Leaves",
        component: <Leaves />,
      },
      {
        href: "/holidays",
        label: "Holidays",
        component: <Holidays />,
      },
    ],
  },
  {
    groupName: "Performance",
    groupIcon: <DashIcon />,
    type: "group",
    items: [
      {
        href: "/goals",
        label: "Goals",
        component: <Goals />,
      },
      {
        href: "/reviews",
        label: "Reviews",
        component: <Reviews />,
      },
    ],
  },
  {
    groupName: "Community",
    groupIcon: <CardBoardIcon />,
    type: "group",
    items: [
      {
        href: "/salary",
        label: "Salary",
        component: <Salary />,
      },
      {
        href: "/other",
        label: "Extra Payments",
        component: <Bonuses />,
      },
    ],
  },
  {
    groupName: "Communication",
    groupIcon: <VolumeIcon />,
    type: "group",
    items: [
      {
        href: "/chat",
        label: "Chat",
        matchType: "exact",
        component: <Chats />,
      },
      {
        href: "/announcements",
        label: "Announcements",
        matchType: "exact",
        component: <Announcements />,
      },
    ],
  },
];

const nestedNavLInks: NavItem[] = navLinkGroups.flatMap((item) => {
  return item.items;
});
// ues for dynamic headers
export const navLinks = [...directNvaLink, ...nestedNavLInks].sort(
  (a, b) => b.href.length - a.href.length,
);
