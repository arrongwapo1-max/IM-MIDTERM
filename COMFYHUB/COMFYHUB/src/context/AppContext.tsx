import {
  createContext,
  useContext,
  useMemo,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import { apiRequest } from "@/lib/api";

export type Role = "Student" | "Counselor" | "Admin";
export type ConcernStatus = "Pending" | "In Progress" | "Resolved";
export type AppointmentStatus = "Pending" | "Confirmed" | "Declined";

export type Concern = {
  id: number;
  title: string;
  content: string;
  category: string;
  submitted: string;
  status: ConcernStatus;
  archived?: boolean;
  student: string;
  course?: string;
  section?: string;
  audience?: string;
  pinned?: boolean;
  attachment_name?: string | null;
  attachment_url?: string | null;
};

export type Appointment = {
  id: number;
  student: string;
  counselor: string;
  counselorId?: number;
  date: string;
  time: string;
  type: string;
  status: AppointmentStatus;
  archived?: boolean;
  course?: string;
  section?: string;
  category?: "Academic Advising" | "Personal Counseling" | "Career Guidance";
  modality?: "Face-to-Face" | "Online Video Call";
};

export type Announcement = {
  id: number;
  title: string;
  body: string;
  date: string;
  audience: string;
  pinned: boolean;
  category: "Academic" | "Event" | "Maintenance" | "Urgent";
  attachment_path?: string | null;
  attachment_name?: string | null;
  attachment_url?: string | null;
};

export type UserProfile = {
  name: string;
  email: string;
  studentId: string;
  course: string;
  department: string;
  section: string;
  phone: string;
  avatar: string | null;
};

type AppContextValue = {
  isAuthenticated: boolean;
  setAuthenticated: (authenticated: boolean) => void;
  role: Role;
  setRole: (role: Role) => void;
  user: UserProfile;
  setUser: (user: Partial<UserProfile>) => void;
  concerns: Concern[];
  addConcern: (concern: FormData) => Promise<void>;
  updateConcernStatus: (id: number, status: ConcernStatus) => void;
  archiveConcern: (id: number) => void;
  appointments: Appointment[];
  addAppointment: (
    appointment: Omit<Appointment, "id" | "student" | "status">,
  ) => void;
  updateAppointmentStatus: (id: number, status: AppointmentStatus) => void;
  archiveAppointment: (id: number) => void;
  announcements: Announcement[];
  addAnnouncement: (announcement: FormData) => void;
  removeAnnouncement: (id: number) => void;
};

const initialConcerns: Concern[] = [
  {
    id: 1,
    title: "Request for academic consultation",
    content: "I would like to discuss my current academic workload and create a study plan.",
    category: "Academic",
    submitted: "Today, 9:42 AM",
    status: "Pending",
    student: "Maria Santos",
  },
  {
    id: 2,
    title: "Managing study-life balance",
    content: "I am having difficulty balancing my classes, assignments, and personal responsibilities.",
    category: "Personal",
    submitted: "Yesterday",
    status: "In Progress",
    student: "John Dela Cruz",
  },
  {
    id: 3,
    title: "Career path exploration",
    content: "I would appreciate guidance on choosing a career path and preparing for future opportunities.",
    category: "Career",
    submitted: "Sep 02, 2026",
    status: "Resolved",
    student: "Anna Reyes",
  },
  {
    id: 4,
    title: "Peer conflict support",
    content: "I need a confidential conversation about an ongoing conflict with a classmate.",
    category: "Social",
    submitted: "Sep 01, 2026",
    status: "Pending",
    student: "Carlos Garcia",
  },
];

const initialAppointments: Appointment[] = [
  {
    id: 1,
    student: "Maria Santos",
    counselor: "Dr. Elena Cruz",
    date: "Sep 09, 2026",
    time: "10:00 AM",
    type: "Academic guidance",
    status: "Confirmed",
  },
  {
    id: 2,
    student: "John Dela Cruz",
    counselor: "Ms. Patricia Lim",
    date: "Sep 10, 2026",
    time: "2:30 PM",
    type: "Personal counseling",
    status: "Pending",
  },
  {
    id: 3,
    student: "Anna Reyes",
    counselor: "Dr. Elena Cruz",
    date: "Sep 12, 2026",
    time: "9:00 AM",
    type: "Career planning",
    status: "Pending",
  },
];

const initialAnnouncements: Announcement[] = [
  {
    id: 1,
    title: "Guidance Week 2026",
    body: "Join us for a week of workshops, peer circles, and one-on-one guidance sessions.",
    date: "Sep 05, 2026",
    audience: "All students",
    pinned: true,
    category: "Academic",
  },
  {
    id: 2,
    title: "Scholarship orientation",
    body: "The scholarship office will hold an orientation this Friday at the Audio-Visual Room.",
    date: "Sep 03, 2026",
    audience: "Students",
    pinned: false,
    category: "Academic",
  },
];

const AppContext = createContext<AppContextValue | null>(null);

const initialUser: UserProfile = {
  name: "",
  email: "",
  studentId: "",
  course: "",
  department: "Guidance Office",
  section: "",
  phone: "",
  avatar: null,
};

const sessionStorageKey = "comfyhub-session";

type StoredSession = {
  isAuthenticated: boolean;
  role: Role;
  user: UserProfile;
};

function getStoredSession(): StoredSession | null {
  try {
    if (!sessionStorage.getItem("comfyhub-token")) return null;
    const stored = sessionStorage.getItem(sessionStorageKey);
    return stored ? (JSON.parse(stored) as StoredSession) : null;
  } catch {
    return null;
  }
}

function formatDate(value: string): string {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : date.toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });
}

function mapConcern(item: Concern & { created_at?: string; user?: { course?: string | null; section?: string | null } }): Concern {
  return {
    ...item,
    course: item.course || item.user?.course || "Course not provided",
    section: item.section || item.user?.section || "Section not provided",
    submitted: item.created_at ? formatDate(item.created_at) : item.submitted,
  };
}

function mapAppointment(item: Appointment & { date: string; studentUser?: { course?: string | null; section?: string | null } }): Appointment {
  return {
    ...item,
    course: item.course || item.studentUser?.course || "Course not provided",
    section: item.section || item.studentUser?.section || "Section not provided",
    date: formatDate(item.date),
  };
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [session] = useState(getStoredSession);
  const [isAuthenticated, setAuthenticated] = useState(
    session?.isAuthenticated ?? false,
  );
  const [role, setRole] = useState<Role>(session?.role ?? "Counselor");
  const [user, setUserState] = useState<UserProfile>(session?.user ?? initialUser);
  const [concerns, setConcerns] = useState(initialConcerns);
  const [appointments, setAppointments] = useState(initialAppointments);
  const [announcements, setAnnouncements] = useState(initialAnnouncements);

  const setUser = (profile: Partial<UserProfile>) => {
    setUserState((current) => ({ ...current, ...profile }));
  };

  useEffect(() => {
    if (!isAuthenticated) {
      sessionStorage.removeItem(sessionStorageKey);
      sessionStorage.removeItem("comfyhub-token");
      return;
    }
    sessionStorage.setItem(
      sessionStorageKey,
      JSON.stringify({ isAuthenticated, role, user }),
    );
  }, [isAuthenticated, role, user]);

  useEffect(() => {
    function handleStorage(event: StorageEvent) {
      if (event.key !== sessionStorageKey) return;
      if (!event.newValue) {
        setAuthenticated(false);
        return;
      }

      try {
        const nextSession = JSON.parse(event.newValue) as StoredSession;
        setAuthenticated(nextSession.isAuthenticated);
        setRole(nextSession.role);
        setUserState(nextSession.user);
      } catch {
        // Ignore malformed session data from another tab.
      }
    }

    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  useEffect(() => {
    if (!isAuthenticated || !sessionStorage.getItem("comfyhub-token")) return;
    const refreshRecords = () => {
      void Promise.all([
        apiRequest<{ role: Role }>('/auth/me'),
        apiRequest<Concern[]>('/concerns'),
        apiRequest<Appointment[]>('/appointments'),
        apiRequest<Announcement[]>('/announcements'),
      ]).then(([currentUser, nextConcerns, nextAppointments, nextAnnouncements]) => {
        setRole(currentUser.role);
        setConcerns(nextConcerns.map(mapConcern));
        setAppointments(nextAppointments.map(mapAppointment));
        setAnnouncements(nextAnnouncements);
      }).catch(() => undefined);
    };

    refreshRecords();
    const interval = window.setInterval(refreshRecords, 5000);
    window.addEventListener('focus', refreshRecords);
    return () => {
      window.clearInterval(interval);
      window.removeEventListener('focus', refreshRecords);
    };
  }, [isAuthenticated, role]);

  const value = useMemo<AppContextValue>(
    () => ({
      isAuthenticated,
      setAuthenticated,
      role,
      setRole,
      user,
      setUser,
      concerns,
      addConcern: async (concern) => {
        const created = await apiRequest<Concern>('/concerns', { method: 'POST', body: concern });
        setConcerns((items) => [mapConcern(created), ...items]);
      },
      updateConcernStatus: (id, status) => {
        void apiRequest<Concern>(`/concerns/${id}`, { method: 'PUT', body: JSON.stringify({ status }) })
          .then((updated) => setConcerns((items) => items.map((item) => item.id === id ? mapConcern(updated) : item)));
      },
      archiveConcern: (id) => {
        void apiRequest<Concern>(`/concerns/${id}`, { method: 'PUT', body: JSON.stringify({ archived: true }) })
          .then(() => setConcerns((items) => items.filter((item) => item.id !== id)));
      },
      appointments,
      addAppointment: (appointment) => {
        void apiRequest<Appointment>('/appointments', {
          method: 'POST',
          body: JSON.stringify({
            date: new Date(appointment.date).toISOString().slice(0, 10),
            time: appointment.time,
            type: appointment.type,
            category: appointment.category,
            modality: appointment.modality,
            counselor_id: appointment.counselorId,
            course: appointment.course,
            section: appointment.section,
          }),
        })
          .then((created) => setAppointments((items) => [mapAppointment(created), ...items]));
      },
      updateAppointmentStatus: (id, status) => {
        void apiRequest<Appointment>(`/appointments/${id}`, { method: 'PUT', body: JSON.stringify({ status }) })
          .then((updated) => setAppointments((items) => items.map((item) => item.id === id ? mapAppointment(updated) : item)));
      },
      archiveAppointment: (id) => {
        void apiRequest<Appointment>(`/appointments/${id}`, { method: 'PUT', body: JSON.stringify({ archived: true }) })
          .then(() => setAppointments((items) => items.filter((item) => item.id !== id)));
      },
      announcements,
      addAnnouncement: (announcement) => {
        void apiRequest<Announcement>('/announcements', { method: 'POST', body: announcement })
          .then((created) => setAnnouncements((items) => [created, ...items]));
      },
      removeAnnouncement: (id) => {
        void apiRequest(`/announcements/${id}`, { method: 'DELETE' })
          .then(() => setAnnouncements((items) => items.filter((item) => item.id !== id)));
      },
    }),
    [isAuthenticated, role, concerns, appointments, announcements, user],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error("useApp must be used within AppProvider");
  return context;
}
