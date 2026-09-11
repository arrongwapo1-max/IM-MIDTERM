import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router";
import { AppShell } from "@/components/common/AppShell";
import { AppProvider } from "@/context/AppContext";
import { Announcements } from "@/pages/announcements";
import { Appointments } from "@/pages/appointments";
import { Concerns } from "@/pages/concerns";
import { Dashboard } from "@/pages/dashboard";
import { Login } from "@/pages/login/Login";
import { ForgotPassword } from "@/pages/forgot-password/ForgotPassword";
import { Signup } from "@/pages/signup/Signup";
import { Settings } from "@/pages/settings/Settings";
import { Profile } from "@/pages/profile/Profile";
import "@/styles/global.css";

function NotFound() {
  return (
    <div className="mx-auto max-w-md p-12 text-center">
      <h3 className="text-lg font-semibold text-slate-700">Page not found</h3>
      <p className="mt-2 text-sm text-slate-400">
        That workspace view does not exist.
      </p>
    </div>
  );
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <AppProvider>
        <AppShell>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/concerns" element={<Concerns />} />
            <Route path="/appointments" element={<Appointments />} />
            <Route path="/announcements" element={<Announcements />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AppShell>
      </AppProvider>
    </BrowserRouter>
  </StrictMode>,
);
