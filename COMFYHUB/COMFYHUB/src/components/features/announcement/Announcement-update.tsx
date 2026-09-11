import { Bold, Italic, Link, List, Megaphone, Paperclip } from "lucide-react";
import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";

type AnnouncementUpdateProps = {
	onSubmit: (announcement: FormData) => void;
};

export function AnnouncementUpdate({ onSubmit }: AnnouncementUpdateProps) {
	const [title, setTitle] = useState("");
	const [body, setBody] = useState("");
	const [audience, setAudience] = useState("All Students");
	const [category, setCategory] = useState("Academic");
	const [pinned, setPinned] = useState(false);
	const [attachment, setAttachment] = useState<File | null>(null);
	const bodyRef = useRef<HTMLTextAreaElement>(null);

	function insert(text: string) {
		const field = bodyRef.current;
		if (!field) return;
		const start = field.selectionStart;
		const end = field.selectionEnd;
		setBody(`${body.slice(0, start)}${text}${body.slice(end)}`);
		requestAnimationFrame(() => { field.focus(); field.setSelectionRange(start + text.length, start + text.length); });
	}

	function submit(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault();
		if (!title.trim() || !body.trim()) return;

		const data = new FormData();
		data.append("title", title.trim());
		data.append("body", body.trim());
		data.append("audience", audience);
		data.append("category", category);
		data.append("pinned", pinned ? "1" : "0");
		if (attachment) data.append("attachment", attachment);
		onSubmit(data);
		setTitle("");
		setBody("");
		setAttachment(null);
		setPinned(false);
	}

	return (
		<form
			className="grid gap-4 rounded-lg border border-slate-200 bg-white p-6"
			onSubmit={submit}
		>
			<div className="flex items-start justify-between gap-4">
				<p className="mb-2 text-sm font-bold uppercase tracking-wider text-[#059675]">
					Publish an update
				</p>
				<h2 className="text-lg font-semibold text-[#022C25]">What&apos;s new?</h2>
				<label className="flex items-center gap-2 text-sm font-bold text-slate-600"><input checked={pinned} onChange={(event) => setPinned(event.target.checked)} type="checkbox" /> Pin this announcement</label>
			</div>
			<div className="grid gap-4 md:grid-cols-3">
			<label className="grid gap-2 text-sm font-bold text-slate-600">
				Headline
				<input
					className="rounded border border-slate-200 p-2.5 text-sm"
					value={title}
					onChange={(event) => setTitle(event.target.value)}
					placeholder="Announcement title"
				/>
			</label>
			<label className="grid gap-2 text-sm font-bold text-slate-600">Category<select className="rounded border border-slate-200 bg-white p-2.5 text-sm" value={category} onChange={(event) => setCategory(event.target.value)}><option>Academic</option><option>Event</option><option>Maintenance</option><option>Urgent</option></select></label>
			</div>
			<div className="grid gap-4 md:grid-cols-[1fr_220px]">
			<label className="grid gap-2 text-sm font-bold text-slate-600">
				Message
				<div className="flex gap-1 rounded-t border border-b-0 border-slate-200 bg-[#F6FFFB] p-2"><button aria-label="Bold" className="rounded p-1.5 text-slate-600 hover:bg-slate-200" onClick={() => insert("**bold text**")} title="Bold" type="button"><Bold size={15} /></button><button aria-label="Italic" className="rounded p-1.5 text-slate-600 hover:bg-slate-200" onClick={() => insert("*italic text*")} title="Italic" type="button"><Italic size={15} /></button><button aria-label="Bullet list" className="rounded p-1.5 text-slate-600 hover:bg-slate-200" onClick={() => insert("\n- ")} title="Bullet list" type="button"><List size={15} /></button><button aria-label="Insert link" className="rounded p-1.5 text-slate-600 hover:bg-slate-200" onClick={() => insert("[link text](https://example.com)")} title="Insert link" type="button"><Link size={15} /></button></div><textarea
					ref={bodyRef}
					className="rounded border border-slate-200 p-2.5 text-sm"
					value={body}
					onChange={(event) => setBody(event.target.value)}
					placeholder="Write a clear message"
					rows={3}
				/>
			</label>
			<div className="grid content-start gap-2 text-sm font-bold text-slate-600">Target audience<select className="rounded border border-slate-200 bg-white p-2.5 text-sm" value={audience} onChange={(event) => setAudience(event.target.value)}><option>All Students</option><option>Counselors Only</option><option>IT Department</option></select><label className="mt-2 flex cursor-pointer items-center gap-2 rounded border border-dashed border-slate-300 p-3 text-sm font-semibold text-slate-600"><Paperclip size={15} /><span className="min-w-0 truncate">{attachment?.name || "Attach file or image"}</span><input accept=".jpg,.jpeg,.png,.gif,.pdf,.doc,.docx" className="sr-only" onChange={(event) => setAttachment(event.target.files?.[0] || null)} type="file" /></label><span className="font-normal text-sm text-slate-400">Up to 10 MB. PDF, DOC, JPG, PNG, or GIF.</span></div>
			</div>
			<Button type="submit">
				<Megaphone size={16} /> Publish announcement
			</Button>
		</form>
	);
}
