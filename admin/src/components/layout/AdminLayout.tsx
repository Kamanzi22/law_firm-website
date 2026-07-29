import { NavLink, Outlet } from "react-router-dom";
import {
  LayoutDashboard,
  Building2,
  Briefcase,
  Users,
  Quote,
  Newspaper,
  CalendarClock,
  CalendarCheck,
  Mail,
  LogOut,
  Scale,
  Settings,
} from "lucide-react";
import { useAuth } from "../../lib/AuthProvider";

const navItems = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/firm-profile", label: "Firm Profile", icon: Building2 },
  { to: "/services", label: "Services", icon: Briefcase },
  { to: "/team", label: "Team", icon: Users },
  { to: "/testimonials", label: "Testimonials", icon: Quote },
  { to: "/articles", label: "Insights", icon: Newspaper },
  { to: "/availability", label: "Availability", icon: CalendarClock },
  { to: "/bookings", label: "Bookings", icon: CalendarCheck },
  { to: "/messages", label: "Messages", icon: Mail },
  { to: "/account", label: "Account", icon: Settings },
];

export function AdminLayout() {
  const { signOut } = useAuth();

  return (
    <div className="flex min-h-screen bg-brand-gray-50">
      <aside className="hidden w-64 shrink-0 flex-col border-r border-brand-gray-200 bg-brand-navy text-brand-cream lg:flex">
        <div className="flex items-center gap-2 px-6 py-5">
          <Scale className="h-6 w-6 text-brand-gold" aria-hidden="true" />
          <span className="font-display text-lg font-semibold">Demo Admin</span>
        </div>
        <nav className="flex-1 space-y-1 px-3" aria-label="Admin navigation">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-sm px-3 py-2.5 text-sm font-medium transition-colors ${
                  isActive ? "bg-brand-gold text-brand-navy" : "text-brand-gray-200 hover:bg-white/5"
                }`
              }
            >
              <item.icon className="h-4 w-4" aria-hidden="true" />
              {item.label}
            </NavLink>
          ))}
        </nav>
        <button
          type="button"
          onClick={() => signOut()}
          className="m-3 flex items-center gap-3 rounded-sm px-3 py-2.5 text-sm font-medium text-brand-gray-200 hover:bg-white/5"
        >
          <LogOut className="h-4 w-4" aria-hidden="true" />
          Log out
        </button>
      </aside>

      <div className="flex flex-1 flex-col">
        <header className="flex items-center justify-between border-b border-brand-gray-200 bg-white px-4 py-3 lg:hidden">
          <div className="flex items-center gap-2 text-brand-navy">
            <Scale className="h-5 w-5 text-brand-gold-dark" aria-hidden="true" />
            <span className="font-display text-base font-semibold">Demo Admin</span>
          </div>
          <button
            type="button"
            onClick={() => signOut()}
            aria-label="Log out"
            className="rounded-sm p-2 text-brand-navy hover:bg-brand-gray-100"
          >
            <LogOut className="h-5 w-5" aria-hidden="true" />
          </button>
        </header>

        <nav
          className="flex gap-1 overflow-x-auto border-b border-brand-gray-200 bg-white px-2 py-2 lg:hidden"
          aria-label="Admin navigation"
        >
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `flex shrink-0 items-center gap-1.5 rounded-sm px-3 py-2 text-xs font-medium ${
                  isActive ? "bg-brand-gold text-brand-navy" : "text-brand-gray-500"
                }`
              }
            >
              <item.icon className="h-3.5 w-3.5" aria-hidden="true" />
              {item.label}
            </NavLink>
          ))}
        </nav>

        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
