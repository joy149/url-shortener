import { useEffect, useState } from "react";
import { getMyMetrics } from "../../lib/api";
import type { UrlMetricsSummary } from "../../types/api";

interface MetricsTabProps {
  token?: string | null;
}

export default function MetricsTab({ token }: MetricsTabProps) {
  const [metrics, setMetrics] = useState<UrlMetricsSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      setLoading(true);
      setError("");

      try {
        const data = await getMyMetrics(token ?? undefined);
        if (mounted) {
          setMetrics(data);
        }
      } catch (err) {
        if (mounted) {
          setError(err instanceof Error ? err.message : "Unable to load metrics");
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
      <h3 className="text-lg font-semibold text-gray-900">Usage metrics</h3>

      {loading ? <p className="mt-4 text-sm text-gray-600">Loading metrics...</p> : null}

      {error ? (
        <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div>
      ) : null}

      {!loading && !error && metrics ? (
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <MetricCard label="Total URLs" value={metrics.totalUrls} />
          <MetricCard label="Total Clicks" value={metrics.totalClicks} />
          <MetricCard label="Active URLs" value={metrics.activeUrls} />
          <MetricCard label="Expired URLs" value={metrics.expiredUrls} />
        </div>
      ) : null}
    </div>
  );
}

function MetricCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
      <p className="text-xs uppercase tracking-wide text-gray-500">{label}</p>
      <p className="mt-2 text-2xl font-semibold text-gray-900">{value}</p>
    </div>
  );
}
