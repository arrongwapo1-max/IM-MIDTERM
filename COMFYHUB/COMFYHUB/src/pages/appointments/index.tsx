import { Archive, CalendarPlus, Check, ChevronDown, Clock3, ShieldCheck, X } from "lucide-react";
import { useState } from "react";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/ui/section";
import { StatusBadge } from "@/components/ui/tag";
import { useApp } from "@/context/AppContext";
import { apiRequest } from "@/lib/api";

const courseOptions = ["BSIT", "BSHM", "BSED", "BEED"];

export function Appointments() {
  const { role, user, appointments, addAppointment, updateAppointmentStatus, archiveAppointment } =
    useApp();
  const isStudent = role === "Student";
  const [showForm, setShowForm] = useState(false);
  const [date, setDate] = useState("Sep 16, 2026");
  const [time, setTime] = useState("10:00 AM");
  const [course, setCourse] = useState(user.course || "BSIT");
  const [section, setSection] = useState(user.section || "");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<"Academic Advising" | "Personal Counseling" | "Career Guidance">("Academic Advising");
  const [modality, setModality] = useState<"Face-to-Face" | "Online Video Call">("Face-to-Face");
  const [counselorId, setCounselorId] = useState("");
  const [counselors, setCounselors] = useState<{ id: number; name: string; department: string | null }[]>([]);

  useEffect(() => {
    if (isStudent) void apiRequest<typeof counselors>("/appointment-counselors").then((items) => {
      setCounselors(items);
      if (items[0]) setCounselorId(String(items[0].id));
    }).catch(() => undefined);
  }, [isStudent]);
  function submit(event: React.FormEvent) {
    event.preventDefault();
    addAppointment({
      date,
      time,
      counselor: "Dr. Elena Cruz",
      counselorId: Number(counselorId),
      type: description.trim() || category,
      category,
      modality,
      course,
      section: section.trim(),
    });
    setDescription("");
    setCategory("Academic Advising");
    setModality("Face-to-Face");
    setShowForm(false);
  }
  const visibleAppointments = isStudent
    ? appointments.filter((item) => item.student === user.name)
    : appointments;
  return (
    <div className="space-y-5">
      <PageHeader
        eyebrow={isStudent ? "Private booking" : `${role} workspace`}
        title={isStudent ? "My appointments" : "Appointment intake"}
        description={
          isStudent
            ? "Request a session and view your scheduled counseling appointments."
            : "Review student requests and confirm or decline sessions."
        }
        action={
          isStudent ? (
            <Button onClick={() => setShowForm((value) => !value)}>
              <CalendarPlus size={17} /> Request appointment
            </Button>
          ) : (
            <span className="flex items-center gap-2 rounded-full bg-[#ECFDF6] px-3 py-2 text-sm font-bold text-[#047860]">
              <ShieldCheck size={15} /> Staff approval queue
            </span>
          )
        }
      />
      {isStudent && showForm && (
        <form
          className="grid gap-4 rounded-lg border border-slate-200 bg-white p-6"
          onSubmit={submit}
        >
          <div>
            <p className="mb-2 text-sm font-bold uppercase tracking-wider text-[#059675]">
              Book a session
            </p>
            <h2 className="text-lg font-semibold text-[#022C25]">
              Choose a preferred time
            </h2>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            <label className="grid gap-2 text-sm font-bold text-slate-600">
              Date
              <input
                className="rounded border border-slate-200 p-2.5 text-sm"
                value={date}
                onChange={(event) => setDate(event.target.value)}
              />
            </label>
            <label className="grid gap-2 text-sm font-bold text-slate-600">Preferred counselor<select className="rounded border border-slate-200 bg-white p-2.5 text-sm" value={counselorId} onChange={(event) => setCounselorId(event.target.value)} required><option value="">Select a counselor</option>{counselors.map((counselor) => <option key={counselor.id} value={counselor.id}>{counselor.name}</option>)}</select></label>
            <label className="grid gap-2 text-sm font-bold text-slate-600">
              Time
              <select
                className="rounded border border-slate-200 bg-white p-2.5 text-sm"
                value={time}
                onChange={(event) => setTime(event.target.value)}
              >
                <option>10:00 AM</option>
                <option>11:30 AM</option>
                <option>2:30 PM</option>
                <option>4:00 PM</option>
              </select>
            </label>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="grid gap-2 text-sm font-bold text-slate-600">Meeting modality<select className="rounded border border-slate-200 bg-white p-2.5 text-sm" value={modality} onChange={(event) => setModality(event.target.value as typeof modality)}><option>Face-to-Face</option><option>Online Video Call</option></select></label>
            <label className="grid gap-2 text-sm font-bold text-slate-600">Appointment category<select className="rounded border border-slate-200 bg-white p-2.5 text-sm" value={category} onChange={(event) => setCategory(event.target.value as typeof category)}><option>Academic Advising</option><option>Personal Counseling</option><option>Career Guidance</option></select></label>
          </div>
          <div className="grid gap-4 rounded-md bg-[#F6FFFB] p-4 sm:grid-cols-2">
            <label className="grid gap-2 text-sm font-bold text-slate-600">
              Course
              <div className="relative">
                <select
                  className="w-full appearance-none rounded border border-slate-200 bg-white p-2.5 pr-10 text-sm outline-none focus:border-[#059675]"
                  value={course}
                  onChange={(event) => setCourse(event.target.value)}
                >
                  {courseOptions.map((option) => <option key={option}>{option}</option>)}
                </select>
                <ChevronDown size={15} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-500" />
              </div>
            </label>
            <label className="grid gap-2 text-sm font-bold text-slate-600">
              Section
              <input
                className="w-full rounded border border-slate-200 bg-white p-2.5 text-sm outline-none focus:border-[#059675]"
                value={section}
                onChange={(event) => setSection(event.target.value)}
                placeholder="e.g. 2A"
                required
              />
            </label>
          </div>
          <label className="grid gap-2 text-sm font-bold text-slate-600">
            Description
            <textarea
              className="rounded border border-slate-200 p-2.5 text-sm"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              rows={4}
              placeholder="Briefly describe what you would like to talk about or why you need this appointment."
            />
          </label>
          <div className="flex justify-end">
            <Button type="submit">Send request</Button>
          </div>
        </form>
      )}
      <section className="overflow-hidden rounded-lg border border-slate-200 bg-white">
        <div className="flex flex-col justify-between gap-4 border-b border-slate-200 bg-[#F6FFFB] p-6 sm:flex-row sm:items-center">
          <div>
            <p className="mb-2 text-sm font-bold uppercase tracking-wider text-[#059675]">
              September 2026
            </p>
            <h2 className="text-lg font-semibold text-[#022C25]">
              {isStudent
                ? "Your appointment requests"
                : "Incoming appointment requests"}
            </h2>
            <p className="mt-1 text-sm text-slate-400">
              {isStudent
                ? "Your appointment details and request status."
                : "Action is visible immediately to the requesting student."}
            </p>
          </div>
          {!isStudent && (
            <div className="flex items-center gap-2 rounded-md bg-[#ECFDF6] px-3 py-2 text-sm text-[#047860]">
              <Clock3 size={17} />
              <strong>
                {
                  appointments.filter((item) => item.status === "Pending")
                    .length
                }
              </strong>{" "}
              awaiting review
            </div>
          )}
        </div>
        <div className="divide-y divide-slate-100 px-6">
          {visibleAppointments.map((item) => (
            <div
              className="flex flex-wrap items-center gap-4 py-4"
              key={item.id}
            >
              <div className="min-w-14 rounded-md bg-[#ECFDF6] px-3 py-2 text-center text-[#047860]">
                <strong className="block text-lg">
                  {item.date.split(" ")[1]?.replace(",", "")}
                </strong>
                <span className="text-sm uppercase">
                  {item.date.split(" ")[0]}
                </span>
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="text-sm font-semibold text-slate-700">
                  {isStudent ? item.counselor : item.student}
                </h3>
                <p className="mt-1 text-sm text-slate-400">
                  {item.category || item.type} - {item.modality || "Face-to-Face"} - {item.date} - {item.time}
                </p>
                <p className="mt-1 text-sm font-semibold text-slate-500">
                  {item.course || "Course not provided"} - {item.section || "Section not provided"}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <StatusBadge status={item.status} />
                {!isStudent && item.status === "Pending" && (
                  <>
                    <button
                      className="flex h-7 w-7 items-center justify-center rounded-full bg-[#ECFDF6] text-[#059675]"
                      onClick={() =>
                        updateAppointmentStatus(item.id, "Confirmed")
                      }
                      aria-label={`Confirm appointment for ${item.student}`}
                      title="Confirm student appointment"
                    >
                      <Check size={15} />
                    </button>
                    <button
                      className="flex h-7 w-7 items-center justify-center rounded-full bg-red-50 text-red-600"
                      onClick={() =>
                        updateAppointmentStatus(item.id, "Declined")
                      }
                      aria-label={`Decline appointment for ${item.student}`}
                      title="Decline student appointment"
                    >
                      <X size={15} />
                    </button>
                  </>
                )}
                {!isStudent && (item.status === "Confirmed" || item.status === "Declined") && <button className="flex h-7 w-7 items-center justify-center rounded-full bg-[#ECFDF6] text-[#047860]" onClick={() => archiveAppointment(item.id)} aria-label="Archive appointment" title="Archive appointment"><Archive size={15} /></button>}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
