import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

const EARLY_THRESHOLD_PX = 350; // trigger before the literal bottom, not at it
const RESET_THRESHOLD_PX = EARLY_THRESHOLD_PX * 2;

/**
 * Scrolling down near the bottom of the page auto-navigates to `nextPath`,
 * so the main pages read as one continuous tour instead of requiring a nav
 * click. Pairs with the AnimatePresence page transition in App.tsx for the
 * crossfade. Pass null on the last page in the sequence to disable.
 *
 * This is a progressive enhancement on top of — not a replacement for —
 * the header nav links, which remain the fully accessible way to move
 * between pages (keyboard/screen-reader users aren't affected either way).
 */
export function useScrollAdvance(nextPath: string | null) {
  const navigate = useNavigate();
  const hasTriggeredRef = useRef(false);
  const lastScrollYRef = useRef(0);

  useEffect(() => {
    if (!nextPath) return;

    hasTriggeredRef.current = false;
    lastScrollYRef.current = window.scrollY;

    function handleScroll() {
      const currentY = window.scrollY;
      const scrollingDown = currentY > lastScrollYRef.current;
      lastScrollYRef.current = currentY;

      const distanceFromBottom = document.documentElement.scrollHeight - (currentY + window.innerHeight);

      if (!hasTriggeredRef.current && scrollingDown && distanceFromBottom <= EARLY_THRESHOLD_PX) {
        hasTriggeredRef.current = true;
        navigate(nextPath as string);
        return;
      }

      if (distanceFromBottom > RESET_THRESHOLD_PX) {
        hasTriggeredRef.current = false;
      }
    }

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [nextPath, navigate]);
}
