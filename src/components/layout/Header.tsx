import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { Menu, X, Scale } from "lucide-react";
import { strings } from "../../data/strings";
import { Button } from "../ui/Button";
import { useAppData } from "../../lib/DataProvider";

const navItems = [
  { to: "/", label: strings.nav.home },
  { to: "/services", label: strings.nav.services },
  { to: "/about", label: strings.nav.about },
  { to: "/insights", label: strings.nav.insights },
  { to: "/contact", label: strings.nav.contact },
];

export function Header() {
  const { firm } = useAppData();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isDrawerOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isDrawerOpen]);

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `text-sm font-medium transition-colors ${
      isActive ? "text-white underline underline-offset-4" : "text-white/70 hover:text-white"
    }`;

  return (
    <header
      className={`sticky top-0 z-40 transition-colors duration-300 ${
        isScrolled ? "bg-brand-teal shadow-md" : "bg-brand-teal/95 backdrop-blur"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <NavLink to="/" className="flex items-center gap-2 text-white" aria-label={`${firm.name} home`}>
          {firm.logoUrl ? (
            <img src={firm.logoUrl} alt="" className="h-7 w-auto" aria-hidden="true" />
          ) : (
            <Scale className="h-6 w-6 text-white" aria-hidden="true" />
          )}
          <span className="font-display text-lg font-semibold leading-tight sm:text-xl">
            {firm.shortName}
          </span>
        </NavLink>

        <nav className="hidden items-center gap-8 lg:flex" aria-label="Primary">
          {navItems.map((item) => (
            <NavLink key={item.to} to={item.to} end={item.to === "/"} className={linkClass}>
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden lg:block">
          <Button to="/book" size="md" variant="secondary">
            {strings.nav.bookConsultation}
          </Button>
        </div>

        <button
          type="button"
          className="inline-flex items-center justify-center rounded-sm p-2 text-white lg:hidden"
          aria-label={strings.nav.menu}
          aria-expanded={isDrawerOpen}
          aria-controls="mobile-drawer"
          onClick={() => setIsDrawerOpen(true)}
        >
          <Menu className="h-6 w-6" aria-hidden="true" />
        </button>
      </div>

      {isDrawerOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            aria-label={strings.nav.closeMenu}
            className="absolute inset-0 bg-brand-navy/50"
            onClick={() => setIsDrawerOpen(false)}
          />
          <div
            id="mobile-drawer"
            role="dialog"
            aria-modal="true"
            aria-label={strings.nav.menu}
            className="absolute left-0 top-0 flex h-full w-full max-w-xs flex-col gap-8 bg-brand-teal px-6 py-6 shadow-xl"
          >
            <div className="flex items-center justify-between">
              <span className="font-display text-lg font-semibold text-white">{firm.shortName}</span>
              <button
                type="button"
                aria-label={strings.nav.closeMenu}
                className="rounded-sm p-2 text-white"
                onClick={() => setIsDrawerOpen(false)}
              >
                <X className="h-6 w-6" aria-hidden="true" />
              </button>
            </div>

            <nav className="flex flex-col gap-6" aria-label="Mobile">
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.to === "/"}
                  className={({ isActive }) =>
                    `font-display text-2xl font-medium text-white ${isActive ? "underline underline-offset-4" : ""}`
                  }
                  onClick={() => setIsDrawerOpen(false)}
                >
                  {item.label}
                </NavLink>
              ))}
            </nav>

            <Button
              to="/book"
              size="lg"
              variant="secondary"
              className="mt-auto w-full"
              onClick={() => setIsDrawerOpen(false)}
            >
              {strings.nav.bookConsultation}
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}
