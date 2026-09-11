import { Megaphone, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { AnnouncementCard } from "@/components/features/announcement/AnnouncementCard";
import { AnnouncementUpdate } from "@/components/features/announcement/Announcement-update";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/ui/section";
import { useApp } from "@/context/AppContext";

export function Announcements() {
  const { announcements, addAnnouncement, removeAnnouncement, role } = useApp();
  const [showForm, setShowForm] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState("All");
  function addUpdate(announcement: FormData) {
    addAnnouncement(announcement);
    setShowForm(false);
  }
  return (
    <div className="space-y-5">
      <PageHeader
        eyebrow="Keep everyone informed"
        title="Announcements"
        description="Share timely updates with the Cordova Public College community."
        action={
          role !== "Student" ? (
            <Button onClick={() => setShowForm((value) => !value)}>
              <Plus size={17} /> New announcement
            </Button>
          ) : null
        }
      />
      {showForm && <AnnouncementUpdate onSubmit={addUpdate} />}
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm text-slate-500">{announcements.length} announcements</p>
        <select aria-label="Filter announcements by category" className="rounded border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-600" value={categoryFilter} onChange={(event) => setCategoryFilter(event.target.value)}>
          <option>All</option><option>Academic</option><option>Event</option><option>Maintenance</option><option>Urgent</option>
        </select>
      </div>
      <div className="grid gap-5 lg:grid-cols-[1fr_245px]">
        <div className="grid gap-4 sm:grid-cols-2">
          {announcements.filter((announcement) => categoryFilter === "All" || announcement.category === categoryFilter).map((announcement) => (
            <AnnouncementCard
              key={announcement.id}
              announcement={announcement}
              onDelete={role !== "Student" ? () => removeAnnouncement(announcement.id) : undefined}
            />
          ))}
        </div>
        <aside className="rounded-lg bg-[#022C25] p-6 text-slate-300">
          <Megaphone className="mb-4 text-[#34D3A6]" size={28} />
          <strong className="font-['Space_Grotesk'] text-lg text-white">
            Keep the community in the loop.
          </strong>
          <p className="mt-4 text-sm leading-relaxed">
            Announcements are visible to students, counselors, and
            administrators.
          </p>
          {role !== "Student" && <button
            className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-[#34D3A6]"
            onClick={() => announcements[0] && removeAnnouncement(announcements[0].id)}
          ><Trash2 size={14} /> Clear latest post</button>}
        </aside>
      </div>
    </div>
  );
}
