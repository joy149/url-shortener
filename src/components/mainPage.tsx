import { useEffect, useMemo, useState } from "react";
import urlPng from "../assets/url.png";
import { useAuth } from "../hooks/useAuth";
import AuthPanel from "./dashboard/AuthPanel";
import MetricsTab from "./dashboard/MetricsTab";
import MyUrlsTab from "./dashboard/MyUrlsTab";
import ShortenTab from "./dashboard/ShortenTab";

type DashboardTab = "shorten" | "my-urls" | "metrics";

const TABS: Array<{ key: DashboardTab; label: string; private: boolean }> = [
  { key: "shorten", label: "Shorten", private: false },
  { key: "my-urls", label: "My URLs", private: true },
  { key: "metrics", label: "Analytics", private: true },
];

export default function MainPage() {
  const auth = useAuth();
  const [activeTab, setActiveTab] = useState<DashboardTab>("shorten");

  useEffect(() => {
    if (!auth.isAuthenticated) {
      return;
    }

    const url = new URL(window.location.href);
    const postLogin = url.searchParams.get("postLogin");

    if (postLogin !== "1") {
      return;
    }

    setActiveTab("my-urls");
    url.searchParams.delete("postLogin");
    window.history.replaceState({}, document.title, url.toString());
  }, [auth.isAuthenticated]);

  const availableTabs = useMemo(
    () => TABS.filter((tab) => (tab.private ? auth.isAuthenticated : true)),
    [auth.isAuthenticated],
  );

  const isTabAccessible = availableTabs.some((tab) => tab.key === activeTab);

  if (auth.loading) {
    return (
      <div className="w-full max-w-4xl rounded-2xl border border-gray-200 bg-white p-8 text-center text-gray-700 shadow-sm">
        Loading session...
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl space-y-4">
      <header className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <img src={urlPng} alt="URL Shortener logo" className="h-10 w-10" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Short it Out</h1>
              <p className="text-sm text-gray-600">Create, manage, and analyze your links</p>
            </div>
          </div>

          {auth.isAuthenticated && auth.user ? (
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{auth.user.name}</p>
                <p className="text-xs text-gray-500">{auth.user.email}</p>
              </div>
              <button
                onClick={() => void auth.logout()}
                className="rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-800 hover:bg-gray-100"
              >
                Logout
              </button>
            </div>
          ) : null}
        </div>
      </header>

      {!auth.isAuthenticated ? <AuthPanel error={auth.error} /> : null}

      <div className="rounded-2xl border border-gray-200 bg-white p-2 shadow-sm">
        <nav className="flex flex-wrap gap-2">
          {availableTabs.map((tab) => {
            const selected = tab.key === activeTab;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`rounded-lg px-3 py-2 text-sm font-medium ${
                  selected ? "bg-black text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>

      {!isTabAccessible ? (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
          Please sign in to access this section.
        </div>
      ) : null}

      {activeTab === "shorten" ? <ShortenTab token={auth.token} /> : null}
      {activeTab === "my-urls" ? <MyUrlsTab token={auth.token} /> : null}
      {activeTab === "metrics" ? <MetricsTab token={auth.token} /> : null}
    </div>
  );
}
