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

  const text = await res.text();
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

export async function getJobs() {
  return apiRequest("http://localhost:5000/jobs");
}

export async function createJob(jobData: any) {
  return apiRequest("http://localhost:5000/jobs", {
    method: "POST",
    body: JSON.stringify(jobData),
  });
}

export async function updateJob(id: number, jobData: any) {
  return apiRequest(`http://localhost:5000/jobs/${id}`, {
    method: "PUT",
    body: JSON.stringify(jobData),
  });
}

export async function deleteJob(id: number) {
  return apiRequest(`http://localhost:5000/jobs/${id}`, {
    method: "DELETE",
  });
}
