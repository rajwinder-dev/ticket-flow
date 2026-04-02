import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { BrowserRouter, Route, Routes } from "react-router";
import ProtectedRoute from "./components/ProtectedRoute";
import { Toaster } from "./components/ui/sonner";
import { TooltipProvider } from "./components/ui/tooltip";
import { GlobalProvider } from "./context/GlobalContext";
import DashboardLayout from "./layouts/DashboardLayout";
import OrgLayout from "./layouts/OrgLayout";
import ForgetPasswordPage from "./pages/ForgetPasswordPage";
import LoginPage from "./pages/LoginPage";
import OrganizationPage from "./pages/OrganizationPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import SignupPage from "./pages/SignupPage";
const queryclient = new QueryClient();
function App() {
  return (
    <>
      <QueryClientProvider client={queryclient}>
        <TooltipProvider>
          <BrowserRouter>
            <GlobalProvider>
              <Routes>
                <Route element={<ProtectedRoute />}>
                  <Route path="/" element={<DashboardLayout />}>
                    <Route index element={<div>home page</div>} />
                    <Route path="org/:orgId" element={<OrgLayout />}>
                      <Route index element={<div>Dashboard based </div>} />
                      <Route path="ticket" element={<div>Ticket page (4 route with filter)</div>} />
                      <Route path="ticket/:id" element={<div>view ticket details</div>} />
                      <Route path="queue" element={<div>view queue details</div>} />
                      <Route path="queue-group" element={<div>view groups detals</div>} />
                      <Route path="setting" element={<div>general settings</div>} />
                      <Route path="setting/rbac" element={<div>manage rbac</div>} />
                      <Route path="member" element={<div>Organization members</div>} />
                    </Route>
                    <Route path="org/new" element={<div>Create Organization</div>} />
                    <Route path="org" element={<OrganizationPage />} />
                  </Route>
                </Route>

                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<SignupPage />} />
                <Route path="/forget-password" element={<ForgetPasswordPage />} />
                <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
              </Routes>
              <Toaster />
            </GlobalProvider>
          </BrowserRouter>
          <ReactQueryDevtools />
        </TooltipProvider>
      </QueryClientProvider>
    </>
  );
}

export default App;
