import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AdminLayout } from "./components/layout/AdminLayout";
import { ProtectedRoute } from "./components/layout/ProtectedRoute";
import { Login } from "./pages/Login";
import { Dashboard } from "./pages/Dashboard";
import { FirmProfileEditor } from "./pages/FirmProfileEditor";
import { ServicesManager } from "./pages/ServicesManager";
import { TeamManager } from "./pages/TeamManager";
import { TestimonialsManager } from "./pages/TestimonialsManager";
import { ArticlesManager } from "./pages/ArticlesManager";
import { AvailabilityEditor } from "./pages/AvailabilityEditor";
import { BookingsInbox } from "./pages/BookingsInbox";
import { MessagesInbox } from "./pages/MessagesInbox";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route element={<ProtectedRoute />}>
          <Route element={<AdminLayout />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/firm-profile" element={<FirmProfileEditor />} />
            <Route path="/services" element={<ServicesManager />} />
            <Route path="/team" element={<TeamManager />} />
            <Route path="/testimonials" element={<TestimonialsManager />} />
            <Route path="/articles" element={<ArticlesManager />} />
            <Route path="/availability" element={<AvailabilityEditor />} />
            <Route path="/bookings" element={<BookingsInbox />} />
            <Route path="/messages" element={<MessagesInbox />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
