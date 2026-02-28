import { API_BASE_URL, APP_BASE_URL } from "./config";
import type {
  AuthUser,
  ShortenRequest,
  ShortenResponse,
  UrlMetricsSummary,
  UrlRecord,
} from "../types/api";

async function request<T>(
  path: string,
  options: RequestInit = {},
  token?: string,
): Promise<T> {
  const headers = new Headers(options.headers);
  headers.set("Content-Type", "application/json");

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
    credentials: "include",
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || `Request failed with status ${response.status}`);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  const contentType = response.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}

export function shortenUrl(payload: ShortenRequest, token?: string) {
  return request<ShortenResponse>("/shorten", {
    method: "POST",
    body: JSON.stringify(payload),
  }, token);
}

export function getMe(token?: string) {
  return request<AuthUser>("/auth/me", { method: "GET" }, token);
}

export function logout(token?: string) {
  return request<void>("/auth/logout", { method: "POST" }, token);
}

export function getMyUrls(token?: string) {
  return request<UrlRecord[]>("/urls/my", { method: "GET" }, token);
}

export function getMyMetrics(token?: string) {
  return request<UrlMetricsSummary>("/metrics/summary", { method: "GET" }, token);
}

export function getOauthStartUrl(provider: "github") {
  const callbackUrl = new URL(APP_BASE_URL);
  callbackUrl.searchParams.set("postLogin", "1");

  const url = new URL(`${API_BASE_URL}/auth/login`);
  url.searchParams.set("provider", provider);
  url.searchParams.set("redirectUri", callbackUrl.toString());
  url.searchParams.set("redirect_uri", callbackUrl.toString());

  return url.toString();
}
