import { FormEvent, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError("");
    try {
      await login(email, password);
      navigate("/");
    } catch (err) {
      setError("Correo o contraseña inválidos.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md bg-slate-900/90 border border-slate-700 rounded-3xl p-8 shadow-xl shadow-slate-900/20">
        <h1 className="text-3xl font-semibold text-white mb-6">Iniciar sesión</h1>
        <p className="text-slate-400 mb-6">Accede a tu panel con tu correo y contraseña.</p>
        <form className="space-y-5" onSubmit={handleSubmit}>
          <label className="block">
            <span className="text-slate-300">Correo electrónico</span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20"
            />
          </label>

          <label className="block">
            <span className="text-slate-300">Contraseña</span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20"
            />
          </label>

          {error && <p className="text-sm text-rose-400">{error}</p>}

          <button
            type="submit"
            className="w-full rounded-2xl bg-cyan-500 px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400"
          >
            Entrar
          </button>
        </form>

        <p className="mt-6 text-center text-slate-400">
          ¿No tienes cuenta? <Link to="/register" className="text-cyan-400 hover:text-cyan-300">Regístrate</Link>
        </p>
      </div>
    </div>
  );
}

export default LoginPage;
