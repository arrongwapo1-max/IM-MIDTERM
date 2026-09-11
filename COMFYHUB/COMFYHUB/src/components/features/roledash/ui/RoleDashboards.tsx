import {
  CalendarDays,
  CheckCircle2,
  Check,
  ClipboardCheck,
  Clock3,
  Database,
  FileText,
  FileSpreadsheet,
  LockKeyhole,
  Megaphone,
  Plus,
  ShieldAlert,
  Sparkles,
  UserRound,
  Users,
  XCircle,
} from "lucide-react";
import { Link, useNavigate } from "react-router";
import { useState } from "react";
import { useApp, type ConcernStatus } from "@/context/AppContext";
import { Button } from "@/components/ui/button";
import { MetricCard } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/section";
import { StatusBadge } from "@/components/ui/tag";
import * as XLSX from "xlsx";

const panel = "rounded-lg border border-slate-200 bg-white p-6";
const label = "text-sm font-bold uppercase tracking-wider text-[#059675]";

export function StudentDashboard() {
  const { concerns, appointments, addConcern, addAppointment, user } = useApp();
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("Academic");
  const [open, setOpen] = useState(false);
  const [booked, setBooked] = useState(false);
  function submit(event: React.FormEvent) {
    event.preventDefault();
    if (!title.trim() || !content.trim()) return;
    const concern = new FormData();
    concern.append("title", title.trim());
    concern.append("content", content.trim());
    concern.append("category", category);
    concern.append("course", user.course || "BSIT");
    concern.append("section", user.section || "Not provided");
    concern.append("audience", "Guidance Office");
    concern.append("pinned", "0");
    addConcern(concern);
    setTitle("");
    setContent("");
    setOpen(false);
  }
  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Student portal"
        title={`Your wellbeing comes first, ${user.name ? user.name.split(" ")[0] : "Student"}.`}
        description="A private space to connect with the Guidance Office and stay supported."
        action={
          <button
            className="inline-flex items-center gap-2 rounded-md bg-[#12CE9F] px-4 py-3 text-sm font-bold text-[#022C25]"
            onClick={() => navigate("/concerns")}
          >
            <Plus size={17} /> Share a concern
          </button>
        }
      />
      <section className="flex items-center justify-between rounded-xl bg-gradient-to-r from-[#022C25] to-[#047860] p-7 text-white">
        <div>
          <span className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-[#6EE7C1]">
            <Sparkles size={14} /> Private support space
          </span>
          <h2 className="mt-3 font-['Space_Grotesk'] text-2xl font-semibold">
            You do not have to figure it out alone.
          </h2>
          <p className="mt-2 max-w-lg text-sm text-[#D1FAE8]">
            Reach out to a counselor confidentially.
          </p>
        </div>
        <LockKeyhole
          className="mr-6 hidden text-[#6EE7C1] sm:block"
          size={38}
        />
      </section>
      <div className="grid gap-4 sm:grid-cols-3">
        <Link className="block rounded-lg focus:outline-none focus:ring-2 focus:ring-[#34D3A6]" to="/concerns"><MetricCard label="My concerns" value={String(concerns.length)} detail="1 needs an update" icon={<ClipboardCheck size={20} />} tone="tone-blue" /></Link>
        <Link className="block rounded-lg focus:outline-none focus:ring-2 focus:ring-[#34D3A6]" to="/appointments"><MetricCard label="My appointments" value={String(appointments.length)} detail="Next: Sep 09" icon={<CalendarDays size={20} />} tone="tone-green" /></Link>
        <Link className="block rounded-lg focus:outline-none focus:ring-2 focus:ring-[#34D3A6]" to="/announcements"><MetricCard label="Support" value="Open" detail="Guidance office" icon={<Megaphone size={20} />} tone="tone-amber" /></Link>
      </div>
      <div className="grid gap-5 lg:grid-cols-2">
        <section className={panel}>
          <div className="flex justify-between">
            <div>
              <p className={label}>Private support</p>
              <h2 className="mt-1 text-lg font-semibold text-[#022C25]">
                Submit a concern
              </h2>
            </div>
            <span className="flex items-center gap-1 rounded-full bg-[#ECFDF6] px-2 py-1 text-sm text-[#047860]">
              <LockKeyhole size={12} /> Confidential
            </span>
          </div>
          {open ? (
            <form className="mt-5 grid gap-4" onSubmit={submit}>
              <label className="grid gap-2 text-sm font-bold text-slate-600">
                What would you like support with?
                <input
                  className="rounded border border-slate-200 p-2.5 text-sm"
                  autoFocus
                  value={title}
                  onChange={(event) => setTitle(event.target.value)}
                  placeholder="Write a short description"
                />
              </label>
              <label className="grid gap-2 text-sm font-bold text-slate-600">
                Tell us more
                <textarea
                  className="min-h-24 resize-y rounded border border-slate-200 p-2.5 text-sm"
                  value={content}
                  onChange={(event) => setContent(event.target.value)}
                  placeholder="Share the details you would like a counselor to know"
                  required
                />
              </label>
              <label className="grid gap-2 text-sm font-bold text-slate-600">
                Category
                <select
                  className="rounded border border-slate-200 bg-white p-2.5 text-sm"
                  value={category}
                  onChange={(event) => setCategory(event.target.value)}
                >
                  <option>Academic</option>
                  <option>Personal / Mental well-being</option>
                  <option>Social</option>
                  <option>Career</option>
                </select>
              </label>
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  className="text-sm text-slate-400"
                  onClick={() => setOpen(false)}
                >
                  Cancel
                </button>
                <Button type="submit">Send privately</Button>
              </div>
            </form>
          ) : (
            <button
              className="mt-5 flex w-full items-center gap-3 rounded border border-dashed border-slate-300 bg-[#F6FFFB] p-4 text-left"
              onClick={() => setOpen(true)}
            >
              <FileText className="text-[#059675]" size={20} />
              <span>
                <strong className="block text-sm text-slate-700">
                  Need someone to talk to?
                </strong>
                <small className="text-sm text-slate-400">
                  A counselor will review your concern within one school day.
                </small>
              </span>
            </button>
          )}
        </section>
        <section className={panel}>
          <p className={label}>Next step</p>
          <h2 className="mt-1 text-lg font-semibold text-[#022C25]">
            Book a counselor
          </h2>
          <div className="mt-5 flex items-center gap-3 rounded bg-[#F6FFFB] p-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#D1FAE8] text-sm font-bold text-[#047860]">
              EC
            </div>
            <div>
              <strong className="block text-sm text-slate-700">
                Dr. Elena Cruz
              </strong>
              <span className="text-sm text-slate-400">
                Academic - Personal support
              </span>
            </div>
            <button
              className="ml-auto rounded-full bg-[#34D3A6] p-2"
              onClick={() => {
                addAppointment({
                  counselor: "Dr. Elena Cruz",
                  date: "Sep 16, 2026",
                  time: "10:00 AM",
                  type: "General counseling",
                });
                setBooked(true);
              }}
              aria-label="Book counselor"
            >
              <CalendarDays size={15} />
            </button>
          </div>
          {booked && (
            <p className="mt-3 text-sm text-[#059675]">
              <CheckCircle2 size={14} className="inline" /> Appointment request
              sent.
            </p>
          )}
        </section>
      </div>
    </div>
  );
}

export function CounselorDashboard() {
  const {
    concerns,
    appointments,
    updateConcernStatus,
    updateAppointmentStatus,
    user,
  } = useApp();
  const [owned, setOwned] = useState<number[]>([]);
  const pending = concerns.filter((item) => item.status === "Pending").length;
  const active = concerns.filter(
    (item) => item.status === "In Progress",
  ).length;
  const resolved = concerns.filter((item) => item.status === "Resolved").length;
  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Counselor console"
        title={`Good morning, ${user.name ? user.name.split(" ")[0] : "there"}.`}
        description="Your triage queue and guidance service activity at a glance."
        action={
          <Link
            to="/announcements"
            className="inline-flex items-center gap-2 rounded-md bg-[#022C25] px-4 py-3 text-sm font-bold text-white"
          >
            <Megaphone size={16} /> Broadcast update
          </Link>
        }
      />
      <section className="rounded-lg border border-[#A7F3D6] bg-[#ECFDF6] p-6">
        <p className={label}>Triage desk</p>
        <h2 className="mt-2 text-xl font-semibold text-[#253d58]">
          Care starts with a timely response.
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          {pending} concerns waiting for review -{" "}
          {appointments.filter((item) => item.status === "Pending").length}{" "}
          appointment requests.
        </p>
      </section>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          label="Pending review"
          value={String(pending)}
          detail="Requires triage"
          icon={<Clock3 size={20} />}
          tone="tone-amber"
        />
        <MetricCard
          label="In progress"
          value={String(active)}
          detail="Owned by counselors"
          icon={<Users size={20} />}
          tone="tone-blue"
        />
        <MetricCard
          label="Resolved cases"
          value={String(resolved)}
          detail="This month"
          icon={<CheckCircle2 size={20} />}
          tone="tone-green"
        />
        <MetricCard
          label="Confirmed appointments"
          value={String(
            appointments.filter((item) => item.status === "Confirmed").length,
          )}
          detail="On calendar"
          icon={<CalendarDays size={20} />}
          tone="tone-purple"
        />
      </div>
      <div className="grid gap-5 lg:grid-cols-[1.5fr_1fr]">
        <section className={panel}>
          <p className={label}>Live queue</p>
          <h2 className="mt-1 text-lg font-semibold text-[#022C25]">
            Concern triage
          </h2>
          <div className="mt-4 divide-y divide-slate-100">
            {concerns.map((item) => (
              <div
                className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between"
                key={item.id}
              >
                <div>
                  <strong className="block text-sm text-slate-700">
                    {item.title}
                  </strong>
                  <span className="text-sm text-slate-400">
                    {item.category} - {item.student} - {item.course || "Course not provided"} - {item.section || "Section not provided"}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <select
                    className="rounded-full border-0 bg-[#F6FFFB] px-2 py-1 text-sm"
                    value={item.status}
                    onChange={(event) =>
                      updateConcernStatus(
                        item.id,
                        event.target.value as ConcernStatus,
                      )
                    }
                  >
                    <option>Pending</option>
                    <option>In Progress</option>
                    <option>Resolved</option>
                  </select>
                  {owned.includes(item.id) ? (
                    <span className="text-sm text-[#047860]">
                      <UserRound size={12} className="inline" /> You
                    </span>
                  ) : (
                    <button
                      className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-[#6EE7C1] bg-[#ECFDF6] text-[#047860] transition hover:bg-[#D1FAE8]"
                      onClick={() => {
                        setOwned([...owned, item.id]);
                        updateConcernStatus(item.id, "In Progress");
                      }}
                      aria-label={`Confirm and take ownership of ${item.title}`}
                      title="Confirm and take ownership"
                    >
                      <Check size={16} />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
        <section className={panel}>
          <p className={label}>Decision queue</p>
          <h2 className="mt-1 text-lg font-semibold text-[#022C25]">
            Appointment requests
          </h2>
          {appointments
            .filter((item) => item.status === "Pending")
            .map((item) => (
              <div
                className="flex items-center justify-between border-b border-slate-100 py-4"
                key={item.id}
              >
                <div>
                  <strong className="block text-sm text-slate-700">
                    {item.student}
                  </strong>
                  <span className="text-sm text-slate-400">
                    {item.date} - {item.time} - {item.course || "Course not provided"} - {item.section || "Section not provided"}
                  </span>
                </div>
                <div className="flex gap-2">
                  <button
                    className="rounded-full bg-[#ECFDF6] p-2 text-[#059675]"
                    onClick={() =>
                      updateAppointmentStatus(item.id, "Confirmed")
                    }
                    aria-label={`Confirm student appointment for ${item.student}`}
                    title="Confirm student appointment"
                  >
                    <CheckCircle2 size={15} />
                  </button>
                  <button
                    className="rounded-full bg-red-50 p-2 text-red-600"
                    onClick={() => updateAppointmentStatus(item.id, "Declined")}
                    aria-label="Decline"
                  >
                    <XCircle size={15} />
                  </button>
                </div>
              </div>
            ))}
        </section>
      </div>
    </div>
  );
}

export function AdminDashboard() {
  const { concerns, appointments, user, updateConcernStatus, updateAppointmentStatus } = useApp();
  const studentAccountCount = new Set([
    ...concerns.map((item) => item.student),
    ...appointments.map((item) => item.student),
  ]).size;
  const logs = [
    {
      action: "Role permission updated",
      actor: `Admin: ${user.name || "User"}`,
      level: "Success",
    },
    {
      action: "New concern record created",
      actor: "Student: Maria Santos",
      level: "Info",
    },
    {
      action: "Failed login attempt blocked",
      actor: "Unknown session",
      level: "Warning",
    },
  ];

  function downloadWorkbook(filename: string, sheetName: string, rows: Record<string, unknown>[]) {
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(rows);
    XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
    XLSX.writeFile(workbook, filename);
  }

  function exportConcerns() {
    downloadWorkbook(
      "comfyhub-concerns.xlsx",
      "Concerns",
      concerns.map((item) => ({
        ID: item.id,
        Title: item.title,
        Content: item.content,
        Category: item.category,
        Status: item.status,
        Student: item.student,
        Course: item.course || "",
        Section: item.section || "",
        Audience: item.audience || "",
        Submitted: item.submitted,
        Archived: item.archived ? "Yes" : "No",
        Pinned: item.pinned ? "Yes" : "No",
        Attachment: item.attachment_name || "",
      })),
    );
  }

  function exportAppointments() {
    downloadWorkbook(
      "comfyhub-appointments.xlsx",
      "Appointments",
      appointments.map((item) => ({
        ID: item.id,
        Student: item.student,
        Counselor: item.counselor,
        Date: item.date,
        Time: item.time,
        Type: item.type,
        Category: item.category || "",
        Modality: item.modality || "",
        Status: item.status,
        Course: item.course || "",
        Section: item.section || "",
        Archived: item.archived ? "Yes" : "No",
      })),
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="MIS administrator suite"
        title="Institutional command center"
        description="Monitor system health, records, and security activity across ComfyHub."
        action={
          <div className="flex flex-wrap gap-2">
            <Button variant="secondary" onClick={exportConcerns} title="Export all concern records to Excel">
              <FileSpreadsheet size={16} /> Export Concerns
            </Button>
            <Button variant="secondary" onClick={exportAppointments} title="Export all appointment records to Excel">
              <FileSpreadsheet size={16} /> Export Appointments
            </Button>
          </div>
        }
      />
      <div className="flex flex-wrap gap-6 rounded border border-[#A7F3D6] bg-[#ECFDF6] px-4 py-3 text-sm text-[#047860]">
        <span>All systems operational</span>
        <span>Last sync: Today, 10:45 AM</span>
        <span>
          Uptime <strong>99.98%</strong>
        </span>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          label="Total system records"
          value={String(concerns.length + appointments.length)}
          detail="Student concerns and appointments"
          icon={<Database size={20} />}
          tone="tone-blue"
        />
        <MetricCard
          label="Active accounts"
          value={String(studentAccountCount)}
          detail="Students with submitted records"
          icon={<Users size={20} />}
          tone="tone-green"
        />
        <MetricCard
          label="System uptime"
          value="99.98%"
          detail="Last 30 days"
          icon={<Clock3 size={20} />}
          tone="tone-purple"
        />
        <MetricCard
          label="Security events"
          value="03"
          detail="2 need review"
          icon={<ShieldAlert size={20} />}
          tone="tone-amber"
        />
      </div>
      <section className={panel}>
        <div className="flex items-center justify-between">
          <div>
            <p className={label}>Admin approvals</p>
            <h2 className="mt-1 text-lg font-semibold text-[#022C25]">
              Confirmation queue
            </h2>
          </div>
          <span className="rounded-full bg-[#ECFDF6] px-3 py-1 text-sm font-bold text-[#047860]">
            {concerns.filter((item) => item.status === "Pending").length + appointments.filter((item) => item.status === "Pending").length} pending
          </span>
        </div>
        <div className="mt-5 grid gap-5 lg:grid-cols-2">
          <div>
            <h3 className="mb-2 text-sm font-bold text-slate-700">Student concerns</h3>
            <div className="divide-y divide-slate-100">
              {concerns.filter((item) => item.status === "Pending").map((item) => (
                <div className="flex items-center justify-between gap-3 py-3" key={item.id}>
                  <div className="min-w-0">
                    <strong className="block truncate text-sm text-slate-700">{item.title}</strong>
                    <span className="text-sm text-slate-400">{item.student}</span>
                  </div>
                  <button className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#ECFDF6] text-[#047860] transition hover:bg-[#D1FAE8]" onClick={() => updateConcernStatus(item.id, "In Progress")} aria-label={`Confirm student concern: ${item.title}`} title="Confirm student concern">
                    <Check size={16} />
                  </button>
                </div>
              ))}
              {concerns.filter((item) => item.status === "Pending").length === 0 && <p className="py-3 text-sm text-slate-400">No pending concerns.</p>}
            </div>
          </div>
          <div>
            <h3 className="mb-2 text-sm font-bold text-slate-700">Student appointments</h3>
            <div className="divide-y divide-slate-100">
              {appointments.filter((item) => item.status === "Pending").map((item) => (
                <div className="flex items-center justify-between gap-3 py-3" key={item.id}>
                  <div className="min-w-0">
                    <strong className="block truncate text-sm text-slate-700">{item.student}</strong>
                    <span className="text-sm text-slate-400">{item.date} - {item.time}</span>
                  </div>
                  <button className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#ECFDF6] text-[#047860] transition hover:bg-[#D1FAE8]" onClick={() => updateAppointmentStatus(item.id, "Confirmed")} aria-label={`Confirm student appointment for ${item.student}`} title="Confirm student appointment">
                    <Check size={16} />
                  </button>
                </div>
              ))}
              {appointments.filter((item) => item.status === "Pending").length === 0 && <p className="py-3 text-sm text-slate-400">No pending appointments.</p>}
            </div>
          </div>
        </div>
      </section>
      <section className={panel}>
        <div className="flex items-center justify-between">
          <div>
            <p className={label}>MIS Security</p>
            <h2 className="mt-1 text-lg font-semibold text-[#022C25]">
              System audit logs
            </h2>
          </div>
          <LockKeyhole size={18} className="text-slate-400" />
        </div>
        <div className="mt-5 divide-y divide-slate-100">
          {logs.map((log) => (
            <div
              className="flex flex-wrap items-center gap-3 py-4 text-sm"
              key={log.action}
            >
              <FileText size={15} className="text-[#059675]" />
              <strong className="text-slate-700">{log.action}</strong>
              <span className="text-slate-400">{log.actor}</span>
              <StatusBadge status={log.level} />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
