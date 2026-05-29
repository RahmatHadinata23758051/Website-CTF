import { createBrowserRouter } from "react-router-dom";
import { AppShell } from "../components/layout/AppShell";
import { DashboardPage } from "../pages/DashboardPage";
import { LoginPage } from "../pages/LoginPage";
import { RegisterPage } from "../pages/RegisterPage";
import { ChallengesPage } from "../pages/ChallengesPage";
import { ChallengeDetailPage } from "../pages/ChallengeDetailPage";
import { ScoreboardPage } from "../pages/ScoreboardPage";
import { ProfilePage } from "../pages/ProfilePage";
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
        element: <ProtectedRoute />,
        children: [
          {
            path: "profile",
            element: <ProfilePage />,
          },
        ],
      },
    ],
  },
]);
