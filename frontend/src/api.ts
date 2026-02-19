const API_URL = import.meta.env.VITE_API_URL;

export async function postJson(url: string, body: any) {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const text = await res.text();
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

export async function apiRequest(url: string, options: RequestInit = {}) {
  const token = localStorage.getItem("token");
  const headers = {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  const res = await fetch(url, {
    ...options,
    headers,
  });

  // Handle expired/invalid tokens
  if (res.status === 401 || res.status === 403) {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    alert("Your session has expired. Please log in again.");
    window.location.href = "/login";
    throw new Error("Authentication expired");
  }

  const text = await res.text();
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

export async function getJobs() {
  return apiRequest(`${API_URL}/jobs`);
}

export async function createJob(jobData: any) {
  return apiRequest(`${API_URL}/jobs`, {
    method: "POST",
    body: JSON.stringify(jobData),
  });
}

export async function updateJob(id: number, jobData: any) {
  return apiRequest(`${API_URL}/jobs/${id}`, {
    method: "PUT",
    body: JSON.stringify(jobData),
  });
}

export async function deleteJob(id: number) {
  return apiRequest(`${API_URL}/${id}`, {
    method: "DELETE",
  });
}
