import {
  ArrowRight,
  ChevronDown,
  Eye,
  EyeOff,
  LockKeyhole,
  ShieldCheck,
} from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { useApp, type Role } from "@/context/AppContext";
import { authenticate } from "@/lib/api";
import { BrandLockup } from "@/components/common/BrandLockup";

const courseOptions = ["BSIT", "BSHM", "BSED", "BEED"];

export function Login() {
  const navigate = useNavigate();
  const { setRole, setAuthenticated, setUser } = useApp();
  const [role, setSelectedRole] = useState<Role>("Student");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [studentId, setStudentId] = useState("");
  const [course, setCourse] = useState("BSIT");
  const [department, setDepartment] = useState("Guidance Office");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    if (!email.trim() || (role === "Student" && !/^\d{8,}$/.test(studentId)) || !password.trim()) {
      setError(role === "Student" ? "Enter your school email, an ID with at least 8 digits, and your password to continue." : "Enter your school email and password to continue.");
      return;
    }
    try {
      const response = await authenticate("/auth/login", {
        email,
        role,
        ...(role === "Student" ? { student_id: studentId, course } : {}),
        password,
      });
      setRole(response.user.role);
      setUser({
        ...response.user,
        studentId: response.user.student_id || studentId,
        course: response.user.course || course,
        department: response.user.department || department,
        phone: response.user.phone || phone,
        avatar: response.user.avatar,
      });
      setAuthenticated(true);
      navigate("/");
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Unable to sign in.");
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#F6FFFB] px-4 py-8">
      <div className="grid w-full max-w-5xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl lg:grid-cols-[.8fr_1.2fr]">
        <aside className="hidden bg-[#022C25] p-10 text-white lg:block">
          <BrandLockup />
          <div className="mt-28"><p className="text-sm font-bold uppercase tracking-widest text-[#6EE7C1]">Cordova Public College</p><h1 className="mt-4 font-['Space_Grotesk'] text-4xl font-semibold leading-tight">Welcome back to your support network.</h1><p className="mt-5 text-sm leading-relaxed text-slate-300">Sign in to continue accessing guidance services and campus support.</p></div>
          <div className="mt-24 flex items-center gap-3 text-sm text-slate-300"><ShieldCheck size={18} className="text-[#6EE7C1]" /> Secure campus access</div>
        </aside>
        <section className="p-6 sm:p-10">
          <div className="mb-8 lg:hidden"><strong className="font-['Space_Grotesk'] text-xl text-[#022C25]">Comfy<span className="text-[#ECFDF6]0">Hub</span></strong></div>
          <p className="text-sm font-bold uppercase tracking-widest text-[#059675]">Welcome back</p>
          <h2 className="mt-2 font-['Space_Grotesk'] text-3xl font-bold text-[#022C25]">Sign in to ComfyHub</h2>
          <p className="mt-2 text-sm text-slate-400">Choose your account role to continue.</p>
          <div className="mt-7 grid grid-cols-3 gap-2">{(["Student", "Counselor", "Admin"] as Role[]).map((option) => <button className={`rounded-md border px-2 py-3 text-sm font-bold transition ${role === option ? "border-[#34D3A6] bg-[#ECFDF6] text-[#047860]" : "border-slate-200 text-slate-500 hover:border-slate-400"}`} key={option} onClick={() => { setSelectedRole(option); setError(""); }} type="button">{option === "Admin" ? "Administrator" : option}</button>)}</div>
          <form className="mt-8 grid gap-4" onSubmit={submit}>
            <label className="grid gap-2 text-sm font-bold text-slate-600">Full name<input className="rounded-md border border-slate-200 px-3 py-3 text-sm outline-none focus:border-[#059675]" value={name} onChange={(event) => setName(event.target.value)} placeholder="Your full name" /></label>
            <label className="grid gap-2 text-sm font-bold text-slate-600">School email<input className="rounded-md border border-slate-200 px-3 py-3 text-sm outline-none focus:border-[#059675]" value={email} onChange={(event) => setEmail(event.target.value)} type="email" placeholder="you@cordova.edu.ph" /></label>
            {role !== "Admin" && (
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="grid gap-2 text-sm font-bold text-slate-600">Student ID number<input className="rounded-md border border-slate-200 px-3 py-3 text-sm outline-none focus:border-[#059675]" value={studentId} onChange={(event) => setStudentId(event.target.value.replace(/\D/g, ""))} inputMode="numeric" minLength={8} placeholder="At least 8 digits" /></label>
                <label className="grid gap-2 text-sm font-bold text-slate-600">Course<div className="relative"><select className="w-full appearance-none rounded-md border border-slate-200 bg-white p-3 pr-10 text-sm outline-none focus:border-[#059675]" value={course} onChange={(event) => setCourse(event.target.value)}>{courseOptions.map((option) => <option key={option}>{option}</option>)}</select><ChevronDown size={16} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-500" /></div></label>
              </div>
            )}
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="grid gap-2 text-sm font-bold text-slate-600">Department<select className="rounded-md border border-slate-200 bg-white px-3 py-3 text-sm outline-none focus:border-[#059675]" value={department} onChange={(event) => setDepartment(event.target.value)}><option>Guidance Office</option><option>Student Affairs</option><option>Administration</option></select></label>
              <label className="grid gap-2 text-sm font-bold text-slate-600">Phone number<input className="rounded-md border border-slate-200 px-3 py-3 text-sm outline-none focus:border-[#059675]" value={phone} onChange={(event) => setPhone(event.target.value)} placeholder="+63 917 842 0194" /></label>
            </div>
            <label className="grid gap-2 text-sm font-bold text-slate-600">Password
              <div className="relative"><input className="w-full rounded-md border border-slate-200 px-3 py-3 pr-10 text-sm outline-none focus:border-[#059675]" value={password} onChange={(event) => setPassword(event.target.value)} type={showPassword ? "text" : "password"} placeholder="Enter your password" /><button aria-label={showPassword ? "Hide password" : "Show password"} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700" onClick={() => setShowPassword((visible) => !visible)} title={showPassword ? "Hide password" : "Show password"} type="button">{showPassword ? <EyeOff size={17} /> : <Eye size={17} />}</button></div>
            </label>
            <div className="flex justify-end"><Link to="/forgot-password" className="text-sm font-semibold text-[#047860]">Forgot password?</Link></div>
            {error && <p className="rounded-md bg-red-50 p-3 text-sm text-red-600">{error}</p>}
            <button className="mt-2 inline-flex items-center justify-center gap-2 rounded-md bg-[#022C25] px-4 py-3 text-sm font-bold text-white hover:bg-[#047860]" type="submit">Sign in <ArrowRight size={17} /></button>
            <p className="flex items-center justify-center gap-2 text-center text-sm text-slate-400"><LockKeyhole size={13} /> Your connection is protected.</p>
          </form>
          <p className="mt-7 text-center text-sm text-slate-500">New to ComfyHub? <Link className="font-bold text-[#047860]" to="/signup">Create an account</Link></p>
        </section>
      </div>
    </main>
  );
}