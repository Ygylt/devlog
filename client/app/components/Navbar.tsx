"use client";
import { useAuth } from "../context/AuthContext";
import { useRouter, usePathname } from "next/navigation";
import Image from "next/image";

export default function Navbar() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  if (!user) return null;

  return (
    <nav className="border-b border-[#30363d] px-6 py-4 flex items-center justify-between">
      <div className="flex items-center gap-8">
        <h1
          onClick={() => router.push("/dashboard")}
          className="text-white font-bold text-xl cursor-pointer"
        >
          DevLog
        </h1>
        <div className="flex items-center gap-1">
          <button
            onClick={() => router.push("/dashboard")}
            className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
              pathname === "/dashboard"
                ? "bg-[#21262d] text-white"
                : "text-gray-400 hover:text-white"
            }`}
          >
            Dashboard
          </button>
          <button
            onClick={() => router.push("/projects")}
            className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
              pathname === "/projects"
                ? "bg-[#21262d] text-white"
                : "text-gray-400 hover:text-white"
            }`}
          >
            Projects
          </button>
        </div>
      </div>
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
  );
}