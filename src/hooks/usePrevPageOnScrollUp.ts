import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

/**
 * Mirrors NextPageTeaser for the backward direction. When the user is
 * already scrolled to the top of the page and keeps trying to scroll up
 * (mouse wheel or a downward touch-drag while at scrollY 0), navigates to
 * `prevPath` and lands near its bottom — so scrolling continues to feel
 * continuous going backward through the page sequence, not just forward.
 *
 * This is a simpler, instant jump rather than NextPageTeaser's gradual
 * scroll-tied fade, since building a mirrored fade-in zone at the top of
 * every page (and pre-scrolling past it on every mount) is meaningfully
 * more complex for a direction most visitors use far less than forward.
 */
export function usePrevPageOnScrollUp(prevPath: string | null) {
  const navigate = useNavigate();
  const hasTriggeredRef = useRef(false);
  const touchStartYRef = useRef(0);

  useEffect(() => {
    if (!prevPath) return;
    hasTriggeredRef.current = false;

    function goBack() {
      if (hasTriggeredRef.current) return;
      hasTriggeredRef.current = true;
      navigate(prevPath as string, { state: { skipTransition: true } });
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          window.scrollTo({ top: document.documentElement.scrollHeight - window.innerHeight });
        });
      });
    }

    function onWheel(event: WheelEvent) {
      if (window.scrollY <= 0 && event.deltaY < -4) {
        goBack();
      }
    }

    function onTouchStart(event: TouchEvent) {
      touchStartYRef.current = event.touches[0]?.clientY ?? 0;
    }

    function onTouchMove(event: TouchEvent) {
      if (window.scrollY <= 0) {
        const currentY = event.touches[0]?.clientY ?? 0;
        const draggedDown = currentY - touchStartYRef.current;
        if (draggedDown > 40) {
          goBack();
        }
      }
    }

    window.addEventListener("wheel", onWheel, { passive: true });
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: true });
    return () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
    };
  }, [prevPath, navigate]);
}
