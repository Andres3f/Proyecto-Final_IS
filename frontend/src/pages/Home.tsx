import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchProfile } from "../services/auth";
import { useAuth } from "../hooks/useAuth";

function HomePage() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [profile, setProfile] = useState<{ email: string; full_name?: string } | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchProfile()
      .then((data) => setProfile(data))
      .catch(() => setError("No se pudo cargar el perfil."));
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 px-4 py-10">
      <div className="mx-auto max-w-3xl rounded-3xl border border-slate-800 bg-slate-900/95 p-8 shadow-2xl shadow-slate-950/50">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-4xl font-semibold text-white">Bienvenido</h1>
            <p className="mt-2 text-slate-400">Esta ruta está protegida por JWT y FastAPI.</p>
          </div>
          <button
            onClick={handleLogout}
            className="rounded-2xl bg-rose-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-rose-400"
          >
            Cerrar sesión
          </button>
        </div>

        <div className="mt-10 rounded-3xl bg-slate-950 p-6 shadow-inner shadow-slate-900/40">
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
        </div>
      </div>
    </div>
  );
}

export default HomePage;
