"use client";
import { useAuth } from "./context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const API = process.env.NEXT_PUBLIC_API_URL;

export default function Home() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) router.push("/dashboard");
  }, [user, loading, router]);

  return (
    <main className="min-h-screen bg-[#0d1117] flex items-center justify-center">
      <div className="text-center">
        <div className="mb-8">
          <h1 className="text-5xl font-bold text-white mb-3">DevLog</h1>
          <p className="text-gray-400 text-lg">Your smart developer journal</p>
        </div>
        <div className="bg-[#161b22] border border-[#30363d] rounded-2xl p-10 w-80">
          <p className="text-gray-400 text-sm mb-6">
            Track your daily progress, connect your GitHub, and never lose a great idea again.
          </p>
          <a href={API + "/auth/github"} className="flex items-center justify-center gap-3 bg-white text-black font-medium py-3 px-6 rounded-lg hover:bg-gray-100 transition-colors w-full">
            Continue with GitHub
          </a>
        </div>
      </div>
    </main>
  );
}
