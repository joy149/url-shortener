import React from "react";

interface ActionButtonsProps {
  shortUrl: string;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({ shortUrl }) => {
  const handleCopy = () => {
    navigator.clipboard.writeText(shortUrl);
    alert("Copied to clipboard");
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: "Check out my short link",
          url: shortUrl,
        })
        .catch((err) => console.error("Share failed:", err));
      return;
    }

    alert("Sharing is not supported in this browser.");
  };

  const handleVisit = (url: string) => {
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="mt-4 flex flex-wrap items-center gap-2">
      <button
        onClick={handleCopy}
        className="inline-flex items-center justify-center gap-1 rounded-md border border-gray-300 bg-white px-3 py-1 text-sm text-gray-700 hover:bg-gray-50"
      >
        <span>Copy</span>
      </button>

      <button
        onClick={() => handleVisit(shortUrl)}
        className="inline-flex items-center justify-center gap-1 rounded-md border border-gray-300 bg-white px-3 py-1 text-sm text-gray-700 hover:bg-gray-50"
      >
        <span>Visit</span>
      </button>

      <button
        onClick={handleShare}
        className="inline-flex items-center justify-center gap-1 rounded-md border border-gray-300 bg-white px-3 py-1 text-sm text-gray-700 hover:bg-gray-50"
      >
        <span>Share</span>
      </button>
    </div>
  );
};

export default ActionButtons;
