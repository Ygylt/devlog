"use client";
import { useAuth } from "../../context/AuthContext";
import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";

const API = process.env.NEXT_PUBLIC_API_URL;

interface Entry {
  _id: string;
  title: string;
  content: string;
  mood: string;
  tags: string[];
  wins: string[];
  blockers: string[];
  createdAt: string;
}

export default function EntryPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const params = useParams();
  const [entry, setEntry] = useState<Entry | null>(null);
  const [fetching, setFetching] = useState(true);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (!loading && !user) router.push("/");
  }, [user, loading, router]);

  useEffect(() => {
    if (user && params.id) {
      axios
        .get(`${API}/api/entries/${params.id}`, { withCredentials: true })
        .then((res) => setEntry(res.data))
        .catch(() => router.push("/dashboard"))
        .finally(() => setFetching(false));
    }
  }, [user, params.id]);

  const handleDelete = async () => {
    if (!confirm("Delete this entry?")) return;
    setDeleting(true);
    try {
      await axios.delete(`${API}/api/entries/${params.id}`, { withCredentials: true });
      router.push("/dashboard");
    } catch {
      alert("Failed to delete");
      setDeleting(false);
    }
  };

  if (loading || fetching) return (
    <div className="min-h-screen bg-[#0d1117] flex items-center justify-center">
      <p className="text-gray-400">Loading...</p>
    </div>
  );

  if (!entry) return null;

  return (
    <main className="min-h-screen bg-[#0d1117]">
      <nav className="border-b border-[#30363d] px-6 py-4 flex items-center justify-between">
        <button onClick={() => router.push("/dashboard")} className="text-gray-400 hover:text-white transition-colors text-sm">
          Back to dashboard
        </button>
        <button
          onClick={handleDelete}
          disabled={deleting}
          className="text-red-400 hover:text-red-300 disabled:opacity-50 text-sm transition-colors"
        >
          {deleting ? "Deleting..." : "Delete entry"}
        </button>
      </nav>

      <div className="max-w-3xl mx-auto px-6 py-10 space-y-8">
        <div>
          <div className="flex items-center gap-3 mb-3">
            {entry.mood && (
              <span className="text-xs text-indigo-300 bg-indigo-500/20 px-2 py-1 rounded-md capitalize">
                {entry.mood}
              </span>
            )}
            <span className="text-gray-500 text-sm">
              {new Date(entry.createdAt).toLocaleDateString("en-US", {
                weekday: "long", year: "numeric", month: "long", day: "numeric"
              })}
            </span>
          </div>
          <h1 className="text-4xl font-bold text-white">{entry.title}</h1>
        </div>

        {entry.tags.length > 0 && (
          <div className="flex gap-2 flex-wrap">
            {entry.tags.map((tag) => (
              <span key={tag} className="bg-[#21262d] text-gray-300 text-xs px-2 py-1 rounded-md">
                {tag}
              </span>
            ))}
          </div>
        )}

        {entry.content && (
          <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-6">
            <p className="text-gray-300 leading-relaxed whitespace-pre-wrap text-sm">{entry.content}</p>
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          {entry.wins.length > 0 && (
            <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-5">
              <h3 className="text-green-400 font-medium text-sm mb-3">Wins</h3>
              <ul className="space-y-2">
                {entry.wins.map((win, i) => (
                  <li key={i} className="text-gray-300 text-sm">— {win}</li>
                ))}
              </ul>
            </div>
          )}
          {entry.blockers.length > 0 && (
            <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-5">
              <h3 className="text-red-400 font-medium text-sm mb-3">Blockers</h3>
              <ul className="space-y-2">
                {entry.blockers.map((blocker, i) => (
                  <li key={i} className="text-gray-300 text-sm">— {blocker}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}