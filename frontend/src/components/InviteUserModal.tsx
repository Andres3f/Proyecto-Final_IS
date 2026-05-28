import { useState } from "react";

interface InviteUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInvite: (email: string) => Promise<void>;
}

export function InviteUserModal({ isOpen, onClose, onInvite }: InviteUserModalProps) {
  const [email, setEmail] = useState("");
  const [isInviting, setIsInviting] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleInvite = async () => {
    setError("");
    if (!email.trim()) {
      setError("Por favor ingresa un correo");
      return;
    }
    
    setIsInviting(true);
    try {
      await onInvite(email);
      setEmail("");
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.detail || "Error al enviar invitación");
    } finally {
      setIsInviting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-lg rounded-3xl border border-slate-800 bg-slate-900 p-8">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-white">Invitar usuario al proyecto</h2>
          <button
            onClick={onClose}
            disabled={isInviting}
            className="text-3xl leading-none text-slate-400 hover:text-slate-200 disabled:opacity-50"
          >
            ×
          </button>
        </div>

        <div className="mt-6 space-y-4">
          <label className="block">
            <span className="text-slate-300">Correo del usuario</span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isInviting}
              className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 disabled:opacity-60"
              placeholder="usuario@example.com"
            />
          </label>

          {error && <p className="text-sm text-rose-400">{error}</p>}
        </div>

        <div className="mt-8 flex gap-3">
          <button
            onClick={handleInvite}
            disabled={isInviting || !email.trim()}
            className="flex-1 rounded-2xl bg-cyan-500 px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isInviting ? "Enviando invitación..." : "Enviar invitación"}
          </button>
          <button
            onClick={onClose}
            disabled={isInviting}
            className="flex-1 rounded-2xl bg-slate-700 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-600 disabled:cursor-not-allowed disabled:opacity-60"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}
