import { getOauthStartUrl } from "../../lib/api";

interface AuthPanelProps {
  error?: string;
}

export default function AuthPanel({ error }: AuthPanelProps) {
  return (
    <div className="w-full rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      <h2 className="text-xl font-semibold text-gray-900">Sign in to track your links</h2>
      <p className="mt-2 text-sm text-gray-600">
        Login lets you save shortened URLs and view click metrics.
      </p>

      {error ? (
        <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      ) : null}

      <div className="mt-5 flex flex-col gap-3 sm:flex-row">
        <a
          href={getOauthStartUrl("github")}
          className="inline-flex items-center justify-center rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-800 hover:bg-gray-100"
        >
          Continue with GitHub
        </a>
      </div>
    </div>
  );
}
