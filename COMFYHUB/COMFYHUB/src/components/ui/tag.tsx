import { cn } from "@/lib/cn";

export function StatusBadge({ status }: { status: string }) {
	const styles = status === "Declined" || status === "Warning"
		? "bg-red-50 text-red-600"
		: "bg-[#ECFDF6] text-[#047860]";
	return (
		<span className={cn("inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-sm font-bold", styles)}>
			<span className="h-1.5 w-1.5 rounded-full bg-current" />
			{status}
		</span>
	);
}