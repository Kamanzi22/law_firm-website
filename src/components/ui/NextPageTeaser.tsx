import { useEffect, useRef, useState, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";

interface NextPageTeaserProps {
  nextPath: string;
  children: ReactNode;
}

/**
 * Sits at the bottom of a page, in normal document flow, one viewport
 * tall. As the user scrolls it into view its opacity rises from 0 to 1 —
 * so the next page's hero visibly fades in continuously as you scroll,
 * rather than snapping in on a click. Once fully in view, it completes
 * the actual route change (with `state.skipTransition` so the click-based
 * AnimatePresence crossfade in App.tsx doesn't also fire and fight this
 * scroll-driven one) and resets scroll to the top of the new page, which
 * — since the teaser already looks identical to the new page's real hero
 * at that point — is invisible.
 */
export function NextPageTeaser({ nextPath, children }: NextPageTeaserProps) {
  const navigate = useNavigate();
  const ref = useRef<HTMLDivElement>(null);
  const [opacity, setOpacity] = useState(0);
  const hasNavigatedRef = useRef(false);

  useEffect(() => {
    hasNavigatedRef.current = false;
    let rafId = 0;

    function update() {
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const raw = (viewportHeight - rect.top) / viewportHeight;
      const clamped = Math.min(1, Math.max(0, raw));
      setOpacity(clamped);

      if (clamped >= 1 && !hasNavigatedRef.current) {
        hasNavigatedRef.current = true;
        navigate(nextPath, { state: { skipTransition: true } });
        window.scrollTo({ top: 0 });
      }
    }

    function onScroll() {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(update);
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    update();
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(rafId);
    };
  }, [nextPath, navigate]);

  return (
    <div ref={ref} style={{ opacity }} className="min-h-screen" aria-hidden="true">
      {children}
    </div>
  );
}
