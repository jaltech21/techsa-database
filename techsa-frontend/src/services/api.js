import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

// Attach JWT token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("techsa_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// TODO: Add 401 response interceptor in Phase 2 — redirect to /login

export const authApi = {
  register: (data) => api.post("/api/v1/members", { member: data }),
  login: (data) => api.post("/api/v1/members/sign_in", { member: data }),
  logout: () => api.delete("/api/v1/members/sign_out"),
  me: () => api.get("/api/v1/members/me"),
};

export const adminApi = {
  listMembers: () => api.get("/api/v1/admin/members"),
  updateMember: (id, data) => api.patch(`/api/v1/admin/members/${id}`, { member: data }),
};

export default api;
