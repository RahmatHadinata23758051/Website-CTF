import { createBrowserRouter } from "react-router-dom";
import { AppShell } from "../components/layout/AppShell";
import { DashboardPage } from "../pages/DashboardPage";
import { LoginPage } from "../pages/LoginPage";
import { RegisterPage } from "../pages/RegisterPage";
import { ChallengesPage } from "../pages/ChallengesPage";
import { ChallengeDetailPage } from "../pages/ChallengeDetailPage";
import { ScoreboardPage } from "../pages/ScoreboardPage";
import { ProfilePage } from "../pages/ProfilePage";
import { AccountPage } from "../pages/AccountPage";
import { ForgotPasswordPage } from "../pages/ForgotPasswordPage";
import { AdminPage } from "../pages/admin/AdminPage";
import { RulesPage } from "../pages/legal/RulesPage";
import { TermsPage } from "../pages/legal/TermsPage";
import { PrivacyPage } from "../pages/legal/PrivacyPage";
import { ProtectedRoute } from "./ProtectedRoute";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <AppShell />,
    children: [
      {
        index: true,
        element: <DashboardPage />,
      },
      {
        path: "login",
        element: <LoginPage />,
      },
      {
        path: "register",
        element: <RegisterPage />,
      },
      {
        path: "forgot-password",
        element: <ForgotPasswordPage />,
      },
      {
        path: "rules",
        element: <RulesPage />,
      },
      {
        path: "terms",
        element: <TermsPage />,
      },
      {
        path: "privacy",
        element: <PrivacyPage />,
      },
      {
        element: <ProtectedRoute />,
        children: [
          {
            path: "challenges",
            element: <ChallengesPage />,
          },
          {
            path: "challenges/:slug",
            element: <ChallengeDetailPage />,
          },
          {
            path: "scoreboard",
            element: <ScoreboardPage />,
          },
          {
            path: "profile",
            element: <ProfilePage />,
          },
          {
            path: "account",
            element: <AccountPage />,
          },
        ],
      },
      {
        element: <ProtectedRoute allowedRoles={["admin"]} />,
        children: [
          {
            path: "admin",
            element: <AdminPage />,
          },
          {
            path: "admin/challenges",
            element: <AdminPage />,
          },
          {
            path: "admin/users",
            element: <AdminPage />,
          },
          {
            path: "admin/submissions",
            element: <AdminPage />,
          },
          {
            path: "admin/solves",
            element: <AdminPage />,
          },
        ],
      },
    ],
  },
]);
