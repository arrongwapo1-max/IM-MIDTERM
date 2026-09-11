import { ArrowLeft, ArrowRight, CheckCircle2, LockKeyhole } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router";
import { requestPasswordReset, resetPassword } from "@/lib/api";
import { BrandLockup } from "@/components/common/BrandLockup";

export function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [reset, setReset] = useState(false);
  const [error, setError] = useState("");

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    if (!email.trim()) {
      setError("Enter the school email linked to your account.");
      return;
    }
    try {
      setError("");
      if (!submitted) {
        await requestPasswordReset(email);
        setSubmitted(true);
      } else {
        if (!/^\d{6}$/.test(code)) { setError("Enter the six-digit code from your email."); return; }
        if (password.length < 6 || password !== passwordConfirmation) { setError("Passwords must match and contain at least 6 characters."); return; }
        await resetPassword(email, code, password, passwordConfirmation);
        setReset(true);
      }
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Unable to submit your request.");
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#F6FFFB] px-4 py-8">
      <div className="grid w-full max-w-5xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl lg:grid-cols-[.8fr_1.2fr]">
        <aside className="hidden bg-[#022C25] p-10 text-white lg:block">
          <BrandLockup />
          <div className="mt-28">
            <p className="text-sm font-bold uppercase tracking-widest text-[#6EE7C1]">Cordova Public College</p>
            <h1 className="mt-4 font-['Space_Grotesk'] text-4xl font-semibold leading-tight">Get back to your support network.</h1>
            <p className="mt-5 text-sm leading-relaxed text-slate-300">We will help you securely regain access to your Guidance Office account.</p>
          </div>
          <div className="mt-24 flex items-center gap-3 text-sm text-slate-300"><LockKeyhole size={18} className="text-[#6EE7C1]" /> Secure account recovery</div>
        </aside>
        <section className="p-6 sm:p-10">
          <div className="mb-8 lg:hidden"><strong className="font-['Space_Grotesk'] text-xl text-[#022C25]">Comfy<span className="text-[#ECFDF6]0">Hub</span></strong></div>
          <Link className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-slate-800" to="/login"><ArrowLeft size={15} /> Back to sign in</Link>
          <p className="mt-10 text-sm font-bold uppercase tracking-widest text-[#059675]">Account recovery</p>
          <h2 className="mt-2 font-['Space_Grotesk'] text-3xl font-bold text-[#022C25]">Forgot your password?</h2>
          <p className="mt-2 text-sm leading-relaxed text-slate-400">Enter your school email and we will send instructions to reset your password.</p>
          {reset ? (
            <div className="mt-8 rounded-lg border border-[#A7F3D6] bg-[#ECFDF6] p-5 text-sm text-[#064E41]" role="status"><div className="flex items-center gap-2 font-bold"><CheckCircle2 size={18} /> Password updated</div><p className="mt-2 text-sm">Your password was reset successfully.</p><Link className="mt-5 inline-flex text-sm font-bold text-[#064E41] underline" to="/login">Return to sign in</Link></div>
          ) : submitted ? (
            <div className="mt-8 rounded-lg border border-[#A7F3D6] bg-[#ECFDF6] p-5 text-sm text-[#064E41]" role="status">
              <div className="flex items-center gap-2 font-bold"><CheckCircle2 size={18} /> Check your inbox</div>
              <p className="mt-2 text-sm leading-relaxed">Enter the six-digit code sent to {email}.</p>
              <form className="mt-5 grid gap-3" onSubmit={submit}><input className="rounded-md border border-slate-200 bg-white px-3 py-3 text-sm tracking-[0.4em] outline-none focus:border-[#059675]" inputMode="numeric" maxLength={6} onChange={(event) => setCode(event.target.value.replace(/\D/g, ""))} placeholder="000000" value={code} /><input className="rounded-md border border-slate-200 bg-white px-3 py-3 text-sm outline-none focus:border-[#059675]" onChange={(event) => setPassword(event.target.value)} placeholder="New password" type="password" value={password} /><input className="rounded-md border border-slate-200 bg-white px-3 py-3 text-sm outline-none focus:border-[#059675]" onChange={(event) => setPasswordConfirmation(event.target.value)} placeholder="Confirm new password" type="password" value={passwordConfirmation} />{error && <p className="rounded-md bg-red-50 p-3 text-sm text-red-600" role="alert">{error}</p>}<button className="inline-flex items-center justify-center gap-2 rounded-md bg-[#022C25] px-4 py-3 text-sm font-bold text-white" type="submit">Reset password <ArrowRight size={17} /></button></form>
              <button className="mt-5 text-sm font-bold text-[#064E41] underline" onClick={() => { setSubmitted(false); setError(""); }} type="button">Use a different email</button>
            </div>
          ) : (
            <form className="mt-8 grid gap-4" onSubmit={submit}>
              <label className="grid gap-2 text-sm font-bold text-slate-600">School email<input autoComplete="email" className="rounded-md border border-slate-200 px-3 py-3 text-sm outline-none focus:border-[#059675]" onChange={(event) => setEmail(event.target.value)} placeholder="you@cordova.edu.ph" type="email" value={email} /></label>
              {error && <p className="rounded-md bg-red-50 p-3 text-sm text-red-600" role="alert">{error}</p>}
              <button className="mt-2 inline-flex items-center justify-center gap-2 rounded-md bg-[#022C25] px-4 py-3 text-sm font-bold text-white hover:bg-[#047860]" type="submit">Send reset instructions <ArrowRight size={17} /></button>
            </form>
          )}
          <p className="mt-8 flex items-center justify-center gap-2 text-center text-sm text-slate-400"><LockKeyhole size={13} /> Your account details are protected by ComfyHub.</p>
        </section>
      </div>
    </main>
  );
}
