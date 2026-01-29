import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Index from "./pages/Index";
import About from "./pages/About";
import Programs from "./pages/Programs";
import Events from "./pages/Events";
import Startups from "./pages/Startups";
import Mentors from "./pages/Mentors";
import Apply from "./pages/Apply";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { RequireAdmin } from "./pages/admin/RequireAdmin";
import { AdminLayout } from "./pages/admin/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminPrograms from "./pages/admin/AdminPrograms";
import AdminEvents from "./pages/admin/AdminEvents";
import AdminApplications from "./pages/admin/AdminApplications";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminStartups from "./pages/admin/AdminStartups";
import AdminMentors from "./pages/admin/AdminMentors";
import AdminMedia from "./pages/admin/AdminMedia";

const queryClient = new QueryClient();

const AppRoutes = () => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");

  return (
    <>
      {!isAdminRoute ? <Navbar /> : null}
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/about" element={<About />} />
        <Route path="/programs" element={<Programs />} />
        <Route path="/events" element={<Events />} />
        <Route path="/startups" element={<Startups />} />
        <Route path="/mentors" element={<Mentors />} />
        <Route path="/apply" element={<Apply />} />
        <Route path="/contact" element={<Contact />} />

        <Route
          path="/admin"
          element={
            <RequireAdmin>
              <AdminLayout />
            </RequireAdmin>
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="programs" element={<AdminPrograms />} />
          <Route path="events" element={<AdminEvents />} />
          <Route path="applications" element={<AdminApplications />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="startups" element={<AdminStartups />} />
          <Route path="mentors" element={<AdminMentors />} />
          <Route path="media" element={<AdminMedia />} />
        </Route>

        {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
        <Route path="*" element={<NotFound />} />
      </Routes>
      {!isAdminRoute ? <Footer /> : null}
    </>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
