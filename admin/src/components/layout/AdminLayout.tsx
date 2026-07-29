import { useEffect, useState } from "react";
import { NavLink, Outlet, useLocation } from "react-router-dom";
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
  Menu,
  X,
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
  { to: "/account", label: "Profile", icon: Settings },
];

function NavList({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <nav className="flex-1 space-y-1 px-3" aria-label="Admin navigation">
      {navItems.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          end={item.end}
          onClick={onNavigate}
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
  );
}

export function AdminLayout() {
  const { signOut } = useAuth();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setIsDrawerOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    document.body.style.overflow = isDrawerOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isDrawerOpen]);

  return (
    <div className="flex min-h-screen bg-brand-gray-50">
      <aside className="hidden w-64 shrink-0 flex-col border-r border-brand-gray-200 bg-brand-navy text-brand-cream lg:flex">
        <div className="flex items-center gap-2 px-6 py-5">
          <Scale className="h-6 w-6 text-brand-gold" aria-hidden="true" />
          <span className="font-display text-lg font-semibold">Demo Admin</span>
        </div>
        <NavList />
        <button
          type="button"
          onClick={() => signOut()}
          className="m-3 flex items-center gap-3 rounded-sm px-3 py-2.5 text-sm font-medium text-brand-gray-200 hover:bg-white/5"
        >
          <LogOut className="h-4 w-4" aria-hidden="true" />
          Log out
        </button>
      </aside>

      {isDrawerOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            aria-label="Close menu"
            className="absolute inset-0 bg-brand-navy/80"
            onClick={() => setIsDrawerOpen(false)}
          />
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Admin navigation"
            className="absolute left-0 top-0 flex h-full w-72 max-w-[80vw] flex-col bg-brand-navy py-5 shadow-xl"
          >
            <div className="flex items-center justify-between px-6 pb-5">
              <div className="flex items-center gap-2 text-brand-cream">
                <Scale className="h-6 w-6 text-brand-gold" aria-hidden="true" />
                <span className="font-display text-lg font-semibold">Demo Admin</span>
              </div>
              <button
                type="button"
                aria-label="Close menu"
                className="rounded-sm p-1.5 text-brand-cream"
                onClick={() => setIsDrawerOpen(false)}
              >
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>

            <NavList onNavigate={() => setIsDrawerOpen(false)} />

            <button
              type="button"
              onClick={() => signOut()}
              className="mx-3 mt-3 flex items-center gap-3 rounded-sm px-3 py-2.5 text-sm font-medium text-brand-gray-200 hover:bg-white/5"
            >
              <LogOut className="h-4 w-4" aria-hidden="true" />
              Log out
            </button>
          </div>
        </div>
      )}

      <div className="flex flex-1 flex-col">
        <header className="flex items-center justify-between border-b border-brand-gray-200 bg-white px-4 py-3 lg:hidden">
          <button
            type="button"
            aria-label="Open menu"
            onClick={() => setIsDrawerOpen(true)}
            className="rounded-sm p-2 text-brand-navy hover:bg-brand-gray-100"
          >
            <Menu className="h-5 w-5" aria-hidden="true" />
          </button>
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

        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
