import { useState } from "react";
import urlPng from "../assets/url.png";

export default function UrlShortener() {
  const [success, setSuccess] = useState(false);
  const [longUrl, setLongUrl] = useState("");
  const [expiration, setExpiration] = useState("");
  const [shortUrl, setShortUrl] = useState("");


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
        const response = await fetch('http://localhost:8080/shorten', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ 'longUrl': longUrl, 'expirationInDays': expiration })
        });
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setShortUrl(data.hashValue)
        setSuccess(true);
    } catch (error) {
      console.error("Error shortening URL:", error);
    }
  };

  return (
    <>
    {/* <div className="min-h-screen flex items-center justify-center bg-black"> */}
      
      {/* White card container */}
      <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-lg">
        <div className="flex items-center justify-left gap-2 mb-4">
  <img
    src={urlPng}
    alt="TinyURL Logo"
    className="h-8"
  />
  <h1 className="text-2xl font-bold text-gray-900">
    Short it Out!
  </h1>
</div>
        {/* <h1 className="mb-4 text-center text-2xl font-bold text-gray-900">
          Shorten a URL
        </h1> */}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            value={longUrl}
            onChange={(e) => setLongUrl(e.target.value)}
            placeholder="Enter long link here"
            className="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 placeholder-gray-500 focus:border-black focus:ring-2 focus:ring-black"
          />
          <select className="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 placeholder-gray-500 focus:border-black focus:ring-2 focus:ring-black"
          value={expiration}
          onChange={(e) => setExpiration(e.target.value)}>
            <option value="" disabled selected>
              Select Link Expiration Duration
            </option>
            <option value="7">Seven Days</option>
            <option value="14">Fourteen Days</option>
            <option value="30">Thirty Days</option>
          </select>
          <button
            type="submit"
            className="w-full rounded-lg bg-black py-2 text-white font-medium hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-black transition"
          >
            Shorten URL
          </button>
        </form>

        {/* Success Message */}
        {success && (
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
          </div>
        )}
      </div>
    {/* </div> */}
    </>
  );
}