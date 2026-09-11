import { Camera, LockKeyhole, Save, UserRound } from "lucide-react";
import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/ui/section";
import { useApp } from "@/context/AppContext";

export function Profile() {
  const { user, role, setUser } = useApp();
  const [name, setName] = useState(user.name || "");
  const [email, setEmail] = useState(user.email || "");
  const [department, setDepartment] = useState(user.department || "Guidance Office");
  const [phone, setPhone] = useState(user.phone || "");
  const [saved, setSaved] = useState(false);
  const [avatar, setAvatar] = useState<string | null>(user.avatar ?? null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  function submit(event: React.FormEvent) {
    event.preventDefault();
    setUser({ name, email, department, phone, avatar });
    setSaved(true);
    setTimeout(() => setSaved(false), 2200);
  }

  function handleImageUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result !== "string") return;
      setAvatar(reader.result);
      setUser({ avatar: reader.result });
    };
    reader.readAsDataURL(file);
  }

  return (
    <div className="space-y-5">
      <PageHeader
        eyebrow="Account settings"
        title="My profile"
        description="Keep your contact details and account preferences up to date."
      />
      <div className="grid gap-5 lg:grid-cols-[245px_1fr]">
        <aside className="rounded-lg bg-[#022C25] p-6 text-white">
          <div className="relative inline-block">
            <button
              type="button"
              className="flex h-20 w-20 cursor-pointer items-center justify-center overflow-hidden rounded-full bg-[#D1FAE8] text-xl font-bold text-[#047860] transition hover:opacity-90"
              aria-label="Upload profile photo"
              onClick={() => fileInputRef.current?.click()}
            >
              {avatar ? (
                <img
                  src={avatar}
                  alt="Profile"
                  className="h-full w-full object-cover"
                />
              ) : (
                "MC"
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageUpload}
              />
            </button>
            <button
              type="button"
              className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full border-2 border-[#022C25] bg-[#34D3A6] text-[#022C25] shadow-md"
              aria-label="Choose profile photo"
              onClick={() => fileInputRef.current?.click()}
            >
              <Camera size={14} />
            </button>
          </div>
          <h2 className="mt-5 text-lg font-semibold">{name || "User"}</h2>
          <p className="mt-1 text-sm text-slate-400">{department || "Guidance Counselor"}</p>
          <span className="mt-3 inline-flex items-center gap-1 text-sm text-[#6EE7C1]">
            Verified account
          </span>
          <div className="mt-7 border-t border-slate-700 pt-5 text-sm text-slate-400">
            <div className="flex gap-2">
              <UserRound size={15} />
              <span>
                Employee ID
                <strong className="mt-1 block text-white">{user.studentId || `${role} account`}</strong>
              </span>
            </div>
            <div className="mt-5 flex gap-2">
              <LockKeyhole size={15} />
              <span>
                Last sign in
                <strong className="mt-1 block text-white">
                  Today, 8:14 AM
                </strong>
              </span>
            </div>
          </div>
        </aside>
        <form
          className="grid gap-6 rounded-lg border border-slate-200 bg-white p-6"
          onSubmit={submit}
        >
          <div className="border-b border-slate-100 pb-5">
            <p className="mb-2 text-sm font-bold uppercase tracking-wider text-[#059675]">
              Personal details
            </p>
            <h2 className="text-lg font-semibold text-[#022C25]">
              Profile information
            </h2>
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            <label className="grid gap-2 text-sm font-bold text-slate-600">
              Full name
              <input
                className="rounded border border-slate-200 p-2.5 text-sm"
                value={name}
                onChange={(event) => setName(event.target.value)}
              />
            </label>
            <label className="grid gap-2 text-sm font-bold text-slate-600">
              Work email
              <input
                className="rounded border border-slate-200 p-2.5 text-sm"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                type="email"
              />
            </label>
            <label className="grid gap-2 text-sm font-bold text-slate-600">
              Account role
              <input
                className="rounded border border-slate-200 bg-[#F6FFFB] p-2.5 text-sm text-slate-500"
                value={role === "Admin" ? "Administrator" : role}
                readOnly
              />
            </label>
            {user.studentId && <label className="grid gap-2 text-sm font-bold text-slate-600">
              Student ID number
              <input
                className="rounded border border-slate-200 bg-[#F6FFFB] p-2.5 text-sm text-slate-500"
                value={user.studentId}
                readOnly
              />
            </label>}
            {user.course && <label className="grid gap-2 text-sm font-bold text-slate-600">
              Course
              <input
                className="rounded border border-slate-200 bg-[#F6FFFB] p-2.5 text-sm text-slate-500"
                value={user.course}
                readOnly
              />
            </label>}
            {user.section && <label className="grid gap-2 text-sm font-bold text-slate-600">
              Section
              <input
                className="rounded border border-slate-200 bg-[#F6FFFB] p-2.5 text-sm text-slate-500"
                value={user.section}
                readOnly
              />
            </label>}
            <label className="grid gap-2 text-sm font-bold text-slate-600">
              Department
              <select
                className="rounded border border-slate-200 bg-white p-2.5 text-sm"
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
                className="rounded border border-slate-200 p-2.5 text-sm"
                value={phone}
                onChange={(event) => setPhone(event.target.value)}
              />
            </label>
          </div>
          <div className="flex flex-col gap-4 border-t border-slate-100 pt-5 sm:flex-row sm:items-center sm:justify-between">
            <span className="text-sm text-slate-400">
              {saved
                ? "Profile saved successfully."
                : "Your information is private to your school."}
            </span>
            <Button type="submit">
              <Save size={16} /> {saved ? "Saved" : "Save changes"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
