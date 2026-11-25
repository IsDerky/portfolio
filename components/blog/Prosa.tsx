import React from 'react';
import { poppins } from '@/lib/fonts';
import { AlertTriangle, CheckCircle2, Info } from 'lucide-react';

// Piezas para escribir las entradas del blog sin repetir clases

export const H2 = ({ id, children }: { id: string; children: React.ReactNode }) => (
  <h2 id={id} className={`${poppins.className} text-xl md:text-2xl font-semibold text-fg-primary mt-10 mb-3 scroll-mt-28`}>
    {children}
  </h2>
);

export const P = ({ children }: { children: React.ReactNode }) => (
  <p className={`${poppins.className} text-fg-secondary leading-relaxed mb-4`}>{children}</p>
);

export const C = ({ children }: { children: React.ReactNode }) => (
  <code className="font-mono text-[0.9em] bg-fg-primary/10 text-fg-primary px-1.5 py-0.5 rounded-md">{children}</code>
);

export const Pre = ({ children }: { children: React.ReactNode }) => (
  <pre className="font-mono text-[13px] leading-relaxed bg-surface-deep text-fg-secondary border border-fg-primary/10 rounded-xl p-4 mb-4 overflow-x-auto whitespace-pre">
    {children}
  </pre>
);

// colores dentro de un Pre
export const Rojo = ({ children }: { children: React.ReactNode }) => <span className="text-red-400">{children}</span>;
export const Verde = ({ children }: { children: React.ReactNode }) => <span className="text-emerald-400">{children}</span>;
export const Gris = ({ children }: { children: React.ReactNode }) => <span className="text-fg-muted">{children}</span>;

const CAJAS = {
  ojo: { icono: Info, clase: 'border-amber-400/40 bg-amber-400/5', color: 'text-amber-400' },
  mal: { icono: AlertTriangle, clase: 'border-red-400/40 bg-red-400/5', color: 'text-red-400' },
  bien: { icono: CheckCircle2, clase: 'border-emerald-400/40 bg-emerald-400/5', color: 'text-emerald-400' },
};
export const Caja = ({ tipo, titulo, children }: { tipo: keyof typeof CAJAS; titulo: string; children: React.ReactNode }) => {
  const { icono: Icono, clase, color } = CAJAS[tipo];

  return (
    <div className={`border rounded-xl p-4 mb-5 ${clase}`}>
      <div className={`${poppins.className} flex items-center gap-2 font-semibold mb-1 ${color}`}>
        <Icono size={16} />
        {titulo}
      </div>
      <div className={`${poppins.className} text-fg-secondary leading-relaxed text-[15px]`}>{children}</div>
    </div>
  );
};

export const Lista = ({ children }: { children: React.ReactNode }) => (
  <ul className={`${poppins.className} text-fg-secondary leading-relaxed mb-4 space-y-2 list-disc pl-5 marker:text-fg-muted`}>{children}</ul>
);

export const Tabla = ({ cab, filas }: { cab: string[]; filas: React.ReactNode[][] }) => (
  <div className="overflow-x-auto mb-5 border border-fg-primary/10 rounded-xl">
    <table className={`${poppins.className} w-full text-sm`}>
      <thead className="bg-fg-primary/5 text-fg-primary">
        <tr>{cab.map((c) => <th key={c} className="text-left font-semibold px-4 py-2 whitespace-nowrap">{c}</th>)}</tr>
      </thead>
      <tbody className="text-fg-secondary">
        {filas.map((f, i) => (
          <tr key={i} className="border-t border-fg-primary/10">
            {f.map((c, j) => <td key={j} className="px-4 py-2 align-top">{c}</td>)}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

// cronología vertical con puntos
export const Cronologia = ({ puntos }: { puntos: [string, React.ReactNode][] }) => (
  <div className="border-l-2 border-fg-primary/15 ml-1.5 pl-5 mb-5 space-y-3">
    {puntos.map(([cuando, que]) => (
      <div key={cuando} className="relative">
        <span className="absolute -left-[27px] top-1.5 w-2.5 h-2.5 rounded-full bg-red-400" />
        <div className={`${poppins.className} text-sm font-semibold text-fg-primary`}>{cuando}</div>
        <div className={`${poppins.className} text-fg-secondary text-[15px] leading-relaxed`}>{que}</div>
      </div>
    ))}
  </div>
);

export const Figura = ({ pie, children }: { pie: string; children: React.ReactNode }) => (
  <figure className="bg-surface-deep border border-fg-primary/10 rounded-xl p-4 mb-5">
    <div className="overflow-x-auto">{children}</div>
    <figcaption className={`${poppins.className} text-sm text-fg-muted mt-2 text-center`}>{pie}</figcaption>
  </figure>
);

export interface Contenido {
  indice: [string, string][];
  cuerpo: React.ReactNode;
}
