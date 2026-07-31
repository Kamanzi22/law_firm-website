import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { trackPageView } from "./lib/analytics";
import { Header } from "./components/layout/Header";
import { Footer } from "./components/layout/Footer";
import { StickyBookButton } from "./components/layout/StickyBookButton";
import { Home } from "./pages/Home";
import { ServicesIndex } from "./pages/ServicesIndex";
import { ServiceDetail } from "./pages/ServiceDetail";
import { About } from "./pages/About";
import { TeamMember } from "./pages/TeamMember";
import { Insights } from "./pages/Insights";
import { InsightArticle } from "./pages/InsightArticle";
import { Contact } from "./pages/Contact";
import { BookAppointment } from "./pages/BookAppointment";
import { NotFound } from "./pages/NotFound";

function AnalyticsTracker() {
  const { pathname } = useLocation();
  useEffect(() => {
    void trackPageView(pathname);
  }, [pathname]);
  return null;
}

const pageTransition = {
  initial: { opacity: 0, scale: 0.98 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.98 },
  transition: { duration: 0.45, ease: [0.4, 0, 0.2, 1] as const },
};

const routeElements = (
  <>
    <Route path="/" element={<Home />} />
    <Route path="/services" element={<ServicesIndex />} />
    <Route path="/services/:slug" element={<ServiceDetail />} />
    <Route path="/about" element={<About />} />
    <Route path="/team/:slug" element={<TeamMember />} />
    <Route path="/insights" element={<Insights />} />
    <Route path="/insights/:slug" element={<InsightArticle />} />
    <Route path="/contact" element={<Contact />} />
    <Route path="/book" element={<BookAppointment />} />
    <Route path="*" element={<NotFound />} />
  </>
);

function AnimatedRoutes() {
  const location = useLocation();

  // NextPageTeaser already played its own scroll-driven fade before calling
  // navigate() with this flag — skip the click-based crossfade below so the
  // two transitions don't stack and flash.
  const skipTransition = Boolean((location.state as { skipTransition?: boolean } | null)?.skipTransition);

  if (skipTransition) {
    return <Routes location={location}>{routeElements}</Routes>;
  }

  return (
    <AnimatePresence mode="wait" initial={false} onExitComplete={() => window.scrollTo({ top: 0 })}>
      <motion.div
        key={location.pathname}
        initial={pageTransition.initial}
        animate={pageTransition.animate}
        exit={pageTransition.exit}
        transition={pageTransition.transition}
      >
        <Routes location={location}>{routeElements}</Routes>
      </motion.div>
    </AnimatePresence>
  );
}

function Layout() {
  return (
    <div className="flex min-h-screen flex-col pb-16 lg:pb-0">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-sm focus:bg-brand-gold focus:px-4 focus:py-2 focus:text-brand-navy"
      >
        Skip to main content
      </a>
      <Header />
      <main id="main-content" className="flex-1">
        <AnimatedRoutes />
      </main>
      <Footer />
      <StickyBookButton />
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AnalyticsTracker />
      <Layout />
    </BrowserRouter>
  );
}

export default App;
