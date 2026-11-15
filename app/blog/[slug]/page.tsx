import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getLocale } from 'next-intl/server';
import { ChevronLeft, ChevronRight, Layers } from 'lucide-react';
import Section from '@/components/layout/Section';
import Footer from '@/components/sections/Footer';
import { Meta, Etiquetas, Serie } from '@/components/blog/Tarjeta';
import { CONTENIDO } from '@/content/blog';
import { poppins } from '@/lib/fonts';
import { SERIES, TEXTOS, buscar, publicadas, type Entrada, type Idioma } from '@/lib/blog';

// Una entrada programada da 404 hasta su fecha
export const dynamic = 'force-dynamic';

const idiomaActual = async (): Promise<Idioma> => ((await getLocale()) === 'es' ? 'es' : 'en');

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const e = buscar(slug);
  if (!e) return {};
  const { titulo, entradilla } = e[await idiomaActual()];

  return {
    title: `${titulo} - Alex Miguel (Derkyu)`,
    description: entradilla,
    openGraph: { title: titulo, description: entradilla, url: `https://derkyu.com/blog/${slug}`, siteName: 'Alex Miguel (Derkyu)', type: 'article', publishedTime: e.fecha },
    twitter: { card: 'summary_large_image', title: titulo, description: entradilla },
  };
}

const Vecina = ({ e, idioma, texto, derecha = false }: { e: Entrada; idioma: Idioma; texto: string; derecha?: boolean }) => (
  <Link href={`/blog/${e.slug}`} className={`bg-surface-2 rounded-2xl border border-fg-primary/10 hover:border-fg-primary/25 transition-colors p-5 flex flex-col gap-1 ${derecha ? 'md:text-right md:items-end' : ''}`}>
    <span className={`${poppins.className} text-xs text-fg-muted inline-flex items-center gap-1`}>
      {!derecha && <ChevronLeft size={14} />}{texto}{derecha && <ChevronRight size={14} />}
    </span>
    <span className={`${poppins.className} font-medium text-fg-primary`}>{e[idioma].titulo}</span>
  </Link>
);

export default async function EntradaPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const e = buscar(slug);
  const texto = CONTENIDO[slug];
  if (!e || !texto) notFound();

  const idioma = await idiomaActual();
  const t = TEXTOS[idioma];
  const contenido = texto[idioma];
  const todas = publicadas();

  // vecinas: dentro de la serie si la hay; si no, la publicada justo antes
  const enSerie = e.serie ? todas.filter((x) => x.serie?.id === e.serie!.id).sort((a, b) => a.serie!.n - b.serie!.n) : [];
  const anterior = e.serie ? enSerie.find((x) => x.serie!.n === e.serie!.n - 1) : undefined;
  const siguiente = e.serie ? enSerie.find((x) => x.serie!.n === e.serie!.n + 1) : undefined;
  const otra = !anterior && !siguiente ? todas.find((x) => x.slug !== e.slug && x.fecha <= e.fecha) ?? todas.find((x) => x.slug !== e.slug) : undefined;

  return (
    <>
      <Section className="py-6 md:py-8">
        <Link href="/blog" className={`${poppins.className} inline-flex items-center gap-1 text-sm text-fg-muted hover:text-fg-primary mb-4`}>
          <ChevronLeft size={16} />{t.volver}
        </Link>
        <header className="bg-surface-2 rounded-2xl p-6 md:p-12 border border-fg-primary/10 flex flex-col gap-4">
          <Serie e={e} idioma={idioma} />
          <h1 className={`${poppins.className} text-2xl md:text-4xl font-semibold text-fg-primary leading-tight`}>{e[idioma].titulo}</h1>
          <p className={`${poppins.className} text-fg-secondary md:text-lg leading-relaxed font-light`}>{e[idioma].entradilla}</p>
          <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-6">
            <Meta e={e} idioma={idioma} />
            <Etiquetas e={e} idioma={idioma} />
          </div>
        </header>
      </Section>

      <Section className="py-2 md:py-4">
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_220px] gap-10">
          <article className="min-w-0">{contenido.cuerpo}</article>
          <aside className="hidden lg:block">
            <div className="sticky top-28 flex flex-col gap-6">
              <nav className="flex flex-col gap-2" aria-label={t.enEsta}>
                <b className={`${poppins.className} text-xs uppercase tracking-wider text-fg-muted`}>{t.enEsta}</b>
                {contenido.indice.map(([id, nombre]) => (
                  <a key={id} href={`#${id}`} className={`${poppins.className} text-sm text-fg-secondary hover:text-fg-primary`}>{nombre}</a>
                ))}
              </nav>
              {e.serie && (
                <div className="flex flex-col gap-2 border-t border-fg-primary/10 pt-4">
                  <b className={`${poppins.className} text-xs uppercase tracking-wider text-fg-muted inline-flex items-center gap-1.5`}>
                    <Layers size={13} />{SERIES[e.serie.id][idioma]}
                  </b>
                  {enSerie.map((x) => (
                    <Link key={x.slug} href={`/blog/${x.slug}`} className={`${poppins.className} text-sm ${x.slug === e.slug ? 'text-fg-primary font-medium' : 'text-fg-secondary hover:text-fg-primary'}`}>
                      {x.serie!.n}. {x[idioma].titulo}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </aside>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-12">
          {anterior && <Vecina e={anterior} idioma={idioma} texto={t.anterior} />}
          {siguiente && <div className={anterior ? '' : 'md:col-start-2'}><Vecina e={siguiente} idioma={idioma} texto={t.siguiente} derecha /></div>}
          {otra && <div className="md:col-start-2"><Vecina e={otra} idioma={idioma} texto={t.tambien} derecha /></div>}
        </div>
      </Section>
      <Footer />
    </>
  );
}
