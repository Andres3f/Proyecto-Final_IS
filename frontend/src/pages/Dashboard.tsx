import { FormEvent, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchProfile } from "../services/auth";
import { createProject, fetchProjects, updateProject } from "../services/project";
import { useAuth } from "../hooks/useAuth";
import type { Project } from "../types/task";

function DashboardPage() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [profile, setProfile] = useState<{ email: string; full_name?: string } | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [editingProjectId, setEditingProjectId] = useState<number | null>(null);
  const [editName, setEditName] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [editingLoading, setEditingLoading] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        const user = await fetchProfile();
        setProfile(user);
        const projectList = await fetchProjects();
        setProjects(projectList);
      } catch (err) {
        setError("No se pudo cargar la información. Por favor inicia sesión de nuevo.");
      }
    };

    void loadData();
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!name.trim()) {
      setError("El nombre del proyecto es obligatorio.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const newProject = await createProject(name.trim(), description.trim() || undefined);
      setProjects((current) => [newProject, ...current]);
      setName("");
      setDescription("");
    } catch (err: any) {
      setError(err?.response?.data?.detail || "No se pudo crear el proyecto.");
    } finally {
      setLoading(false);
    }
  };

  const startEditingProject = (project: Project) => {
    setEditingProjectId(project.id);
    setEditName(project.name);
    setEditDescription(project.description || "");
    setError("");
  };

  const cancelEditingProject = () => {
    setEditingProjectId(null);
    setEditName("");
    setEditDescription("");
  };

  const handleEditSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!editingProjectId) return;
    if (!editName.trim()) {
      setError("El nombre del proyecto es obligatorio.");
      return;
    }

    setError("");
    setEditingLoading(true);

    try {
      const updatedProject = await updateProject(editingProjectId, {
        name: editName.trim(),
        description: editDescription.trim() || null,
      });
      setProjects((current) => current.map((project) => (project.id === updatedProject.id ? updatedProject : project)));
      cancelEditingProject();
    } catch (err: any) {
      setError(err?.response?.data?.detail || "No se pudo actualizar el proyecto.");
    } finally {
      setEditingLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 px-4 py-10">
      <div className="mx-auto max-w-5xl rounded-3xl border border-slate-800 bg-slate-900/95 p-8 shadow-2xl shadow-slate-950/50">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-4xl font-semibold text-white">Dashboard</h1>
            <p className="mt-2 text-slate-400">Crea y administra tus proyectos protegidos con JWT.</p>
          </div>
          <button
            onClick={handleLogout}
            className="rounded-2xl bg-rose-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-rose-400"
          >
            Cerrar sesión
          </button>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_1.8fr]">
          <div className="rounded-3xl bg-slate-950 p-6 shadow-inner shadow-slate-900/40">
            <h2 className="text-xl font-semibold text-white">Perfil</h2>
            {profile ? (
              <div className="mt-4 space-y-3 text-slate-300">
                <p>
                  <span className="font-medium text-white">Correo:</span> {profile.email}
                </p>
                <p>
                  <span className="font-medium text-white">Nombre:</span> {profile.full_name || "No definido"}
                </p>
              </div>
            ) : (
              <p className="mt-4 text-slate-400">Cargando perfil...</p>
            )}

            <div className="mt-8 rounded-3xl bg-slate-900 p-5">
              <h3 className="text-lg font-semibold text-white">Nuevo proyecto</h3>
              <form className="mt-4 space-y-4" onSubmit={handleSubmit}>
                <label className="block">
                  <span className="text-slate-300">Nombre del proyecto</span>
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20"
                    placeholder="Ej. Aplicación de tareas"
                  />
                </label>
                <label className="block">
                  <span className="text-slate-300">Descripción</span>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20"
                    placeholder="Descripción opcional"
                    rows={3}
                  />
                </label>
                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex items-center justify-center rounded-2xl bg-cyan-500 px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? "Creando proyecto..." : "Crear proyecto"}
                </button>
              </form>
            </div>
          </div>

          <div className="rounded-3xl bg-slate-950 p-6 shadow-inner shadow-slate-900/40">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-white">Proyectos</h2>
                <p className="mt-2 text-slate-400">Lista de proyectos creados por ti.</p>
              </div>
            </div>

            {error && <p className="mt-4 text-rose-400">{error}</p>}

            {projects.length === 0 ? (
              <p className="mt-6 text-slate-400">No hay proyectos aún. Crea uno para comenzar.</p>
            ) : (
              <div className="mt-6 space-y-4">
                {projects.map((project) => (
                  <div key={project.id} className="rounded-3xl border border-slate-800 bg-slate-900 p-5">
                    {editingProjectId === project.id ? (
                      <form className="space-y-4" onSubmit={handleEditSubmit}>
                        <label className="block">
                          <span className="text-slate-300">Nombre del proyecto</span>
                          <input
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                            required
                            className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20"
                          />
                        </label>
                        <label className="block">
                          <span className="text-slate-300">Descripción</span>
                          <textarea
                            value={editDescription}
                            onChange={(e) => setEditDescription(e.target.value)}
                            className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20"
                            rows={3}
                          />
                        </label>
                        <div className="flex flex-wrap gap-3">
                          <button
                            type="submit"
                            disabled={editingLoading}
                            className="rounded-2xl bg-cyan-500 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-60"
                          >
                            {editingLoading ? "Guardando..." : "Guardar cambios"}
                          </button>
                          <button
                            type="button"
                            onClick={cancelEditingProject}
                            disabled={editingLoading}
                            className="rounded-2xl border border-slate-700 px-4 py-2 text-sm font-semibold text-slate-200 transition hover:border-slate-500 disabled:cursor-not-allowed disabled:opacity-60"
                          >
                            Cancelar
                          </button>
                        </div>
                      </form>
                    ) : (
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                          <h3 className="text-lg font-semibold text-white">{project.name}</h3>
                          <p className="mt-2 text-slate-400">{project.description || "Sin descripción"}</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => startEditingProject(project)}
                          className="rounded-2xl border border-cyan-500/50 px-4 py-2 text-sm font-semibold text-cyan-200 transition hover:border-cyan-400 hover:bg-cyan-500/10"
                        >
                          Editar
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;
