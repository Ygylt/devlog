"use client";
import { useAuth } from "../context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import axios from "axios";

const API = process.env.NEXT_PUBLIC_API_URL;

interface Entry {
  _id: string;
  title: string;
  mood: string;
  tags: string[];
  wins: string[];
  blockers: string[];
  createdAt: string;
}

export default function Dashboard() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const [entries, setEntries] = useState<Entry[]>([]);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    if (!loading && !user) router.push("/");
  }, [user, loading, router]);

  useEffect(() => {
    if (user) {
      axios
        .get(`${API}/api/entries`, { withCredentials: true })
        .then((res) => setEntries(res.data))
        .catch(() => {})
        .finally(() => setFetching(false));
    }
  }, [user]);

  if (loading) return (
    <div className="min-h-screen bg-[#0d1117] flex items-center justify-center">
      <p className="text-gray-400">Loading...</p>
    </div>
  );

  if (!user) return null;

  return (
    <main className="min-h-screen bg-[#0d1117]">
      <nav className="border-b border-[#30363d] px-6 py-4 flex items-center justify-between">
        <h1 className="text-white font-bold text-xl">DevLog</h1>
        <div className="flex items-center gap-4">
          <Image src={user.avatar} alt={user.username} width={32} height={32} className="rounded-full" />
          <span className="text-gray-400 text-sm">{user.displayName}</span>
          <button onClick={logout} className="text-gray-400 hover:text-white text-sm transition-colors">Logout</button>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-6 py-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-white mb-1">Good to have you, {user.displayName}</h2>
            <p className="text-gray-400">What did you work on today?</p>
          </div>
          <button
            onClick={() => router.push("/entries/new")}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 px-6 rounded-lg transition-colors"
          >
            + New Entry
          </button>
        </div>

        {fetching ? (
          <p className="text-gray-500">Loading entries...</p>
        ) : entries.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-500 text-lg mb-2">No entries yet</p>
            <p className="text-gray-600 text-sm">Start logging your dev journey</p>
          </div>
        ) : (
          <div className="space-y-4">
            {entries.map((entry) => (
              <div
                key={entry._id}
                onClick={() => router.push(`/entries/${entry._id}`)}
                className="bg-[#161b22] border border-[#30363d] rounded-xl p-5 cursor-pointer hover:border-indigo-500 transition-colors"
              >
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-white font-semibold text-lg">{entry.title}</h3>
                  <div className="flex items-center gap-3">
                    {entry.mood && (
                      <span className="text-xs text-indigo-300 bg-indigo-500/20 px-2 py-1 rounded-md capitalize">
                        {entry.mood}
                      </span>
                    )}
                    <span className="text-gray-500 text-sm">
                      {new Date(entry.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                    </span>
                  </div>
                </div>
                {entry.tags.length > 0 && (
                  <div className="flex gap-2 flex-wrap mb-3">
                    {entry.tags.map((tag) => (
                      <span key={tag} className="bg-[#21262d] text-gray-300 text-xs px-2 py-1 rounded-md">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
                <div className="flex gap-4 text-sm text-gray-500">
                  {entry.wins.length > 0 && (
                    <span>{entry.wins.length} win{entry.wins.length > 1 ? "s" : ""}</span>
                  )}
                  {entry.blockers.length > 0 && (
                    <span>{entry.blockers.length} blocker{entry.blockers.length > 1 ? "s" : ""}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}