import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { BrowserRouter, Route, Routes } from "react-router";
import { ToastContainer } from "react-toastify";
import { TooltipProvider } from "./components/ui/tooltip";
import { AuthProvider } from "./context/AuthContext";
import DashboardLayout from "./layouts/DashboardLayout";
import ForgetPasswordPage from "./pages/ForgetPasswordPage";
import HomePage from "./pages/HomePage";
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
            <AuthProvider>
              <ToastContainer />
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/dashboard" element={<DashboardLayout />}>
                  <Route index element={<div>home page</div>} />
                  +
                  <Route path="org/:id" element={<div>Dashboard based on </div>} />
                  <Route path="org/new" element={<div>Create Organization </div>} />
                  <Route path="organization" element={<OrganizationPage />} />
                </Route>

                {/* Auth */}
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<SignupPage />} />
                <Route path="/forget-password" element={<ForgetPasswordPage />} />
                <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
              </Routes>
            </AuthProvider>
          </BrowserRouter>
          <ReactQueryDevtools />
        </TooltipProvider>
      </QueryClientProvider>
    </>
  );
}

export default App;
