"use client";
import { useAuth } from "../../context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";

const API = process.env.NEXT_PUBLIC_API_URL;

const MOODS = [
    { value: "great", label: "Great" },
    { value: "good", label: "Good" },
    { value: "neutral", label: "Neutral" },
    { value: "bad", label: "Bad" },
    { value: "terrible", label: "Terrible" },
]

export default function NewEntry() {
    const { user, loading } = useAuth();
    const router = useRouter();
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [mood, setMood] = useState("neutral");
    const [tags, setTags] = useState("");
    const [wins, setWins] = useState("");
    const [blockers, setBlockers] = useState("");
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (!loading && !user) router.push("/");
    }, [user, loading, router]);

    const handleSave = async () => {
        if (!title.trim()) return alert("Title is required");
        setSaving(true);
        try {
            await axios.post(
                `${API}/api/entries`,
                {
                    title,
                    content,
                    mood,
                    tags: tags.split(",").map((t) => t.trim()).filter(Boolean),
                    wins: wins.split(",").map((w) => w.trim()).filter(Boolean),
                    blockers: blockers.split(",").map((b) => b.trim()).filter(Boolean),
                },
                { withCredentials: true }
            );
            router.push("/dashboard");
        } catch (err) {
            alert("Failed to save entry");
        } finally {
            setSaving(false);
        }
    };

    if (loading) return (
    <div className="min-h-screen bg-[#0d1117] flex items-center justify-center">
      <p className="text-gray-400">Loading...</p>
    </div>
  );

  return (
    <main className="min-h-screen bg-[#0d1117]">
      <nav className="border-b border-[#30363d] px-6 py-4 flex items-center justify-between">
        <button onClick={() => router.push("/dashboard")} className="text-gray-400 hover:text-white transition-colors">
          ← Back
        </button>
        <h1 className="text-white font-bold text-xl">New Entry</h1>
        <button
          onClick={handleSave}
          disabled={saving}
          className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-medium py-2 px-5 rounded-lg transition-colors"
        >
          {saving ? "Saving..." : "Save Entry"}
        </button>
      </nav>

      <div className="max-w-3xl mx-auto px-6 py-8 space-y-6">
        <input
          type="text"
          placeholder="What did you work on today?"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full bg-transparent text-white text-3xl font-bold placeholder-gray-600 outline-none border-none"
        />

        <div>
          <p className="text-gray-400 text-sm mb-3">How are you feeling?</p>
          <div className="flex gap-3">
            {MOODS.map((m) => (
              <button
                key={m.value}
                onClick={() => setMood(m.value)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors text-sm ${
                  mood === m.value
                    ? "border-indigo-500 bg-indigo-500/20 text-white"
                    : "border-[#30363d] text-gray-400 hover:border-gray-500"
                }`}
              >
                {m.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="text-gray-400 text-sm mb-2">Journal</p>
          <textarea
            placeholder="Write about what you built, learned, or struggled with today..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={10}
            className="w-full bg-[#161b22] border border-[#30363d] rounded-lg p-4 text-white placeholder-gray-600 outline-none focus:border-indigo-500 transition-colors resize-none text-sm leading-relaxed"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-gray-400 text-sm mb-2">🏆 Wins (one per line)</p>
            <textarea
              placeholder="Shipped the auth flow&#10;Fixed that CSS bug"
              value={wins}
              onChange={(e) => setWins(e.target.value)}
              rows={4}
              className="w-full bg-[#161b22] border border-[#30363d] rounded-lg p-3 text-white placeholder-gray-600 outline-none focus:border-indigo-500 transition-colors resize-none text-sm"
            />
          </div>
          <div>
            <p className="text-gray-400 text-sm mb-2">🧱 Blockers (one per line)</p>
            <textarea
              placeholder="MongoDB connection issue&#10;Passport config confusion"
              value={blockers}
              onChange={(e) => setBlockers(e.target.value)}
              rows={4}
              className="w-full bg-[#161b22] border border-[#30363d] rounded-lg p-3 text-white placeholder-gray-600 outline-none focus:border-indigo-500 transition-colors resize-none text-sm"
            />
          </div>
        </div>

        <div>
          <p className="text-gray-400 text-sm mb-2">Tags (comma separated)</p>
          <input
            type="text"
            placeholder="react, auth, mongodb"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            className="w-full bg-[#161b22] border border-[#30363d] rounded-lg p-3 text-white placeholder-gray-600 outline-none focus:border-indigo-500 transition-colors text-sm"
          />
        </div>
      </div>
    </main>
  );
}