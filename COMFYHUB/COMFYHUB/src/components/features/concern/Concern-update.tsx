import { Bold, Italic, Link, List, Paperclip } from 'lucide-react'
import { useRef, useState } from 'react'
import { Button } from '@/components/ui/button'

const courseOptions = ['BSIT', 'BSHM', 'BSED', 'BEED']

type ConcernUpdateProps = {
	onSubmit: (concern: FormData) => Promise<void>
}

export function ConcernUpdate({ onSubmit }: ConcernUpdateProps) {
	const [title, setTitle] = useState('')
	const [content, setContent] = useState('')
	const [category, setCategory] = useState('Academic')
	const [course, setCourse] = useState('BSIT')
	const [section, setSection] = useState('')
	const [audience, setAudience] = useState('Guidance Office')
	const [pinned, setPinned] = useState(false)
	const [attachment, setAttachment] = useState<File | null>(null)
	const [error, setError] = useState('')
	const contentRef = useRef<HTMLDivElement>(null)

	function syncContent() {
		const html = contentRef.current?.innerHTML || ''
		setContent(html
			.replace(/<strong>(.*?)<\/strong>|<b>(.*?)<\/b>/gi, '**$1$2**')
			.replace(/<em>(.*?)<\/em>|<i>(.*?)<\/i>/gi, '*$1$2*')
			.replace(/<li>(.*?)<\/li>/gi, '- $1\n')
			.replace(/<br\s*\/?>/gi, '\n')
			.replace(/<div>/gi, '\n').replace(/<\/div>/gi, '')
			.replace(/<[^>]+>/g, '')
			.replace(/&nbsp;/g, ' ')
			.trim())
	}

	function format(command: 'bold' | 'italic' | 'insertUnorderedList' | 'createLink') {
		contentRef.current?.focus()
		if (command === 'createLink') {
			const url = window.prompt('Enter the link URL')
			if (!url) return
			document.execCommand(command, false, url)
		} else {
			document.execCommand(command)
		}
		syncContent()
	}

	async function submit(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault()
		if (!title.trim() || !content.trim() || !section.trim()) return

		const data = new FormData()
		data.append('title', title.trim()); data.append('content', content.trim()); data.append('category', category)
		data.append('course', course); data.append('section', section.trim()); data.append('audience', audience); data.append('pinned', pinned ? '1' : '0')
		if (attachment) data.append('attachment', attachment)
		setError('')
		try {
			await onSubmit(data)
		} catch (submitError) {
			setError(submitError instanceof Error ? submitError.message : 'Unable to submit your concern.')
			return
		}
		setTitle('')
		setContent('')
		setCategory('Academic')
		setCourse('BSIT')
		setSection('')
		setAudience('Guidance Office'); setPinned(false); setAttachment(null)
		if (contentRef.current) contentRef.current.innerHTML = ''
	}

	return <form className="grid gap-4 rounded-lg border border-slate-200 bg-white p-6" onSubmit={submit}>
		{error && <p className="rounded-md bg-red-50 p-3 text-sm text-red-600" role="alert">{error}</p>}
		<label className="grid gap-2 text-sm font-bold text-slate-600">What do you need help with?<input className="rounded border border-slate-200 p-2.5 text-sm" value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Write a short description" required /></label>
		<div className="grid gap-4 sm:grid-cols-2">
			<label className="grid gap-2 text-sm font-bold text-slate-600">Course<select className="rounded border border-slate-200 bg-white p-2.5 text-sm" value={course} onChange={(event) => setCourse(event.target.value)}>{courseOptions.map((option) => <option key={option}>{option}</option>)}</select></label>
			<label className="grid gap-2 text-sm font-bold text-slate-600">Section<input className="rounded border border-slate-200 bg-white p-2.5 text-sm" value={section} onChange={(event) => setSection(event.target.value)} placeholder="e.g. 2A" required /></label>
		</div>
		<label className="grid gap-2 text-sm font-bold text-slate-600">Tell us more<div className="flex gap-1 rounded-t border border-b-0 border-slate-200 bg-[#F6FFFB] p-2"><button aria-label="Bold" className="p-1 text-slate-600" onMouseDown={(event) => event.preventDefault()} onClick={() => format('bold')} type="button"><Bold size={15} /></button><button aria-label="Italic" className="p-1 text-slate-600" onMouseDown={(event) => event.preventDefault()} onClick={() => format('italic')} type="button"><Italic size={15} /></button><button aria-label="Bullet list" className="p-1 text-slate-600" onMouseDown={(event) => event.preventDefault()} onClick={() => format('insertUnorderedList')} type="button"><List size={15} /></button><button aria-label="Insert link" className="p-1 text-slate-600" onMouseDown={(event) => event.preventDefault()} onClick={() => format('createLink')} type="button"><Link size={15} /></button></div><div ref={contentRef} aria-label="Concern details" className="min-h-24 resize-y rounded-b border border-slate-200 p-2.5 text-sm outline-none" contentEditable onInput={syncContent} role="textbox" data-placeholder="Share the details you would like a counselor to know" />{!content && <span className="pointer-events-none -mt-[5.5rem] block p-2.5 text-sm text-slate-400">Share the details you would like a counselor to know</span>}</label>
		<div className="grid gap-4 sm:grid-cols-[1fr_auto] sm:items-end">
			<label className="grid gap-2 text-sm font-bold text-slate-600">Category<select className="rounded border border-slate-200 bg-white p-2.5 text-sm" value={category} onChange={(event) => setCategory(event.target.value)}><option>Academic</option><option>Event</option><option>Maintenance</option><option>Urgent</option></select></label>
			<label className="grid gap-2 text-sm font-bold text-slate-600">Target audience<select className="rounded border border-slate-200 bg-white p-2.5 text-sm" value={audience} onChange={(event) => setAudience(event.target.value)}><option>Guidance Office</option><option>Counselors Only</option><option>IT Department</option></select></label>
			<label className="flex items-center gap-2 text-sm font-bold text-slate-600"><input checked={pinned} onChange={(event) => setPinned(event.target.checked)} type="checkbox" /> Pin for staff</label>
			<label className="flex cursor-pointer items-center gap-2 rounded border border-dashed border-slate-300 p-2.5 text-sm font-semibold text-slate-600"><Paperclip size={15} />{attachment?.name || 'Attach file'}<input accept=".jpg,.jpeg,.png,.gif,.pdf,.doc,.docx" className="sr-only" onChange={(event) => setAttachment(event.target.files?.[0] || null)} type="file" /></label>
			<Button type="submit">Send privately</Button>
		</div>
	</form>
}
