import { createBrowserRouter } from "react-router"; // or "react-router-dom"
import ProtectedRoute from "./components/ProtectedRoute";
import ForgetPasswordPage from "./features/auth/pages/ForgetPasswordPage";
import LoginPage from "./features/auth/pages/LoginPage";
import ResetPasswordPage from "./features/auth/pages/ResetPasswordPage";
import SignupPage from "./features/auth/pages/SignupPage";
import CreateOrganizationPage from "./features/organization/pages/CreateOrganizationPage";
import OrganizationPage from "./features/organization/pages/OrganizationPage";
import SettingsPage from "./features/setting/pages/SettingPage";
import DashboardLayout from "./layouts/DashboardLayout";
import OrgLayout from "./layouts/OrgLayout";
import RolePage from "./features/role/components/RolesPage";
import QueuePage from "./features/queueGroups/components/QueuePage";
import QueueDetailPage from "./features/queueGroups/components/QueueDetailPage";
import MembersPage from "./features/members/components/MemberPage";

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
                  { path: "queue", element: <QueuePage /> },
                  { path: "queue/:queueId", element: <QueueDetailPage /> },
                  { path: "queue-group", element: <div>view groups details</div> },
                  { path: "setting", element: <SettingsPage /> },
                  { path: "setting/rbac", element: <RolePage /> },
                  { path: "member", element: <MembersPage /> },
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
export default router;
