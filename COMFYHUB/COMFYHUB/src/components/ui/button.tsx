import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

export function Button({
	className,
	variant = "primary",
	children,
	...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
	variant?: "primary" | "secondary" | "ghost" | "danger";
}) {
	const variants = {
		primary: "bg-[#022C25] text-white hover:bg-[#047860]",
		secondary: "border border-slate-200 bg-white text-slate-600 hover:border-slate-400",
		ghost: "bg-transparent text-slate-600",
		danger: "bg-red-50 text-red-600",
	};
	return (
		<button
			className={cn(
				"inline-flex min-h-10 items-center justify-center gap-2 rounded-md px-4 text-sm font-bold transition",
				variants[variant],
				className,
			)}
			{...props}
		>
			{children}
		</button>
	);
}