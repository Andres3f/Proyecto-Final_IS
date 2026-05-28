import { ReactNode } from "react";

interface SectionWrapperProps {
  title: string;
  children: ReactNode;
}

export function SectionWrapper({ title, children }: SectionWrapperProps) {
  return (
    <section className="rounded-3xl border border-slate-800 bg-slate-950/90 p-6 shadow-xl shadow-slate-950/20">
      <h2 className="text-2xl font-semibold text-white mb-4">{title}</h2>
      {children}
    </section>
  );
}
