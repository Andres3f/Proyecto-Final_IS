import { FormEvent, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchProfile } from "../services/auth";
import { useAuth } from "../hooks/useAuth";
import {
  createProject,
  createProjectTask,
  fetchProjectTasks,
  fetchProjects,
  updateTaskStatus,
} from "../services/project";
import type { Project, Task, TaskCreate, TaskStatus } from "../types/task";

const statusLabels: Record<TaskStatus, string> = {
  pending: "Pendiente",
  in_progress: "En progreso",
  completed: "Completada",
};

const nextStatus: Record<TaskStatus, TaskStatus | null> = {
  pending: "in_progress",
  in_progress: "completed",
  completed: null,
};

function HomePage() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [profile, setProfile] = useState<{ email: string; full_name?: string } | null>(null);
  const [error, setError] = useState("");
  const [project, setProject] = useState<Project | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [working, setWorking] = useState(false);

  useEffect(() => {
    fetchProfile()
      .then((data) => setProfile(data))
      .catch(() => setError("No se pudo cargar el perfil."));

    const loadProject = async () => {
      try {
        const projects = await fetchProjects();
        let currentProject = projects[0];
        if (!currentProject) {
          currentProject = await createProject("Proyecto principal", "Proyecto principal para tus tareas.");
        }
        setProject(currentProject);
        const projectTasks = await fetchProjectTasks(currentProject.id);
        setTasks(projectTasks);
      } catch (err) {
        setError("No se pudo cargar el proyecto o las tareas.");
      }
    };

    void loadProject();
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleCreateTask = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!project || !title.trim()) {
      return;
    }
    setWorking(true);
    try {
      const taskIn: TaskCreate = { title: title.trim(), description: description.trim() || undefined };
      const newTask = await createProjectTask(project.id, taskIn);
      setTasks((current) => [newTask, ...current]);
      setTitle("");
      setDescription("");
    } catch (err) {
      setError("No se pudo crear la tarea.");
    } finally {
      setWorking(false);
    }
  };

  const handleChangeStatus = async (task: Task) => {
    const next = nextStatus[task.status];
    if (!next) return;
    try {
      const updated = await updateTaskStatus(task.id, { status: next });
      setTasks((current) => current.map((item) => (item.id === updated.id ? updated : item)));
    } catch (err) {
      setError("No se pudo actualizar el estado de la tarea.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 px-4 py-10">
      <div className="mx-auto max-w-5xl rounded-3xl border border-slate-800 bg-slate-900/95 p-8 shadow-2xl shadow-slate-950/50">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-4xl font-semibold text-white">Panel de tareas</h1>
            <p className="mt-2 text-slate-400">Crea, lista y actualiza el estado de las tareas de tu proyecto.</p>
          </div>
          <button
            onClick={handleLogout}
            className="rounded-2xl bg-rose-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-rose-400"
          >
            Cerrar sesión
          </button>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_1.4fr]">
          <div className="rounded-3xl bg-slate-950 p-6 shadow-inner shadow-slate-900/40">
            <h2 className="text-xl font-semibold text-white">Perfil</h2>
            {error && <p className="mt-3 text-rose-400">{error}</p>}
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
              <p className="mt-4 text-slate-400">Cargando información...</p>
            )}

            <div className="mt-8 rounded-3xl bg-slate-900 p-5">
              <h3 className="text-lg font-semibold text-white">Proyecto</h3>
              {project ? (
                <div className="mt-4 space-y-2 text-slate-300">
                  <p>
                    <span className="font-medium text-white">Nombre:</span> {project.name}
                  </p>
                  <p>
                    <span className="font-medium text-white">Descripción:</span> {project.description || "Sin descripción"}
                  </p>
                </div>
              ) : (
                <p className="mt-4 text-slate-400">Cargando proyecto...</p>
              )}
            </div>
          </div>

          <div className="rounded-3xl bg-slate-950 p-6 shadow-inner shadow-slate-900/40">
            <h2 className="text-xl font-semibold text-white">Tareas</h2>
            <form className="mt-5 space-y-4" onSubmit={handleCreateTask}>
              <label className="block">
                <span className="text-slate-300">Título de la tarea</span>
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20"
                  placeholder="Ej. Revisar documentación"
                />
              </label>
              <label className="block">
                <span className="text-slate-300">Descripción</span>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20"
                  placeholder="Opcional: detalles de la tarea"
                  rows={3}
                />
              </label>
              <button
                type="submit"
                disabled={working}
                className="inline-flex items-center justify-center rounded-2xl bg-cyan-500 px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {working ? "Creando tarea..." : "Crear tarea"}
              </button>
            </form>
          </div>
        </div>

        <div className="mt-8 rounded-3xl bg-slate-950 p-6 shadow-inner shadow-slate-900/40">
          <h2 className="text-xl font-semibold text-white">Lista de tareas</h2>
          {tasks.length === 0 ? (
            <p className="mt-4 text-slate-400">No hay tareas registradas aún.</p>
          ) : (
            <div className="mt-6 space-y-4">
              {tasks.map((task) => (
                <div key={task.id} className="rounded-3xl border border-slate-800 bg-slate-900 p-5">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-white">{task.title}</h3>
                      <p className="mt-2 text-slate-400">{task.description || "Sin descripción"}</p>
                    </div>
                    <div className="flex flex-col items-start gap-2 sm:items-end">
                      <span className="rounded-full bg-slate-800 px-3 py-1 text-sm font-semibold text-cyan-300">
                        {statusLabels[task.status]}
                      </span>
                      {nextStatus[task.status] ? (
                        <button
                          onClick={() => handleChangeStatus(task)}
                          className="rounded-full bg-emerald-500 px-4 py-2 text-xs font-semibold text-slate-950 transition hover:bg-emerald-400"
                        >
                          {task.status === "pending" ? "Marcar como En progreso" : "Marcar como Completada"}
                        </button>
                      ) : (
                        <span className="text-xs text-slate-500">Finalizada</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default HomePage;
