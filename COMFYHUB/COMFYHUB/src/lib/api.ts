const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001/api";

export async function apiRequest<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = sessionStorage.getItem("comfyhub-token");
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      Accept: "application/json",
      ...(options.body instanceof FormData ? {} : { "Content-Type": "application/json" }),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  const payload = await response.json().catch(() => null);
  if (!response.ok) {
    throw new Error(payload?.message || "The request could not be completed.");
  }
  return payload as T;
}

export type AuthResponse = {
  token: string;
  user: {
    name: string;
    email: string;
    student_id?: string;
    course?: string;
    role: "Student" | "Counselor" | "Admin";
    department: string | null;
    section?: string;
    phone: string | null;
    avatar: string | null;
  };
};

export async function authenticate(path: "/auth/login" | "/auth/register", body: Record<string, string>) {
  const response = await apiRequest<AuthResponse>(path, {
    method: "POST",
    body: JSON.stringify(body),
  });
  sessionStorage.setItem("comfyhub-token", response.token);
  return response;
}

export async function requestPasswordReset(email: string) {
  return apiRequest<{ message: string }>("/auth/forgot-password", {
    method: "POST",
    body: JSON.stringify({ email }),
  });
}

export async function resetPassword(email: string, code: string, password: string, password_confirmation: string) {
  return apiRequest<{ message: string }>("/auth/reset-password", {
    method: "POST",
    body: JSON.stringify({ email, code, password, password_confirmation }),
  });
}
