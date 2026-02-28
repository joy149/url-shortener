export interface AuthUser {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  provider?: "google" | "github" | "unknown";
}

export interface ShortenRequest {
  longUrl: string;
  expirationInDays?: number;
}

export interface ShortenResponse {
  hashValue: string;
}

export interface UrlRecord {
  id: string;
  longUrl: string;
  shortUrl: string;
  createdAt: string;
  expirationAt?: string;
  clickCount: number;
}

export interface UrlMetricsSummary {
  totalUrls: number;
  totalClicks: number;
  activeUrls: number;
  expiredUrls: number;
}
