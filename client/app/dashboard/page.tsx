"use client";
import { useAuth } from "../context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Image from "next/image";

export default function Dashboard() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) router.push("/");
  }, [user, loading, router]);

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
          <Image
            src={user.avatar}
            alt={user.username}
            width={32}
            height={32}
            className="rounded-full"
          />
          <span className="text-gray-400 text-sm">{user.displayName}</span>
          <button
            onClick={logout}
            className="text-gray-400 hover:text-white text-sm transition-colors"
          >
            Logout
          </button>
        </div>
      </nav>
      <div className="max-w-4xl mx-auto px-6 py-12">
        <h2 className="text-3xl font-bold text-white mb-2">
          Good to have you, {user.displayName} 👋
        </h2>
        <p className="text-gray-400 mb-8">What did you work on today?</p>
        <button
          onClick={() => router.push("/entries/new")}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 px-6 rounded-lg transition-colors"
        >
          + New Entry
        </button>
      </div>
    </main>
  );
}