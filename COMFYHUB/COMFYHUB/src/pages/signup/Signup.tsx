import {
  ArrowRight,
  BriefcaseBusiness,
  CheckCircle2,
  ChevronDown,
  Eye,
  EyeOff,
  GraduationCap,
  LockKeyhole,
  ShieldCheck,
  UserRound,
} from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { useApp, type Role } from "@/context/AppContext";
import { authenticate } from "@/lib/api";
import { BrandLockup } from "@/components/common/BrandLockup";

const roleOptions: {
  role: Role;
  label: string;
  description: string;
  icon: typeof GraduationCap;
}[] = [
  {
    role: "Student",
    label: "Student",
    description: "Submit concerns and request guidance.",
    icon: GraduationCap,
  },
  {
    role: "Counselor",
    label: "Counselor",
    description: "Support students and manage cases.",
    icon: UserRound,
  },
  {
    role: "Admin",
    label: "Administrator",
    description: "Manage the system and security.",
    icon: BriefcaseBusiness,
  },
];

const courseOptions = ["BSIT", "BSHM", "BSED", "BEED"];

export function Signup() {
  const navigate = useNavigate();
  const { setRole, setAuthenticated, setUser } = useApp();
  const [role, setSelectedRole] = useState<Role>("Student");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [studentId, setStudentId] = useState("");
  const [course, setCourse] = useState("BSIT");
  const [section, setSection] = useState("");
  const [department, setDepartment] = useState("Guidance Office");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    const requiresStudentId = role === "Student";
    if (!name.trim() || !email.trim() || (requiresStudentId && !/^\d{8,}$/.test(studentId)) || password.length < 6) {
      setError(
        requiresStudentId
          ? "Enter your name, school email, an ID with at least 8 digits, and a password with at least 6 characters."
          : "Enter your name, school email, and a password with at least 6 characters.",
      );
      return;
    }
    try {
      const response = await authenticate("/auth/register", {
        name,
        email,
        student_id: studentId,
        course,
        section,
        password,
        role,
        department,
        phone,
      });
      setRole(response.user.role);
      setUser({ ...response.user, studentId: response.user.student_id || studentId, course: response.user.course || course, section: response.user.section || section, department: response.user.department || "", phone: response.user.phone || "", avatar: response.user.avatar });
      setAuthenticated(true);
      navigate("/");
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Unable to create your account.");
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#F6FFFB] px-4 py-8">
      <div className="grid w-full max-w-5xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl lg:grid-cols-[.8fr_1.2fr]">
        <aside className="hidden bg-[#022C25] p-10 text-white lg:block">
          <BrandLockup />
          <div className="mt-24">
            <p className="text-sm font-bold uppercase tracking-widest text-[#6EE7C1]">
              Cordova Public College
            </p>
            <h1 className="mt-4 font-['Space_Grotesk'] text-4xl font-semibold leading-tight">
              Your support network starts here.
            </h1>
            <p className="mt-5 text-sm leading-relaxed text-slate-300">
              Create the right account for your role and connect with the
              Guidance Office securely.
            </p>
          </div>
          <div className="mt-24 flex items-center gap-3 text-sm text-slate-300">
            <ShieldCheck size={18} className="text-[#6EE7C1]" /> Verified
            campus access
          </div>
        </aside>
        <section className="p-6 sm:p-10">
          <div className="mb-8 lg:hidden">
            <strong className="font-['Space_Grotesk'] text-xl text-[#022C25]">
              Comfy<span className="text-[#ECFDF6]0">Hub</span>
            </strong>
          </div>
          <p className="text-sm font-bold uppercase tracking-widest text-[#059675]">
            Create your account
          </p>
          <h2 className="mt-2 font-['Space_Grotesk'] text-3xl font-bold text-[#022C25]">
            Who are you joining as?
          </h2>
          <p className="mt-2 text-sm text-slate-400">
            Your role controls the tools and information you can access.
          </p>
          <div className="mt-7 grid gap-3 sm:grid-cols-3">
            {roleOptions.map(
              ({ role: option, label, description, icon: Icon }) => (
                <button
                  className={`rounded-lg border p-4 text-left transition ${role === option ? "border-[#12CE9F] bg-[#ECFDF6] ring-2 ring-[#A7F3D6]" : "border-slate-200 hover:border-slate-400"}`}
                  key={option}
                  onClick={() => {
                    setSelectedRole(option);
                    setError("");
                  }}
                  type="button"
                >
                  <div className="flex items-center justify-between">
                    <Icon
                      size={20}
                      className={
                        role === option ? "text-[#047860]" : "text-slate-400"
                      }
                    />
                    {role === option && (
                      <CheckCircle2 size={16} className="text-[#059675]" />
                    )}
                  </div>
                  <strong className="mt-4 block text-sm text-slate-700">
                    {label}
                  </strong>
                  <span className="mt-1 block text-sm leading-relaxed text-slate-400">
                    {description}
                  </span>
                </button>
              ),
            )}
          </div>
          <form className="mt-8 grid gap-4" onSubmit={submit}>
            <label className="grid gap-2 text-sm font-bold text-slate-600">
              Full name
              <input
                className="rounded-md border border-slate-200 px-3 py-3 text-sm outline-none focus:border-[#059675]"
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder={
                  role === "Student" ? "e.g. Maria Santos" : "e.g. Maria Cruz"
                }
              />
            </label>
            <label className="grid gap-2 text-sm font-bold text-slate-600">
              School email
              <input
                className="rounded-md border border-slate-200 px-3 py-3 text-sm outline-none focus:border-[#059675]"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                type="email"
                placeholder="you@cordova.edu.ph"
              />
            </label>
            {role === "Student" && (
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                <label className="grid min-w-0 gap-2 text-sm font-bold text-slate-600">
                  Student ID number
                  <input
                    className="w-full rounded-md border border-slate-200 px-3 py-3 text-sm outline-none focus:border-[#059675]"
                    value={studentId}
                    onChange={(event) => setStudentId(event.target.value.replace(/\D/g, ""))}
                    inputMode="numeric"
                    minLength={8}
                    placeholder="At least 8 digits"
                  />
                </label>
                <label className="grid min-w-0 gap-2 text-sm font-bold text-slate-600">
                  Course
                  <div className="relative">
                    <select
                      className="w-full appearance-none rounded-md border border-slate-200 bg-white px-3 py-3 pr-10 text-sm outline-none focus:border-[#059675]"
                      value={course}
                      onChange={(event) => setCourse(event.target.value)}
                    >
                      {courseOptions.map((option) => <option key={option}>{option}</option>)}
                    </select>
                    <ChevronDown size={16} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-500" />
                  </div>
                </label>
                <label className="grid min-w-0 gap-2 text-sm font-bold text-slate-600 sm:col-span-2 lg:col-span-1">
                  Section
                  <input
                    className="w-full rounded-md border border-slate-200 px-3 py-3 text-sm outline-none focus:border-[#059675]"
                    value={section}
                    onChange={(event) => setSection(event.target.value)}
                    placeholder="e.g. 2A"
                  />
                </label>
              </div>
            )}
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="grid gap-2 text-sm font-bold text-slate-600">
                Department
                <select
                  className="rounded-md border border-slate-200 bg-white px-3 py-3 text-sm outline-none focus:border-[#059675]"
                  value={department}
                  onChange={(event) => setDepartment(event.target.value)}
                >
                  <option>Guidance Office</option>
                  <option>Student Affairs</option>
                  <option>Administration</option>
                </select>
              </label>
              <label className="grid gap-2 text-sm font-bold text-slate-600">
                Phone number
                <input
                  className="rounded-md border border-slate-200 px-3 py-3 text-sm outline-none focus:border-[#059675]"
                  value={phone}
                  onChange={(event) => setPhone(event.target.value)}
                  placeholder="+63 917 842 0194"
                />
              </label>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="grid gap-2 text-sm font-bold text-slate-600">
                Password
                <div className="relative">
                  <input
                    className="w-full rounded-md border border-slate-200 px-3 py-3 pr-10 text-sm outline-none focus:border-[#059675]"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    type={showPassword ? "text" : "password"}
                    placeholder="At least 6 characters"
                  />
                  <button
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
                    onClick={() => setShowPassword((visible) => !visible)}
                    title={showPassword ? "Hide password" : "Show password"}
                    type="button"
                  >
                    {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                  </button>
                </div>
              </label>
              <div className="hidden sm:block" />
            </div>
            {error && (
              <p className="rounded-md bg-red-50 p-3 text-sm text-red-600">
                {error}
              </p>
            )}
            <button
              className="mt-2 inline-flex items-center justify-center gap-2 rounded-md bg-[#022C25] px-4 py-3 text-sm font-bold text-white hover:bg-[#047860]"
              type="submit"
            >
              Verify and continue <ArrowRight size={17} />
            </button>
            <p className="flex items-center justify-center gap-2 text-center text-sm text-slate-400">
              <LockKeyhole size={13} /> Your account details are protected by
              ComfyHub.
            </p>
            <p className="text-center text-sm text-slate-500">
              Already have an account?{" "}
              <Link className="font-bold text-[#047860]" to="/login">
                Sign in
              </Link>
            </p>
          </form>
        </section>
      </div>
    </main>
  );
}
