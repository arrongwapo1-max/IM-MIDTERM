import { Archive, CalendarDays, ClipboardList } from "lucide-react";
import { useEffect, useState } from "react";
import { StatusBadge } from "@/components/ui/tag";
import type { Appointment, Concern } from "@/context/AppContext";
import { apiRequest } from "@/lib/api";

export function Settings() {
  const [concerns, setConcerns] = useState<Concern[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      apiRequest<Concern[]>("/concerns?archived=1"),
      apiRequest<Appointment[]>("/appointments?archived=1"),
    ]).then(([archivedConcerns, archivedAppointments]) => {
      setConcerns(archivedConcerns);
      setAppointments(archivedAppointments);
    }).finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-bold uppercase tracking-widest text-[#059675]">Settings</p>
        <h1 className="mt-2 font-['Space_Grotesk'] text-3xl font-bold text-[#022C25]">Archived history</h1>
        <p className="mt-2 text-sm text-slate-400">Review archived student concerns and appointment requests.</p>
      </div>
      {loading ? <p className="rounded-lg border border-slate-200 bg-white p-6 text-sm text-slate-400">Loading archived history...</p> : <>
        <section className="overflow-hidden rounded-lg border border-slate-200 bg-white">
          <div className="flex items-center gap-3 border-b border-slate-100 p-5"><ClipboardList className="text-[#059675]" size={20} /><div><h2 className="font-semibold text-[#022C25]">Archived concerns</h2><p className="text-sm text-slate-400">{concerns.length} archived student concerns</p></div></div>
          {concerns.length === 0 ? <p className="p-5 text-sm text-slate-400">No archived concerns yet.</p> : <div className="divide-y divide-slate-100">{concerns.map((concern) => <div className="flex flex-wrap items-center gap-4 p-5" key={concern.id}><div className="min-w-0 flex-1"><strong className="block text-sm text-slate-700">{concern.title}</strong><p className="mt-1 text-sm text-slate-500">Student: {concern.student}</p><p className="mt-1 text-sm text-slate-400">{concern.category} - {concern.course || "Course not provided"} - {concern.section || "Section not provided"} - {concern.submitted}</p></div><StatusBadge status={concern.status} /><span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-1 text-sm font-bold text-slate-500"><Archive size={12} /> Archived</span></div>)}</div>}
        </section>
        <section className="overflow-hidden rounded-lg border border-slate-200 bg-white">
          <div className="flex items-center gap-3 border-b border-slate-100 p-5"><CalendarDays className="text-[#059675]" size={20} /><div><h2 className="font-semibold text-[#022C25]">Archived appointments</h2><p className="text-sm text-slate-400">{appointments.length} archived appointment requests</p></div></div>
          {appointments.length === 0 ? <p className="p-5 text-sm text-slate-400">No archived appointments yet.</p> : <div className="divide-y divide-slate-100">{appointments.map((appointment) => <div className="flex flex-wrap items-center gap-4 p-5" key={appointment.id}><div className="min-w-0 flex-1"><strong className="block text-sm text-slate-700">{appointment.student}</strong><p className="mt-1 text-sm text-slate-500">Counselor: {appointment.counselor}</p><p className="mt-1 text-sm text-slate-400">{appointment.category || appointment.type} - {appointment.modality || "Face-to-Face"} - {appointment.date} - {appointment.time}</p><p className="mt-1 text-sm text-slate-400">{appointment.course || "Course not provided"} - {appointment.section || "Section not provided"}</p></div><StatusBadge status={appointment.status} /><span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-1 text-sm font-bold text-slate-500"><Archive size={12} /> Archived</span></div>)}</div>}
        </section>
      </>}
    </div>
  );
}
