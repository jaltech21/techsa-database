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

// On 401 response, clear stale token and redirect to login
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("techsa_token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export const authApi = {
  register: (data) => api.post("/api/v1/members", { member: data }),
  login: (data) => api.post("/api/v1/members/sign_in", { member: data }),
  logout: () => api.delete("/api/v1/members/sign_out"),
  me: () => api.get("/api/v1/members/me"),
  forgotPassword: (email) =>
    api.post("/api/v1/members/password", { member: { email } }),
  resetPassword: (token, password, passwordConfirmation) =>
    api.put("/api/v1/members/password", {
      member: { reset_password_token: token, password, password_confirmation: passwordConfirmation },
    }),
};

export const passkeyApi = {
  validate: (token) => api.post("/api/v1/passkeys/validate", { token }),
};

export const adminApi = {
  listMembers: () => api.get("/api/v1/admin/members"),
  updateMember: (id, data) =>
    api.patch(`/api/v1/admin/members/${id}`, { member: data }),
  listPasskeys: () => api.get("/api/v1/admin/passkeys"),
  generatePasskey: () => api.post("/api/v1/admin/passkeys"),
};

export default api;
