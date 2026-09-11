import { BookOpen } from "lucide-react";

export function BrandLockup({ compact = false }: { compact?: boolean }) {
  return (
    <div className="flex items-center gap-3">
      <div className={`relative flex shrink-0 items-center justify-center rounded-full border-2 border-white bg-[#064e41] shadow-[0_0_0_2px_#12ce9f] ${compact ? "h-10 w-10" : "h-12 w-12"}`}>
        <div className="absolute inset-[5px] rounded-full border border-white/80 bg-white" />
        <div className="relative flex h-[60%] w-[48%] items-center justify-center overflow-hidden rounded-[45%_45%_50%_50%] border border-[#6ee7c1] bg-gradient-to-r from-[#047860] via-[#047860] via-50% to-[#12ce9f] to-50% text-sm font-black text-white">
          <span className="relative z-10">CPC</span>
        </div>
        <BookOpen className="absolute bottom-[6px] text-[#064e41]" size={compact ? 8 : 9} />
      </div>
      <div>
        <strong className={`block font-['Space_Grotesk'] font-bold text-white ${compact ? "text-lg" : "text-xl"}`}>
          Comfy<span className="text-[#12ce9f]">Hub</span>
        </strong>
        <small className="block text-[8px] font-bold uppercase tracking-[0.16em] text-slate-400">
          Cordova Public College
        </small>
      </div>
    </div>
  );
}