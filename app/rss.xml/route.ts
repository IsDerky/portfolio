import { publicadas, ETIQUETAS, type Idioma } from '@/lib/blog';

// Las programadas entran solas el día de su fecha, igual que en /blog
export const dynamic = 'force-dynamic';

const WEB = 'https://derkyu.com';

const escapar = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

// Mediodía de Madrid para que ningún lector la cambie de día
const fechaRss = (f: string) => new Date(`${f}T12:00:00+01:00`).toUTCString();

export function GET(req: Request) {
  const idioma: Idioma = new URL(req.url).searchParams.get('lang') === 'en' ? 'en' : 'es';
  const entradas = publicadas();
  const desc = idioma === 'es'
    ? 'Lo que voy aprendiendo con mi servidor de casa, la red, la seguridad y el hardware.'
    : 'What I learn running my home server, the network, security and hardware.';

  const items = entradas.map((e) => `
    <item>
      <title>${escapar(e[idioma].titulo)}</title>
      <link>${WEB}/blog/${e.slug}</link>
      <guid isPermaLink="true">${WEB}/blog/${e.slug}</guid>
      <pubDate>${fechaRss(e.fecha)}</pubDate>
      <description>${escapar(e[idioma].entradilla)}</description>
${e.tags.map((t) => `      <category>${escapar(ETIQUETAS[t][idioma])}</category>`).join('\n')}
    </item>`).join('');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Blog - Alex (Derkyu)</title>
    <link>${WEB}/blog</link>
    <atom:link href="${WEB}/rss.xml${idioma === 'en' ? '?lang=en' : ''}" rel="self" type="application/rss+xml" />
    <description>${desc}</description>
    <language>${idioma === 'es' ? 'es-ES' : 'en-GB'}</language>
    ${entradas[0] ? `<lastBuildDate>${fechaRss(entradas[0].fecha)}</lastBuildDate>` : ''}${items}
  </channel>
</rss>
`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
    },
  });
}
