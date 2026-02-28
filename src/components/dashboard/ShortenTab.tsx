import { useState } from "react";
import { shortenUrl } from "../../lib/api";
import ActionButtons from "../ActionButtons";

interface ShortenTabProps {
  token?: string | null;
}

export default function ShortenTab({ token }: ShortenTabProps) {
  const [longUrl, setLongUrl] = useState("");
  const [expiration, setExpiration] = useState("7");
  const [shortUrl, setShortUrl] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setShortUrl("");

    try {
      const data = await shortenUrl(
        {
          longUrl,
          expirationInDays: Number(expiration),
        },
        token ?? undefined,
      );
      setShortUrl(data.hashValue);
      setLongUrl("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to shorten URL");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-gray-900">Create short URL</h3>
      <form onSubmit={handleSubmit} className="mt-4 space-y-3">
        <input
          required
          type="url"
          value={longUrl}
          onChange={(event) => setLongUrl(event.target.value)}
          placeholder="https://example.com/very-long-link"
          className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-900 focus:border-black focus:outline-none"
        />

        <select
          value={expiration}
          onChange={(event) => setExpiration(event.target.value)}
          className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-900 focus:border-black focus:outline-none"
        >
          <option value="7">Expires in 7 days</option>
          <option value="14">Expires in 14 days</option>
          <option value="30">Expires in 30 days</option>
        </select>

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {loading ? "Generating..." : "Shorten URL"}
        </button>
      </form>

      {error ? (
        <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div>
      ) : null}

      {shortUrl ? (
        <div className="mt-4 rounded-lg border border-green-200 bg-green-50 p-4 text-left">
          <p className="text-sm font-semibold text-green-800">Short URL created</p>
          <a
            href={shortUrl}
            target="_blank"
            rel="noreferrer"
            className="mt-1 block break-all text-sm text-blue-700 underline"
          >
            {shortUrl}
          </a>
          <ActionButtons shortUrl={shortUrl} />
        </div>
      ) : null}
    </div>
  );
}
