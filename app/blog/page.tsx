import type { Metadata } from 'next';
import Link from 'next/link';
import { getLocale } from 'next-intl/server';
import Section from '@/components/layout/Section';
import Footer from '@/components/sections/Footer';
import { Tarjeta } from '@/components/blog/Tarjeta';
import { poppins } from '@/lib/fonts';
import { ETIQUETAS, TEXTOS, publicadas, type Etiqueta, type Idioma } from '@/lib/blog';

// La lista depende del día: lo programado aparece solo cuando llega su fecha
export const dynamic = 'force-dynamic';

const description = 'Notes from running my home server: networking, security, monitoring, backups and hardware.';

export const metadata: Metadata = {
  title: 'Blog - Alex (Derkyu)',
  description,
  openGraph: { title: 'Blog - Alex (Derkyu)', description, url: 'https://derkyu.com/blog', siteName: 'Alex (Derkyu)', type: 'website' },
  twitter: { card: 'summary_large_image', title: 'Blog - Alex (Derkyu)', description },
};

export default async function BlogPage({ searchParams }: { searchParams: Promise<{ tag?: string }> }) {
  const idioma: Idioma = (await getLocale()) === 'es' ? 'es' : 'en';
  const t = TEXTOS[idioma];
  const { tag } = await searchParams;
  const todas = publicadas();
  const filtro = tag && tag in ETIQUETAS ? (tag as Etiqueta) : null;
  const visibles = filtro ? todas.filter((e) => e.tags.includes(filtro)) : todas;
  const etiquetas = (Object.keys(ETIQUETAS) as Etiqueta[])
    .map((k) => [k, todas.filter((e) => e.tags.includes(k)).length] as const)
    .filter(([, n]) => n > 0);
  const [primera, ...resto] = visibles;

  const pastilla = (activa: boolean) =>
    `${poppins.className} inline-flex items-center gap-2 text-sm px-4 py-1.5 rounded-full border transition-colors ${
      activa ? 'bg-fg-primary text-surface-0 border-fg-primary' : 'border-fg-primary/15 text-fg-secondary hover:text-fg-primary hover:border-fg-primary/30'
    }`;

  return (
    <>
      <Section className="py-6 md:py-8">
        <div className="bg-surface-2 rounded-2xl p-6 md:p-16 border border-fg-primary/10">
          <h1 className={`${poppins.className} text-2xl md:text-3xl lg:text-4xl font-semibold text-fg-primary mb-4 md:mb-6`}>{t.titulo}</h1>
          <p className={`${poppins.className} text-sm md:text-base lg:text-lg text-fg-secondary leading-relaxed font-light md:max-w-3xl`}>{t.intro}</p>
        </div>
      </Section>

      <Section className="py-2">
        <nav className="flex flex-wrap gap-2" aria-label="Tags">
          <Link href="/blog" scroll={false} className={pastilla(!filtro)}>
            {t.todo}<span className="text-xs opacity-60">{todas.length}</span>
          </Link>
          {etiquetas.map(([k, n]) => (
            <Link key={k} href={`/blog?tag=${k}`} scroll={false} className={pastilla(filtro === k)}>
              {ETIQUETAS[k][idioma]}<span className="text-xs opacity-60">{n}</span>
            </Link>
          ))}
        </nav>
      </Section>

      <Section className="py-6 md:py-8">
        {primera ? (
          <div className="flex flex-col gap-4">
            <Tarjeta e={primera} idioma={idioma} grande />
            {resto.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {resto.map((e) => <Tarjeta key={e.slug} e={e} idioma={idioma} />)}
              </div>
            )}
          </div>
        ) : (
          <p className={`${poppins.className} text-fg-muted`}>{t.vacio}</p>
        )}
      </Section>
      <Footer />
    </>
  );
}
