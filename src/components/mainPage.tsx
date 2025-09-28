import { useState } from "react";
import urlPng from "../assets/url.png";
import ActionButtons from "./ActionButtons";

export default function UrlShortener() {
  const [longUrl, setLongUrl] = useState("");
  const [expiration, setExpiration] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    setLoading(true);
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:8080/shorten", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          longUrl: longUrl,
          expirationInDays: expiration,
        }),
      });
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      setShortUrl(data.hashValue);
      setError("");
      setLoading(false);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Something went wrong");
      }
    }
  };

  return (
    <>
      <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-lg">
        <div className="flex items-center justify-left gap-2 mb-4">
          <img src={urlPng} alt="TinyURL Logo" className="h-8" />
          <h1 className="text-2xl font-bold text-gray-900">Short it Out!</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            value={longUrl}
            onChange={(e) => setLongUrl(e.target.value)}
            placeholder="Enter long link here"
            className="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 placeholder-gray-500 focus:border-black focus:ring-2 focus:ring-black"
          />
          <select
            className="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 placeholder-gray-500 focus:border-black focus:ring-2 focus:ring-black"
            value={expiration}
            onChange={(e) => setExpiration(e.target.value)}
          >
            <option value="" disabled selected>
              Select Link Expiration Duration
            </option>
            <option value="7">Seven Days</option>
            <option value="14">Fourteen Days</option>
            <option value="30">Thirty Days</option>
          </select>
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-black py-2 text-white font-medium hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-black transition disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent mr-2"></div>
                Generating Link...
              </div>
            ) : (
              "Shorten URL"
            )}
          </button>
        </form>

        {error && (
          <div className="mt-4 rounded-lg border border-red-300 bg-red-50 p-4 text-left text-red-600">
            ❌ {error}
          </div>
        )}

        {/* Success Message */}
        {shortUrl && (
          <>
            <div className="mt-6 rounded-lg border border-green-300 bg-green-50 p-4 text-left">
              <p className="text-green-700 font-semibold">✅ Success!</p>
              <p className="mt-2">
                <a
                  href={shortUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline hover:text-blue-800"
                >
                  {shortUrl}
                </a>
              </p>
              <ActionButtons shortUrl={shortUrl} />
            </div>
          </>
        )}
      </div>
      {/* </div> */}
    </>
  );
}
