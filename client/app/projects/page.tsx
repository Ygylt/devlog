"use client";
import { useAuth } from "../context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";

const API = process.env.NEXT_PUBLIC_API_URL;

interface Project {
  _id: string;
  name: string;
  description: string;
  githubRepo: string;
  color: string;
  status: string;
  createdAt: string;
}

export default function ProjectsPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [fetching, setFetching] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [githubRepo, setGithubRepo] = useState("");
  const [color, setColor] = useState("#6366f1");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!loading && !user) router.push("/");
  }, [user, loading, router]);

  useEffect(() => {
    if (user) {
      axios
        .get(`${API}/api/projects`, { withCredentials: true })
        .then((res) => setProjects(res.data))
        .catch(() => {})
        .finally(() => setFetching(false));
    }
  }, [user]);

  const handleCreate = async () => {
    if (!name.trim()) return alert("Please add a project name");
    setSaving(true);
    try {
      const res = await axios.post(
        `${API}/api/projects`,
        { name, description, githubRepo, color },
        { withCredentials: true }
      );
      setProjects([res.data, ...projects]);
      setName("");
      setDescription("");
      setGithubRepo("");
      setColor("#6366f1");
      setShowForm(false);
    } catch {
      alert("Failed to create project");
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
        <div className="flex items-center gap-6">
          <h1
            onClick={() => router.push("/dashboard")}
            className="text-white font-bold text-xl cursor-pointer"
          >
            DevLog
          </h1>
          <span className="text-gray-400 text-sm">Projects</span>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-lg transition-colors text-sm"
        >
          + New Project
        </button>
      </nav>

      <div className="max-w-4xl mx-auto px-6 py-10">
        {showForm && (
          <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-6 mb-8 space-y-4">
            <h2 className="text-white font-semibold">New Project</h2>
            <input
              type="text"
              placeholder="Project name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-[#0d1117] border border-[#30363d] rounded-lg p-3 text-white placeholder-gray-600 outline-none focus:border-indigo-500 transition-colors text-sm"
            />
            <input
              type="text"
              placeholder="Description (optional)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-[#0d1117] border border-[#30363d] rounded-lg p-3 text-white placeholder-gray-600 outline-none focus:border-indigo-500 transition-colors text-sm"
            />
            <input
              type="text"
              placeholder="GitHub repo URL (optional)"
              value={githubRepo}
              onChange={(e) => setGithubRepo(e.target.value)}
              className="w-full bg-[#0d1117] border border-[#30363d] rounded-lg p-3 text-white placeholder-gray-600 outline-none focus:border-indigo-500 transition-colors text-sm"
            />
            <div className="flex items-center gap-3">
              <label className="text-gray-400 text-sm">Color</label>
              <input
                type="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="w-8 h-8 rounded cursor-pointer bg-transparent border-0"
              />
              <span className="text-gray-500 text-xs">{color}</span>
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleCreate}
                disabled={saving}
                className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-medium py-2 px-5 rounded-lg transition-colors text-sm"
              >
                {saving ? "Creating..." : "Create Project"}
              </button>
              <button
                onClick={() => setShowForm(false)}
                className="text-gray-400 hover:text-white text-sm transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {fetching ? (
          <p className="text-gray-500">Loading projects...</p>
        ) : projects.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-500 text-lg mb-2">No projects yet</p>
            <p className="text-gray-600 text-sm">Create a project to organize your entries</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            {projects.map((project) => (
              <div
                key={project._id}
                className="bg-[#161b22] border border-[#30363d] rounded-xl p-5 hover:border-gray-500 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: project.color }}
                  />
                  <h3 className="text-white font-semibold">{project.name}</h3>
                  <span className={`ml-auto text-xs px-2 py-1 rounded-md ${
                    project.status === "active"
                      ? "bg-green-500/20 text-green-400"
                      : project.status === "paused"
                      ? "bg-yellow-500/20 text-yellow-400"
                      : "bg-gray-500/20 text-gray-400"
                  }`}>
                    {project.status}
                  </span>
                </div>
                {project.description && (
                  <p className="text-gray-400 text-sm mb-3">{project.description}</p>
                )}
                {project.githubRepo && (
                  
                    href={project.githubRepo}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="text-indigo-400 hover:text-indigo-300 text-xs transition-colors"
                  >
                    View on GitHub
                  </a>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}