import { Navigate, Route, Routes } from "react-router-dom";
import { Shell } from "./components/Layout/Shell.jsx";
import { ProtectedRoute } from "./components/ProtectedRoute.jsx";
import { Analytics } from "./pages/Analytics.jsx";
import { AuthPage } from "./pages/Auth.jsx";
import { Dashboard } from "./pages/Dashboard.jsx";
import { Settings } from "./pages/Settings.jsx";
import { Tasks } from "./pages/Tasks.jsx";

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<AuthPage />} />
      <Route element={<ProtectedRoute />}>
        <Route element={<Shell />}>
          <Route index element={<Dashboard />} />
          <Route path="tasks" element={<Tasks />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
