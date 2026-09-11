import type { ReactNode } from "react";

export function PageHeader({ eyebrow, title, description, action }: { eyebrow: string; title: string; description: string; action?: ReactNode }) {
	return (
		<div className="mb-8 flex flex-col items-start justify-between gap-5 sm:flex-row sm:items-end">
			<div>
				<p className="mb-2 text-sm font-bold uppercase tracking-[1.2px] text-[#059675]">{eyebrow}</p>
				<h1 className="font-['Space_Grotesk'] text-3xl font-bold tracking-tight text-[#022C25]">{title}</h1>
				<p className="mt-2 text-sm text-slate-400">{description}</p>
			</div>
			{action}
		</div>
	);
}