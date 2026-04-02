import { createBrowserRouter } from "react-router"; // or "react-router-dom"
import ProtectedRoute from "./components/ProtectedRoute";
import DashboardLayout from "./layouts/DashboardLayout";
import OrgLayout from "./layouts/OrgLayout";
import CreateOrganizationPage from "./features/organizations/pages/CreateOrganizationPage";
import ForgetPasswordPage from "./features/auth/pages/ForgetPasswordPage";
import LoginPage from "./features/auth/pages/LoginPage";
import OrganizationPage from "./features/organizations/pages/OrganizationPage";
import ResetPasswordPage from "./features/auth/pages/ResetPasswordPage";
import SettingsPage from "./features/setting/pages/SettingPage";
import SignupPage from "./features/auth/pages/SignupPage";

const router = createBrowserRouter([
  {
    element: <ProtectedRoute />,
    children: [
      {
        path: "/",
        element: <DashboardLayout />,
        children: [
          {
            index: true,
            element: <div>home page</div>,
          },
          {
            path: "org",
            children: [
              { index: true, element: <OrganizationPage /> },
              { path: "new", element: <CreateOrganizationPage /> },
              {
                path: ":orgId",
                element: <OrgLayout />,
                children: [
                  { index: true, element: <div>Dashboard based</div> },
                  { path: "ticket", element: <div>Ticket page</div> },
                  { path: "ticket/:id", element: <div>view ticket details</div> },
                  { path: "queue", element: <div>view queue details</div> },
                  { path: "queue-group", element: <div>view groups details</div> },
                  { path: "setting", element: <SettingsPage /> },
                  { path: "setting/rbac", element: <div>manage rbac</div> },
                  { path: "member", element: <div>Organization members</div> },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/signup",
    element: <SignupPage />,
  },
  {
    path: "/forget-password",
    element: <ForgetPasswordPage />,
  },
  {
    path: "/reset-password/:token",
    element: <ResetPasswordPage />,
  },
]);
export default router
