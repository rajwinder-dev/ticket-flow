import { NavLink, Outlet } from "react-router";
import { Building2, Lock, Settings2, User } from "lucide-react";
import PageHeader from "@/components/PageHeader";

const links = [
  { to: ".", label: "Profile", icon: User },
  { to: "security", label: "Security", icon: Lock },
  { to: "organization", label: "Organization", icon: Building2 },
  { to: "email", label: "Email Service", icon: Settings2 },
];

export default function SettingsLayout() {
  return (
    <div className="flex flex-col">
      <PageHeader
        title="Settings"
        description="Manage your account and organization settings, including profile information, security preferences, and general application settings."
      />

      <div className="p-8 h-[80vh] overflow-auto">
        {/* Tabs (Top Row) */}
        <nav className="flex flex-wrap gap-2 pb-2 mb-6">
          {links.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              end
              className={({ isActive }) =>
                [
                  "flex items-center gap-2 px-4 py-2 text-sm rounded-t-md transition-colors border-b-2",
                  isActive
                    ? "border-primary text-primary font-medium"
                    : "border-transparent text-muted-foreground hover:text-foreground hover:border-muted",
                ].join(" ")
              }
            >
              <Icon className="h-4 w-4" />
              {label}
            </NavLink>
          ))}
        </nav>

        {/* Content */}
        <div className="max-w-2xl">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
