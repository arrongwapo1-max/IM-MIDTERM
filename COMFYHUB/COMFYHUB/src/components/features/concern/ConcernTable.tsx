import { Archive, ArrowUpRight, Check, MoreHorizontal } from "lucide-react";
import { useApp } from "@/context/AppContext";
import { formatRichText } from "@/lib/richText";

export function ConcernTable({ compact = false }: { compact?: boolean }) {
  const { concerns, updateConcernStatus, archiveConcern } = useApp();
  const items = compact ? concerns.slice(0, 4) : concerns;
  return (
    <section className="overflow-hidden rounded-lg border border-slate-200 bg-white">
      <div className="flex items-start justify-between p-5">
        <div>
          <h2 className="font-['Space_Grotesk'] text-base font-semibold text-[#022C25]">
            {compact ? "Recent concerns" : "All concerns"}
          </h2>
          <p className="mt-1 text-sm text-slate-400">
            {compact
              ? "Latest student support requests"
              : "Review and manage incoming support requests"}
          </p>
        </div>
        {compact && (
          <a
            href="/concerns"
            className="inline-flex items-center gap-1 text-sm font-bold text-[#047860]"
          >
            View all <ArrowUpRight size={15} />
          </a>
        )}
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[680px] border-collapse">
          <thead>
            <tr className="bg-[#F6FFFB] text-left text-sm uppercase tracking-wider text-slate-400">
              <th className="px-5 py-3">Concern</th>
              <th className="px-5 py-3">Category</th>
              <th className="px-5 py-3">Submitted by</th>
              <th className="px-5 py-3">Status</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {items.map((concern) => (
              <tr
                className="border-t border-slate-100 text-sm text-slate-600"
                key={concern.id}
              >
                <td className="px-5 py-4">
                  <strong className="block text-slate-700">
                    {concern.title}
                  </strong>
                  <span className="mt-1 block max-w-xs text-sm text-slate-400" dangerouslySetInnerHTML={{ __html: formatRichText(concern.content) }} />
                  {concern.attachment_url && <a className="mt-1 block text-sm font-semibold text-[#047860]" href={concern.attachment_url} rel="noreferrer" target="_blank">Attachment: {concern.attachment_name}</a>}
                  <small className="mt-1 block text-sm text-slate-400">
                    #{String(concern.id).padStart(4, "0")}
                  </small>
                </td>
                <td className="px-5 py-4"><span className="rounded-full bg-[#ECFDF6] px-2 py-1 text-sm font-bold text-[#047860]">{concern.category}</span>{concern.pinned && <span className="ml-2 text-sm font-bold text-[#047860]">Pinned</span>}<small className="mt-2 block text-sm text-slate-400">{concern.audience || "Guidance Office"}</small></td>
                <td className="px-5 py-4">
                  {concern.student}
                  <small className="mt-1 block text-sm text-slate-500">
                    {concern.course || "Course not provided"} - {concern.section || "Section not provided"}
                  </small>
                  <small className="mt-1 block text-sm text-slate-400">
                    {concern.submitted}
                  </small>
                </td>
                <td className="px-5 py-4">
                  <select
                    className="rounded-full border-0 bg-[#F6FFFB] px-2 py-1 text-sm text-slate-600"
                    value={concern.status}
                    onChange={(event) =>
                      updateConcernStatus(
                        concern.id,
                        event.target.value as typeof concern.status,
                      )
                    }
                    aria-label={`Status for ${concern.title}`}
                  >
                    <option>Pending</option>
                    <option>In Progress</option>
                    <option>Resolved</option>
                  </select>
                </td>
                <td className="px-5 py-4">
                  {concern.status === "Pending" && <button className="mr-3 inline-flex h-8 w-8 items-center justify-center rounded-full bg-[#ECFDF6] text-[#047860] transition hover:bg-[#D1FAE8]" onClick={() => updateConcernStatus(concern.id, "In Progress")} aria-label={`Confirm student concern: ${concern.title}`} title="Confirm student concern"><Check size={16} /></button>}
                  {concern.status === "Resolved" && <button className="mr-3 text-[#047860]" onClick={() => archiveConcern(concern.id)} aria-label={`Archive ${concern.title}`} title="Archive resolved concern"><Archive size={16} /></button>}
                  <button className="text-slate-400" aria-label="More options">
                    <MoreHorizontal size={17} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
