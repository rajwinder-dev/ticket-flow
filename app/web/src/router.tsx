import { lazy } from 'react';
import { createBrowserRouter } from 'react-router'; // or "react-router-dom"

import ProtectedRoute from './components/ProtectedRoute';
import HomePage from './features/home/HomePage';
import LoginPage from './features/auth/pages/LoginPage';
import SignupPage from './features/auth/pages/SignupPage';
import ForgetPasswordPage from './features/auth/pages/ForgetPasswordPage';
import ResetPasswordPage from './features/auth/pages/ResetPasswordPage';
import InviteMemberPage from './features/members/components/InviteMemberPage';
import { ErrorBoundary } from './components/ErrorBoundary';

const DashboardLayout = lazy(() => import('./layouts/DashboardLayout'));
const OrganizationPage = lazy(
  () => import('./features/organization/pages/OrganizationPage'),
);
const CreateOrganizationPage = lazy(
  () => import('./features/organization/pages/CreateOrganizationPage'),
);

const OrgLayout = lazy(() => import('./layouts/OrgLayout'));
const DashboardPage = lazy(() => import('./features/dashbaord/dashbaord'));
const TicketsPage = lazy(
  () => import('./features/ticket/components/TicketsPage'),
);
const TicketDetailPage = lazy(
  () => import('./features/ticket/components/TicketDetailPage'),
);
const QueuePage = lazy(
  () => import('./features/queueGroups/components/QueuePage'),
);
const QueueDetailPage = lazy(
  () => import('./features/queueGroups/components/QueueDetailPage'),
);
const RolePage = lazy(() => import('./features/role/components/RolesPage'));
const ActivityPage = lazy(
  () => import('./features/activity/components/ActivityPage'),
);
const MembersPage = lazy(
  () => import('./features/members/components/MemberPage'),
);
const CustomerPage = lazy(
  () => import('./features/customer/components/CustomerPage'),
);

const SettingsLayout = lazy(
  () => import('./features/setting/pages/SettingLayout'),
);
const ProfileTab = lazy(
  () => import('./features/setting/components/ProfileTab'),
);
const SecurityTab = lazy(
  () => import('./features/setting/components/tabs/SecurityTab'),
);
const OrganizationTab = lazy(
  () => import('./features/setting/components/tabs/OrganizationTab'),
);
const EmailTab = lazy(
  () => import('./features/setting/components/tabs/GeneralTab'),
);

const router = createBrowserRouter([
  {
    path: '/',
    element: <HomePage />,
    errorElement: <ErrorBoundary />,
  },
  {
    path: '/login',
    element: <LoginPage />,
    errorElement: <ErrorBoundary />,
  },
  {
    path: '/signup',
    element: <SignupPage />,
    errorElement: <ErrorBoundary />,
  },
  {
    path: '/forget-password',
    element: <ForgetPasswordPage />,
    errorElement: <ErrorBoundary />,
  },
  {
    path: '/reset-password/:token',
    element: <ResetPasswordPage />,
    errorElement: <ErrorBoundary />,
  },
  {
    path: '/invite-user/:token',
    element: <InviteMemberPage />,
    errorElement: <ErrorBoundary />,
  },
  {
    element: <ProtectedRoute />,
    errorElement: <ErrorBoundary />,
    children: [
      {
        path: '/org',
        element: <DashboardLayout />,
        children: [
          { index: true, element: <OrganizationPage /> },
          { path: 'new', element: <CreateOrganizationPage /> },
          {
            path: ':orgId',
            element: <OrgLayout />,
            errorElement: <ErrorBoundary />,
            children: [
              { index: true, element: <DashboardPage /> },
              { path: 'ticket', element: <TicketsPage /> },
              { path: 'ticket/:ticketId', element: <TicketDetailPage /> },
              { path: 'queue', element: <QueuePage /> },
              { path: 'queue/:queueId', element: <QueueDetailPage /> },
              { path: 'rbac', element: <RolePage /> },
              { path: 'activity', element: <ActivityPage /> },
              { path: 'member', element: <MembersPage /> },
              { path: 'customer', element: <CustomerPage /> },
              {
                path: 'setting',
                element: <SettingsLayout />,
                children: [
                  { index: true, element: <ProfileTab /> },
                  { path: 'security', element: <SecurityTab /> },
                  { path: 'organization', element: <OrganizationTab /> },
                  { path: 'email', element: <EmailTab /> },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
]);

export default router;
