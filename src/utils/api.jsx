// Use REACT_APP_API_URL from environment variables
const API_URL = "http://localhost:5000/api";

/**
 * Wrapper for fetch API with JWT auth
 */
export const apiFetch = async (endpoint, options = {}) => {
  const token = localStorage.getItem("authToken");

  const defaultHeaders = {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };

  const res = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: { ...defaultHeaders, ...options.headers },
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "API request failed");
  return data;
};
