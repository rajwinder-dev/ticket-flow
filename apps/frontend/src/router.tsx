import { createBrowserRouter } from "react-router"; // or "react-router-dom"
import ProtectedRoute from "./components/ProtectedRoute";
import ForgetPasswordPage from "./features/auth/pages/ForgetPasswordPage";
import LoginPage from "./features/auth/pages/LoginPage";
import ResetPasswordPage from "./features/auth/pages/ResetPasswordPage";
import SignupPage from "./features/auth/pages/SignupPage";
import DashboardPage from "./features/dashbaord/dashbaord";
import MembersPage from "./features/members/components/MemberPage";
import CreateOrganizationPage from "./features/organization/pages/CreateOrganizationPage";
import OrganizationPage from "./features/organization/pages/OrganizationPage";
import QueueDetailPage from "./features/queueGroups/components/QueueDetailPage";
import QueuePage from "./features/queueGroups/components/QueuePage";
import RolePage from "./features/role/components/RolesPage";
import SettingsPage from "./features/setting/pages/SettingPage";
import TicketDetailPage from "./features/ticket/components/TicketDetailPage";
import TicketsPage from "./features/ticket/components/TicketsPage";
import DashboardLayout from "./layouts/DashboardLayout";
import OrgLayout from "./layouts/OrgLayout";
import CustomerPage from "./features/customer/components/CustomerPage";
import InviteMemberPage from "./features/members/components/InviteMemberPage";
import ActivityPage from "./features/activity/components/ActivityPage";

const router = createBrowserRouter([
  {
    element: <ProtectedRoute />,
    children: [
      {
        path: "/",
        element: <DashboardLayout />,
        children: [
          { index: true, element: <OrganizationPage /> },
          {
            path: "org",
            children: [
              { index: true, element: <OrganizationPage /> },
              { path: "new", element: <CreateOrganizationPage /> },
              {
                path: ":orgId",
                element: <OrgLayout />,
                children: [
                  { index: true, element: <DashboardPage /> },
                  { path: "ticket", element: <TicketsPage /> },
                  { path: "ticket/:ticketId", element: <TicketDetailPage /> },
                  { path: "queue", element: <QueuePage /> },
                  { path: "queue/:queueId", element: <QueueDetailPage /> },
                  { path: "setting", element: <SettingsPage /> },
                  { path: "rbac", element: <RolePage /> },
                  { path: "activity", element: <ActivityPage /> },
                  { path: "member", element: <MembersPage /> },
                  { path: "customer", element: <CustomerPage /> },
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
  {
    path: "/invite-user/:token",
    element: <InviteMemberPage />,
  },
]);
export default router;
