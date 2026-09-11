import { Mail, MapPin, Phone } from "lucide-react";
import { NavLink } from "react-router";
import { BrandLockup } from "@/components/common/BrandLockup";

const footerLinks = [
	{ label: "Overview", path: "/" },
	{ label: "Concerns", path: "/concerns" },
	{ label: "Appointments", path: "/appointments" },
	{ label: "Announcements", path: "/announcements" },
];

export function Footer() {
	return (
		<footer className="border-t border-slate-800 bg-[#022C25] text-slate-300">
			<div className="mx-auto grid max-w-[1440px] gap-8 px-5 py-8 sm:grid-cols-[1.4fr_1fr_1fr] sm:px-10">
				<div>
					<BrandLockup compact />
					  <p className="mt-3 max-w-sm text-sm leading-relaxed text-slate-400">A caring campus space for concerns, guidance, and student support.</p>
					  <p className="mt-4 text-sm font-semibold uppercase tracking-[0.16em] text-slate-500">Cordova Public College</p>
				</div>

				<div>
					<h2 className="text-sm font-bold uppercase tracking-wider text-white">Workspace</h2>
					<nav className="mt-3 grid gap-2 text-sm text-slate-400">
						{footerLinks.map((link) => <NavLink key={link.path} to={link.path} className="w-fit transition-colors hover:text-[#12CE9F]">{link.label}</NavLink>)}
					</nav>
				</div>

				<div>
					<h2 className="text-sm font-bold uppercase tracking-wider text-white">Contact</h2>
					<div className="mt-3 grid gap-2.5 text-sm text-slate-400">
						<span className="flex items-center gap-2"><MapPin size={14} className="shrink-0 text-[#12CE9F]" /> Guidance Office, Main Campus</span>
						<a href="mailto:guidance@cordova.edu.ph" className="flex items-center gap-2 hover:text-white"><Mail size={14} className="shrink-0 text-[#12CE9F]" /> guidance@cordova.edu.ph</a>
						<a href="tel:+63324123456" className="flex items-center gap-2 hover:text-white"><Phone size={14} className="shrink-0 text-[#12CE9F]" /> (032) 412 3456</a>
					</div>
				</div>
			</div>
			<div className="border-t border-slate-700 px-5 py-4 sm:px-10">
				<p className="mx-auto max-w-[1440px] text-sm text-slate-500">(c) {new Date().getFullYear()} ComfyHub. Student support, made easier.</p>
			</div>
		</footer>
	);
}
