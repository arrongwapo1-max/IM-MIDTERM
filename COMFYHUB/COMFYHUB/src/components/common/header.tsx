import { NavLink } from "react-router";
import {
  Bell,
  Archive,
  CalendarDays,
  ChevronDown,
  ClipboardList,
  LayoutDashboard,
  LogOut,
  Menu,
  Megaphone,
  UserRound,
  X,
} from "lucide-react";
import { useState } from "react";
import type { Role, UserProfile } from "@/context/AppContext";
import { BrandLockup } from "@/components/common/BrandLockup";

const navItems = [
  { label: "Overview", path: "/", icon: LayoutDashboard },
  { label: "Concerns", path: "/concerns", icon: ClipboardList },
  { label: "Appointments", path: "/appointments", icon: CalendarDays },
  { label: "Announcements", path: "/announcements", icon: Megaphone },
  { label: "My profile", path: "/profile", icon: UserRound },
];

type Notification = { title: string; message: string; time: string };

type HeaderProps = {
  isStudent: boolean;
  role: Role;
  user: UserProfile;
  current: string;
  notifications: Notification[];
  menuOpen: boolean;
  onMenuToggle: () => void;
  onMenuClose: () => void;
  onSignOut: () => void;
};

function ProfileMenu({
  isStudent,
  role,
  user,
  onSignOut,
}: Pick<HeaderProps, "isStudent" | "role" | "user" | "onSignOut">) {
  const [open, setOpen] = useState(false);
  return (
    <div className={`relative border-l ${isStudent ? "border-slate-700 pl-3" : "border-slate-200 pl-4"}`}>
      <button
        className={`flex items-center gap-2 rounded-md p-1.5 text-left ${isStudent ? "hover:bg-[#064E41]" : "hover:bg-[#F6FFFB]"}`}
        onClick={() => setOpen((value) => !value)}
        aria-label="Open profile menu"
        aria-expanded={open}
      >
        <div className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full bg-[#D1FAE8] text-sm font-bold text-[#047860]">
          {user.avatar ? <img src={user.avatar} alt={user.name || "User avatar"} className="h-full w-full object-cover" /> : (user.name ? user.name.split(" ").map((part) => part[0]).slice(0, 2).join("").toUpperCase() : "U")}
        </div>
        <div className={isStudent ? "" : "hidden sm:block"}>
          <strong className={`block text-sm ${isStudent ? "text-white" : "text-slate-700"}`}>{user.name || "User"}</strong>
          <span className="text-sm text-slate-400">{role}</span>
        </div>
        <ChevronDown size={15} className={`text-slate-400 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div className="absolute right-0 top-full z-30 mt-2 w-44 overflow-hidden rounded-lg border border-slate-200 bg-white p-1 shadow-xl">
          <NavLink to="/profile" onClick={() => setOpen(false)} className="flex items-center gap-2 rounded-md px-3 py-2.5 text-sm text-slate-600 hover:bg-slate-100"><UserRound size={16} /><span>My profile</span></NavLink>
          <NavLink to="/settings" onClick={() => setOpen(false)} className="flex items-center gap-2 rounded-md px-3 py-2.5 text-sm text-slate-600 hover:bg-slate-100"><Archive size={16} /><span>Archived history</span></NavLink>
          <button className="flex w-full items-center gap-2 rounded-md px-3 py-2.5 text-left text-sm text-slate-600 hover:bg-slate-100" onClick={onSignOut}><LogOut size={16} /><span>Sign out</span></button>
        </div>
      )}
    </div>
  );
}

function NotificationMenu({ notifications, dark = false }: { notifications: Notification[]; dark?: boolean }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <button className={`relative rounded-md p-2 transition ${dark ? "text-slate-400 hover:bg-[#064E41] hover:text-white" : "text-slate-500 hover:bg-slate-100 hover:text-slate-700"}`} aria-label="Notifications" onClick={() => setOpen((value) => !value)}>
        <Bell size={19} />
        {notifications.length > 0 && <i className={`absolute right-1 top-1 h-2 w-2 rounded-full border-2 ${dark ? "border-[#022C25]" : "border-white"} bg-red-500`} />}
      </button>
      {open && (
        <div className="absolute right-0 top-full z-30 mt-3 w-80 rounded-lg border border-slate-200 bg-white p-3 text-slate-700 shadow-xl">
          <strong className="mb-2 block border-b border-slate-100 pb-2 text-sm font-bold uppercase tracking-wider text-slate-600">Notifications</strong>
          <div className="space-y-2">
            {notifications.map((item) => (
              <div key={`${item.title}-${item.time}`} className="rounded-md border border-slate-100 bg-[#F6FFFB] p-2.5">
                <div className="flex items-center justify-between gap-3"><strong className="text-sm font-semibold text-slate-700">{item.title}</strong><span className="text-sm text-slate-400">{item.time}</span></div>
                <p className="mt-1 text-sm leading-relaxed text-slate-500">{item.message}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export function Header({ isStudent, role, user, current, notifications, menuOpen, onMenuToggle, onMenuClose, onSignOut }: HeaderProps) {
  if (!isStudent) {
    return (
      <header className="flex h-16 items-center justify-between border-b border-slate-200 bg-white px-5 sm:h-20 sm:px-10">
        <button className="mr-3 text-slate-500 md:hidden" onClick={onMenuToggle} aria-label="Open menu"><Menu size={20} /></button>
        <div className="flex items-center gap-2 text-sm text-slate-400"><span>Workspace</span><b>/</b><strong className="text-slate-700">{current}</strong></div>
        <div className="ml-auto flex items-center gap-3"><NotificationMenu notifications={notifications} /><ProfileMenu isStudent={false} role={role} user={user} onSignOut={onSignOut} /></div>
      </header>
    );
  }

  return (
    <header className="relative z-20 bg-[#022C25] text-slate-300 shadow-lg">
      <div className="flex min-h-20 items-center gap-4 px-4 py-3 sm:px-8">
        <BrandLockup compact />
        <button className="ml-auto rounded-md p-2 text-slate-400 hover:bg-[#064E41] hover:text-white md:hidden" onClick={onMenuToggle} aria-label={menuOpen ? "Close menu" : "Open menu"}>{menuOpen ? <X size={18} /> : <Menu size={18} />}</button>
        <div className="ml-auto hidden items-center gap-3 md:flex"><NotificationMenu notifications={notifications} dark /><ProfileMenu isStudent role={role} user={user} onSignOut={onSignOut} /></div>
      </div>
      <nav className={`${menuOpen ? "block" : "hidden"} border-t border-slate-700/70 px-4 py-3 md:block md:px-8`}>
        <div className="flex flex-col gap-1 md:flex-row md:items-center md:justify-end md:gap-3">
          {navItems.map(({ label, path, icon: Icon }) => <NavLink key={path} to={path} onClick={onMenuClose} className={({ isActive }) => `flex items-center gap-2 rounded-md px-3 py-2.5 text-sm md:py-2 ${isActive ? "bg-[#12CE9F] font-bold text-[#022C25]" : "text-slate-400 hover:bg-[#064E41] hover:text-white"}`}><Icon size={17} /><span>{label}</span>{label === "Concerns" && <span className="ml-auto text-sm md:ml-1">2</span>}</NavLink>)}
        </div>
      </nav>
      <div className="flex items-center justify-between border-b border-slate-200 bg-white px-5 py-4 md:hidden">
        <div className="flex items-center gap-2 text-sm text-slate-400"><span>Workspace</span><b>/</b><strong className="text-slate-700">{current}</strong></div>
        <NotificationMenu notifications={notifications} />
      </div>
    </header>
  );
}

export { NotificationMenu, ProfileMenu };
