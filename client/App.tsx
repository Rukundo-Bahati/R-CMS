import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { SidebarProvider } from "@/contexts/SidebarContext";
import { DashboardLayout } from "@/components/Layout/DashboardLayout";
import { Outlet, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";

import Login from "./pages/Login";
import PortalSelection from "./pages/PortalSelection";
import Dashboard from "./pages/Dashboard";
import Members from "./pages/Members";
import Families from "./pages/Families";
import Committee from "./pages/Committee";
import Profile from "./pages/Profile";
import Schedule from "./pages/Schedule";
import Placeholder from "./pages/Placeholder";
import NotFound from "./pages/NotFound";
import { AnimatedRoute } from "@/components/ui/AnimatedRoute";
import Departments from "./pages/Departments";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

function ProtectedRoute() {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="h-full"
    >
      <DashboardLayout>
        <Outlet />
      </DashboardLayout>
    </motion.div>
  );
}

function AppRoutes() {
  const location = useLocation();
  
  return (
    <AnimatePresence mode="wait" initial={false}>
      <Routes location={location} key={location.pathname.split('/')[1] || 'home'}>
        <Route
          path="/"
          element={
            <AnimatedRoute>
              <Login />
            </AnimatedRoute>
          }
        />
        
        <Route
          path="/portals"
          element={
            <AnimatedRoute>
              <PortalSelection />
            </AnimatedRoute>
          }
        />
        
        <Route element={<ProtectedRoute />}>
          <Route
            path="/profile"
            element={
              <AnimatedRoute>
                <Profile />
              </AnimatedRoute>
            }
          />
          
          <Route
            path="/dashboard/:portal"
            element={
              <AnimatedRoute className="h-full">
                <Dashboard />
              </AnimatedRoute>
            }
          />
          
          <Route
            path="/dashboard/:portal/members"
            element={
              <AnimatedRoute className="h-full">
                <Members />
              </AnimatedRoute>
            }
          />
          
          <Route
            path="/dashboard/:portal/families"
            element={
              <AnimatedRoute className="h-full">
                <Families />
              </AnimatedRoute>
            }
          />

          <Route
            path="/dashboard/:portal/committee"
            element={
              <AnimatedRoute className="h-full">
                <Committee />
              </AnimatedRoute>
            }
          />

          <Route
            path="/dashboard/:portal/departments"
            element={
              <AnimatedRoute className="h-full">
                <Departments />
              </AnimatedRoute>
            }
          />

          <Route
            path="/dashboard/:portal/schedule"
            element={
              <AnimatedRoute className="h-full">
                <Schedule />
              </AnimatedRoute>
            }
          />
          
          <Route
            path="/dashboard/:portal/:section"
            element={
              <AnimatedRoute className="h-full">
                <Placeholder />
              </AnimatedRoute>
            }
          />
        </Route>
        
        <Route
          path="*"
          element={
            <AnimatedRoute>
              <NotFound />
            </AnimatedRoute>
          }
        />
      </Routes>
    </AnimatePresence>
  );
}

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <SidebarProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <AppRoutes />
            </BrowserRouter>
          </TooltipProvider>
        </SidebarProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

createRoot(document.getElementById("root")!).render(<App />);
