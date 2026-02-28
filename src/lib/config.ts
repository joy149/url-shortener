export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ??
  "https://urlshortnerservice-1-igly.onrender.com";

export const APP_BASE_URL =
  import.meta.env.VITE_APP_BASE_URL ??
  (typeof window !== "undefined" ? window.location.origin : "http://localhost:10000");

export const TOKEN_STORAGE_KEY = "url_shortener_auth_token";
