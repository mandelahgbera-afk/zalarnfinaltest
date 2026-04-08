import { Toaster } from "@/components/ui/toaster";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import React, { Suspense, lazy } from "react";
import PageNotFound from "./lib/PageNotFound";
import { AuthProvider, useAuth } from "@/lib/AuthContext";
import { Toaster as Sonner } from "sonner";

import AppLayout from "@/components/layout/AppLayout";

const Landing = lazy(() => import("@/pages/Landing"));
const Dashboard = lazy(() => import("@/pages/Dashboard"));
const Portfolio = lazy(() => import("@/pages/Portfolio"));
const Trade = lazy(() => import("@/pages/Trade"));
const CopyTrading = lazy(() => import("@/pages/CopyTrading"));
const Transactions = lazy(() => import("@/pages/Transactions"));
const Settings = lazy(() => import("@/pages/Settings"));

const AdminDashboard = lazy(() => import("@/pages/admin/AdminDashboard"));
const ManageUsers = lazy(() => import("@/pages/admin/ManageUsers"));
const ManageCryptos = lazy(() => import("@/pages/admin/ManageCryptos"));
const ManageTraders = lazy(() => import("@/pages/admin/ManageTraders"));
const AdminTransactions = lazy(() => import("@/pages/admin/AdminTransactions"));
const PlatformSettingsPage = lazy(() => import("@/pages/admin/PlatformSettings"));

const queryClientInstance = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

function PageLoader() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-[#050a0f]">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-cyan-400 to-purple-600 flex items-center justify-center">
          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
        </div>
        <p className="text-sm text-gray-400">Loading...</p>
      </div>
    </div>
  );
}

const AdminRoute = ({ element }: { element: React.ReactElement }) => {
  const { isAdmin } = useAuth();
  if (!isAdmin) return <PageNotFound />;
  return element;
};

const AuthenticatedApp = () => {
  const { isLoadingAuth, isAuthenticated } = useAuth();

  if (isLoadingAuth) return <PageLoader />;
  if (!isAuthenticated) return <Landing />;

  return (
    <Routes>
      <Route path="/landing" element={<Landing />} />
      <Route element={<AppLayout />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/portfolio" element={<Portfolio />} />
        <Route path="/trade" element={<Trade />} />
        <Route path="/copy-trading" element={<CopyTrading />} />
        <Route path="/transactions" element={<Transactions />} />
        <Route path="/settings" element={<Settings />} />
      </Route>
      <Route element={<AppLayout />}>
        <Route path="/admin" element={<AdminRoute element={<AdminDashboard />} />} />
        <Route path="/admin/users" element={<AdminRoute element={<ManageUsers />} />} />
        <Route path="/admin/cryptos" element={<AdminRoute element={<ManageCryptos />} />} />
        <Route path="/admin/traders" element={<AdminRoute element={<ManageTraders />} />} />
        <Route path="/admin/transactions" element={<AdminRoute element={<AdminTransactions />} />} />
        <Route path="/admin/settings" element={<AdminRoute element={<PlatformSettingsPage />} />} />
      </Route>
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
};

function App() {
  return (
    <AuthProvider>
      <QueryClientProvider client={queryClientInstance}>
        <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
          <Suspense fallback={<PageLoader />}>
            <AuthenticatedApp />
          </Suspense>
        </Router>
        <Toaster />
        <Sonner position="top-right" theme="dark" richColors />
      </QueryClientProvider>
    </AuthProvider>
  );
}

export default App;
