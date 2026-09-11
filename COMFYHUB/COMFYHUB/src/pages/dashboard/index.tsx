import {
  AdminDashboard,
  CounselorDashboard,
  StudentDashboard,
} from "@/components/features/roledash/ui/RoleDashboards";
import { useApp } from "@/context/AppContext";

export function Dashboard() {
  const { role } = useApp();
  if (role === "Student") return <StudentDashboard />;
  if (role === "Admin") return <AdminDashboard />;
  return <CounselorDashboard />;
}
