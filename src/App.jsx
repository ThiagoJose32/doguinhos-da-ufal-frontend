import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import PublicLayout from "./layouts/PublicLayout";
import AppLayout from "./layouts/AppLayout";

import HomePage from "./pages/Home/HomePage";
import LoginPage from "./pages/Login/LoginPage";
import AnimalsPage from "./pages/Animals/AnimalsPage";
import FinancePage from "./pages/Finance/FinancePage";
import VolunteersPage from "./pages/Volunteers/VolunteersPage";
import SettingsPage from "./pages/Settings/SettingsPage";
import { isAuthenticated } from "./services/authService";

function ProtectedRoute({ children }) {
  return isAuthenticated() ? children : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<PublicLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
        </Route>

        <Route
          path="/app"
          element={
            <ProtectedRoute>
              <AppLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="animals" replace />} />
          <Route path="animals" element={<AnimalsPage />} />
          <Route path="finance" element={<FinancePage />} />
          <Route path="volunteers" element={<VolunteersPage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}