import Link from 'next/link';
import { Calendar, Clock, Layers } from 'lucide-react';
import { poppins } from '@/lib/fonts';
import { ETIQUETAS, SERIES, TEXTOS, fechaLarga, type Entrada, type Idioma } from '@/lib/blog';

export const Meta = ({ e, idioma }: { e: Entrada; idioma: Idioma }) => (
  <div className={`${poppins.className} flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-fg-muted`}>
    <span className="inline-flex items-center gap-1.5"><Calendar size={13} />{fechaLarga(e.fecha, idioma)}</span>
    <span className="inline-flex items-center gap-1.5"><Clock size={13} />{e.min} {TEXTOS[idioma].min}</span>
  </div>
);

export const Etiquetas = ({ e, idioma }: { e: Entrada; idioma: Idioma }) => (
  <div className="flex flex-wrap gap-1.5">
    {e.tags.map((t) => (
      <span key={t} className={`${poppins.className} text-[11px] px-2.5 py-1 rounded-full bg-fg-primary/10 text-fg-secondary`}>
        {ETIQUETAS[t][idioma]}
      </span>
    ))}
  </div>
);

export const Serie = ({ e, idioma }: { e: Entrada; idioma: Idioma }) =>
  e.serie ? (
    <span className={`${poppins.className} inline-flex items-center gap-1.5 text-xs font-medium text-fg-primary`}>
      <Layers size={13} />
      {SERIES[e.serie.id][idioma]} · {e.serie.n} {TEXTOS[idioma].de} {SERIES[e.serie.id].total}
    </span>
  ) : null;

export const Tarjeta = ({ e, idioma, grande = false }: { e: Entrada; idioma: Idioma; grande?: boolean }) => (
  <Link
    href={`/blog/${e.slug}`}
    className="group bg-surface-2 rounded-2xl border border-fg-primary/10 hover:border-fg-primary/25 transition-colors p-6 md:p-8 flex flex-col gap-3 h-full"
  >
    <Serie e={e} idioma={idioma} />
    <h3 className={`${poppins.className} font-semibold text-fg-primary group-hover:underline underline-offset-4 decoration-fg-primary/30 ${grande ? 'text-2xl md:text-3xl' : 'text-lg md:text-xl'}`}>
      {e[idioma].titulo}
    </h3>
    <p className={`${poppins.className} text-fg-secondary leading-relaxed font-light ${grande ? 'md:text-lg' : 'text-sm md:text-base'}`}>
      {e[idioma].entradilla}
    </p>
    <div className="mt-auto pt-2 flex flex-col gap-3">
      <Etiquetas e={e} idioma={idioma} />
      <Meta e={e} idioma={idioma} />
    </div>
  </Link>
);
