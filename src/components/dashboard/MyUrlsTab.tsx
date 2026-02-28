import { useEffect, useState } from "react";
import { getMyUrls } from "../../lib/api";
import type { UrlRecord } from "../../types/api";

interface MyUrlsTabProps {
  token?: string | null;
}

export default function MyUrlsTab({ token }: MyUrlsTabProps) {
  const [items, setItems] = useState<UrlRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      setLoading(true);
      setError("");

      try {
        const data = await getMyUrls(token ?? undefined);
        if (mounted) {
          const normalized = (data as unknown[]).map((item) => mapUrlRecord(item as Record<string, unknown>));
          setItems(normalized);
        }
      } catch (err) {
        if (mounted) {
          setError(err instanceof Error ? err.message : "Unable to load URLs");
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    void load();

    return () => {
      mounted = false;
    };
  }, [token]);

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-gray-900">My shortened URLs</h3>

      {loading ? <p className="mt-4 text-sm text-gray-600">Loading your URLs...</p> : null}

      {error ? (
        <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div>
      ) : null}

      {!loading && !error && items.length === 0 ? (
        <p className="mt-4 text-sm text-gray-600">No URLs yet. Create one from the Shorten tab.</p>
      ) : null}

      {!loading && !error && items.length > 0 ? (
        <div className="mt-4 overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-gray-200 text-gray-500">
              <tr>
                <th className="px-2 py-2 font-medium">Short URL</th>
                <th className="px-2 py-2 font-medium">Clicks</th>
                <th className="px-2 py-2 font-medium">Created</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id} className="border-b border-gray-100 text-gray-800">
                  <td className="px-2 py-2">
                    <a href={item.shortUrl} target="_blank" rel="noreferrer" className="text-blue-700 underline">
                      {item.shortUrl}
                    </a>
                  </td>
                  <td className="px-2 py-2">{item.clickCount}</td>
                  <td className="px-2 py-2">{new Date(item.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}
    </div>
  );
}

function mapUrlRecord(item: Record<string, unknown>): UrlRecord {
  const shortUrl = (item.shortUrl as string) ?? (item.hashValue as string) ?? "";
  const longUrl = (item.longUrl as string) ?? (item.resolvedUrl as string) ?? "";
  const createdAt = (item.createdAt as string) ?? (item.createdDate as string) ?? "";
  const expirationAt = (item.expirationAt as string) ?? (item.expirationDate as string) ?? undefined;
  const clickCount = Number(item.clickCount ?? 0);
  const id = (item.id as string) ?? shortUrl ?? createdAt;

  return {
    id,
    shortUrl,
    longUrl,
    createdAt,
    expirationAt,
    clickCount,
  };
}
