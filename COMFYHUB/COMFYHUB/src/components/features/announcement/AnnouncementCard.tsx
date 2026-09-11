import { CalendarDays, MoreHorizontal, Pin, Tag, Trash2 } from "lucide-react";
import type { Announcement } from "@/context/AppContext";

export function AnnouncementCard({
  announcement,
  onDelete,
}: {
  announcement: Announcement;
  onDelete?: () => void;
}) {
  const categoryColor = {
    Academic: "bg-[#ECFDF6] text-[#047860]",
    Event: "bg-[#ECFDF6] text-[#047860]",
    Maintenance: "bg-slate-100 text-slate-700",
    Urgent: "bg-red-50 text-red-700",
  }[announcement.category] || "bg-slate-100 text-slate-600";
  const formattedBody = announcement.body
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.+?)\*/g, "<em>$1</em>")
    .replace(/\[(.+?)\]\((https?:\/\/[^\s)]+)\)/g, '<a href="$2" target="_blank" rel="noreferrer" class="text-[#047860] underline">$1</a>')
    .replace(/^- (.+)$/gm, "&#8226; $1")
    .replace(/\n/g, "<br />");
  return (
    <article className="rounded-lg border border-slate-200 bg-white p-5">
      <div className="flex items-center justify-between">
        <span className="inline-flex items-center gap-1 text-sm font-bold uppercase text-[#047860]">
          {announcement.pinned ? (
            <>
              <Pin size={13} /> Pinned
            </>
          ) : (
            "Announcement"
          )}
        </span>
        <button
          className="text-slate-400"
          onClick={onDelete}
          aria-label={onDelete ? "Delete announcement" : "More options"}
        >
          {onDelete ? <Trash2 size={16} /> : <MoreHorizontal size={17} />}
        </button>
      </div>
      <div className="mt-4 flex items-center gap-2"><span className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-sm font-bold ${categoryColor}`}><Tag size={11} /> {announcement.category}</span><span className="text-sm text-slate-400">{announcement.audience}</span></div>
      <h3 className="mt-3 font-['Space_Grotesk'] text-lg font-semibold text-slate-700">
        {announcement.title}
      </h3>
      <p className="mt-2 text-sm leading-relaxed text-slate-500" dangerouslySetInnerHTML={{ __html: formattedBody }} />
      {announcement.attachment_url && <a className="mt-4 block truncate rounded border border-slate-200 bg-[#F6FFFB] px-3 py-2 text-sm font-semibold text-[#047860]" href={announcement.attachment_url} rel="noreferrer" target="_blank">Attachment: {announcement.attachment_name}</a>}
      <footer className="mt-5 flex justify-between border-t border-slate-100 pt-3 text-sm text-slate-400">
        <span className="inline-flex items-center gap-1">
          <CalendarDays size={14} /> {announcement.date}
        </span>
        <span>{announcement.category}</span>
      </footer>
    </article>
  );
}
