import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

export function MetricCard({ label, value, detail, icon, tone }: { label: string; value: string; detail: string; icon: ReactNode; tone: string }) {
	const tones: Record<string, string> = {
		"tone-blue": "bg-[#ECFDF6] text-[#047860]",
		"tone-amber": "bg-[#ECFDF6] text-[#047860]",
		"tone-green": "bg-[#ECFDF6] text-[#047860]",
		"tone-purple": "bg-[#ECFDF6] text-[#047860]",
	};
	return (
		<div className="flex items-start gap-3 rounded-lg border border-slate-200 bg-white p-5">
			<div className={cn("flex h-10 w-10 shrink-0 items-center justify-center rounded-lg", tones[tone])}>{icon}</div>
			<div>
				<p className="text-sm text-slate-400">{label}</p>
				<strong className="block text-2xl font-bold text-[#022C25]">{value}</strong>
				<span className="mt-1 block text-sm text-[#059675]">{detail}</span>
			</div>
		</div>
	);
}