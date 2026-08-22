"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";

type Student = {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  age: number;
  course: string;
  year_level: number;
  status: "active" | "inactive";
};

type Statistics = { total_students: number; active_students: number; inactive_students: number };

const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";
const emptyForm = { first_name: "", last_name: "", email: "", age: "", course: "", year_level: "1", status: "active" };

function initials(student: Student) {
  return `${student.first_name[0]}${student.last_name[0]}`.toUpperCase();
}

export default function Home() {
  const [students, setStudents] = useState<Student[]>([]);
  const [stats, setStats] = useState<Statistics>({ total_students: 0, active_students: 0, inactive_students: 0 });
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [course, setCourse] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);

  const loadStudents = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const params = new URLSearchParams({ per_page: "100" });
      if (search) params.set("search", search);
      if (status !== "all") params.set("status", status);
      if (course !== "all") params.set("course", course);
      const [studentResponse, statsResponse] = await Promise.all([
        fetch(`${apiUrl}/students?${params}`),
        fetch(`${apiUrl}/students/statistics`),
      ]);
      if (!studentResponse.ok || !statsResponse.ok) throw new Error("The student service returned an error.");
      const studentData = await studentResponse.json();
      setStudents(studentData.data ?? []);
      setStats(await statsResponse.json());
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Unable to load students.");
    } finally {
      setLoading(false);
    }
  }, [course, search, status]);

  useEffect(() => {
    const timer = window.setTimeout(loadStudents, 250);
    return () => window.clearTimeout(timer);
  }, [loadStudents]);

  async function createStudent(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    try {
      const response = await fetch(`${apiUrl}/students`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ ...form, age: Number(form.age), year_level: Number(form.year_level) }),
      });
      if (!response.ok) throw new Error("Please check the student details and try again.");
      setForm(emptyForm);
      setShowForm(false);
      loadStudents();
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Unable to add student.");
    }
  }

  const courses = Array.from(new Set(students.map((student) => student.course))).sort();

  return (
    <main className="app-shell">
      <aside className="sidebar">
        <div className="brand"><span className="brand-mark">S</span><span>Scholar<span className="brand-accent">ly</span></span></div>
        <nav className="nav-list" aria-label="Main navigation"><a className="nav-item active" href="#students"><span>▦</span> Students</a><a className="nav-item" href="#overview"><span>◫</span> Overview</a><a className="nav-item" href="#reports"><span>◌</span> Reports</a></nav>
        <div className="sidebar-footer"><div className="help-icon">?</div><div><strong>Need a hand?</strong><small>Visit the help center</small></div></div>
      </aside>
      <section className="content" id="students">
        <header className="topbar"><div className="breadcrumb">Workspace <span>/</span> Students</div><div className="user-menu"><span className="notification">♧</span><span className="avatar user-avatar">JD</span><span className="user-name">Jordan Davis</span><span className="chevron">⌄</span></div></header>
        <div className="page-content">
          <div className="page-heading"><div><p className="eyebrow">Academic records</p><h1>Students</h1><p className="subtitle">Keep track of every learner in your program.</p></div><button className="primary-button" onClick={() => setShowForm(true)}><span>+</span> Add student</button></div>
          <div className="stat-grid"><article className="stat-card"><div className="stat-icon teal">◉</div><div><span>Total students</span><strong>{stats.total_students}</strong><small className="positive">↑ 12% <em>vs last month</em></small></div></article><article className="stat-card"><div className="stat-icon green">✓</div><div><span>Active students</span><strong>{stats.active_students}</strong><small className="positive">↑ 8% <em>vs last month</em></small></div></article><article className="stat-card"><div className="stat-icon amber">◷</div><div><span>Inactive students</span><strong>{stats.inactive_students}</strong><small className="muted">Currently paused</small></div></article></div>
          <section className="student-panel"><div className="panel-heading"><div><h2>All students</h2><p>{students.length} records found</p></div><button className="more-button" aria-label="More options">•••</button></div><div className="toolbar"><label className="search-box"><span>⌕</span><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search students" aria-label="Search students" /></label><select value={course} onChange={(event) => setCourse(event.target.value)} aria-label="Filter by course"><option value="all">All courses</option>{courses.map((item) => <option key={item} value={item}>{item}</option>)}</select><select value={status} onChange={(event) => setStatus(event.target.value)} aria-label="Filter by status"><option value="all">All status</option><option value="active">Active</option><option value="inactive">Inactive</option></select><button className="filter-button" aria-label="Open filters">☷ <span>Filters</span></button></div>{error && <div className="error-message" role="alert">{error}</div>}<div className="table-wrap"><table><thead><tr><th>Student</th><th>Course</th><th>Year level</th><th>Age</th><th>Status</th><th><span className="sr-only">Actions</span></th></tr></thead><tbody>{loading ? <tr><td className="table-message" colSpan={6}>Loading students...</td></tr> : students.length === 0 ? <tr><td className="table-message" colSpan={6}>No students match these filters.</td></tr> : students.map((student) => <tr key={student.id}><td><div className="student-cell"><span className="avatar">{initials(student)}</span><div><strong>{student.first_name} {student.last_name}</strong><small>{student.email}</small></div></div></td><td>{student.course}</td><td>Year {student.year_level}</td><td>{student.age}</td><td><span className={`status ${student.status}`}>{student.status}</span></td><td><button className="row-action" aria-label={`Actions for ${student.first_name} ${student.last_name}`}>•••</button></td></tr>)}</tbody></table></div></section>
        </div>
      </section>
      {showForm && <div className="modal-backdrop" onMouseDown={(event) => event.target === event.currentTarget && setShowForm(false)}><form className="modal" onSubmit={createStudent}><div className="modal-header"><div><p className="eyebrow">New record</p><h2>Add student</h2></div><button type="button" className="close-button" onClick={() => setShowForm(false)} aria-label="Close">×</button></div><div className="form-grid"><label>First name<input required value={form.first_name} onChange={(event) => setForm({ ...form, first_name: event.target.value })} /></label><label>Last name<input required value={form.last_name} onChange={(event) => setForm({ ...form, last_name: event.target.value })} /></label><label>Email<input required type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} /></label><label>Age<input required min="15" type="number" value={form.age} onChange={(event) => setForm({ ...form, age: event.target.value })} /></label><label>Course<input required value={form.course} onChange={(event) => setForm({ ...form, course: event.target.value })} /></label><label>Year level<select value={form.year_level} onChange={(event) => setForm({ ...form, year_level: event.target.value })}><option value="1">Year 1</option><option value="2">Year 2</option><option value="3">Year 3</option><option value="4">Year 4</option></select></label></div><label className="status-field">Status<select value={form.status} onChange={(event) => setForm({ ...form, status: event.target.value })}><option value="active">Active</option><option value="inactive">Inactive</option></select></label><div className="modal-actions"><button type="button" className="secondary-button" onClick={() => setShowForm(false)}>Cancel</button><button className="primary-button" type="submit">Create student</button></div></form></div>}
    </main>
  );
}
