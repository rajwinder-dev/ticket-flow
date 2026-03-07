import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { AuthProvider } from "./context/AuthContext";
import { BrowserRouter, Route, Routes } from "react-router";
import { navLinks } from "./data/Links";
import DashboardLayout from "./layouts/DashboardLayout";
import Login from "./features/login/Login";
import { ModalProvider } from "./context/ModalContext";
import { GeneralProvider } from "./context/generalContext";
import { ToastContainer } from "react-toastify";
import ProtectedRoute from "./components/ProtectedRoute";

const queryclient = new QueryClient();
function App() {
  return (
    <>
      <QueryClientProvider client={queryclient}>
        <GeneralProvider>
          <ModalProvider>
            <BrowserRouter>
              <AuthProvider>
                <ToastContainer />
                <Routes>
                  <Route
                    path="/"
                    element={
                      <ProtectedRoute>
                        <DashboardLayout />
                      </ProtectedRoute>
                    }
                  >
                    {navLinks.map((route) => {
                      if (route.index)
                        return <Route index element={route.component} />;
                      if (route.component)
                        return (
                          <Route path={route.href} element={route.component} />
                        );
                    })}
                  </Route>
                  <Route path="/login" element={<Login />} />
                </Routes>
              </AuthProvider>
            </BrowserRouter>
          </ModalProvider>
        </GeneralProvider>
        <ReactQueryDevtools />
      </QueryClientProvider>
    </>
  );
}

export default App;
