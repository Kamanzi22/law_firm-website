import { useLocation } from "react-router-dom";
import { Button } from "../ui/Button";
import { strings } from "../../data/strings";

export function StickyBookButton() {
  const location = useLocation();
  if (location.pathname === "/book") return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-30 border-t border-brand-navy/10 bg-brand-cream/95 p-3 backdrop-blur lg:hidden">
      <Button to="/book" size="md" className="w-full">
        {strings.nav.bookConsultation}
      </Button>
    </div>
  );
}
