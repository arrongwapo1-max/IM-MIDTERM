import { Navigate, NavLink, useLocation, useNavigate } from "react-router";
import {
  CalendarDays,
  ClipboardList,
  LayoutDashboard,
  Megaphone,
} from "lucide-react";
import { useState, type ReactNode } from "react";
import { useApp } from "@/context/AppContext";
import { Header } from "@/components/common/header";
import { Footer } from "@/components/common/footer";
import { BrandLockup } from "@/components/common/BrandLockup";

const navItems = [
  { label: "Overview", path: "/", icon: LayoutDashboard },
  { label: "Concerns", path: "/concerns", icon: ClipboardList },
  { label: "Appointments", path: "/appointments", icon: CalendarDays },
  { label: "Announcements", path: "/announcements", icon: Megaphone },
];

export function AppShell({ children }: { children: ReactNode }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const { role, user, isAuthenticated, setAuthenticated, announcements, concerns, appointments } = useApp();
  const location = useLocation();
  const navigate = useNavigate();
  const isStudent = role === "Student";
  const current = navItems.find((item) => item.path === location.pathname)?.label ?? "Overview";
  const pendingConcerns = concerns.filter((item) => item.status === "Pending");
  const pendingAppointments = appointments.filter((item) => item.status === "Pending");
  const notifications = isStudent
    ? [
        { title: "New guidance update", message: announcements[0]?.title ?? "A new campus update is available.", time: "Just now" },
        { title: "Appointment status", message: "Your counseling request has been received and is pending review.", time: "2h ago" },
        { title: "Support reminder", message: "Your concerns are reviewed within one school day.", time: "Today" },
      ]
    : [
        ...pendingConcerns.map((item) => ({
          title: "New student concern",
          message: `${item.student} submitted: ${item.title}`,
          time: "Needs review",
        })),
        ...pendingAppointments.map((item) => ({
          title: "Appointment awaiting confirmation",
          message: `${item.student} requested an appointment for ${item.date} at ${item.time}.`,
          time: "Needs review",
        })),
      ];

  const isAuthPage = ["/signup", "/login", "/forgot-password"].includes(location.pathname);
  if (isAuthPage) {
    return isAuthenticated ? <Navigate to="/" replace /> : <>{children}</>;
  }
  if (!isAuthenticated) return <Navigate to="/login" replace />;

  return (
    <div className={`${isStudent ? "" : "flex"} min-h-screen bg-[#F6FFFB]`}>
      {!isStudent && (
        <aside className={`${menuOpen ? "left-0" : "-left-72"} fixed bottom-0 top-0 z-20 flex w-64 shrink-0 flex-col bg-[#022C25] p-4 text-slate-300 shadow-xl transition-all md:static md:left-0 md:shadow-none`}>
          <div className="flex items-center gap-3 px-3 pb-8">
            <BrandLockup compact />
          </div>
          <nav className="grid gap-1.5 pt-6">
            {navItems.map(({ label, path, icon: Icon }) => <NavLink key={path} to={path} className={({ isActive }) => `flex items-center gap-3 rounded-md px-3 py-3 text-sm ${isActive ? "bg-[#12CE9F] font-bold text-[#022C25]" : "text-slate-400 hover:bg-[#064E41] hover:text-white"}`}><Icon size={18} /><span>{label}</span>{label === "Concerns" && pendingConcerns.length > 0 && <span className="ml-auto text-sm">{pendingConcerns.length}</span>}</NavLink>)}
          </nav>
        </aside>
      )}
      <main className="flex min-h-screen min-w-0 flex-1 flex-col">
        <Header
          isStudent={isStudent}
          role={role}
          user={user}
          current={current}
          notifications={notifications}
          menuOpen={menuOpen}
          onMenuToggle={() => setMenuOpen((value) => !value)}
          onMenuClose={() => setMenuOpen(false)}
          onSignOut={() => { setAuthenticated(false); navigate("/login"); }}
        />
        <div className="mx-auto w-full max-w-[1440px] flex-1 p-5 sm:p-10">{children}</div>
        <Footer />
      </main>
    </div>
  );
}
