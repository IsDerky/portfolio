// Entradas del blog. El texto de cada una vive en content/blog/<slug>.tsx (es y en).
// Una entrada con fecha posterior a hoy (hora de Madrid) no existe para nadie: ni en el índice ni por su URL.
// Las páginas del blog son dinámicas (el idioma va por cookie), así que salen solas el día de su fecha.

export type Idioma = 'es' | 'en';

export interface Entrada {
  slug: string;
  fecha: string; // AAAA-MM-DD
  min: number;
  tags: Etiqueta[];
  serie?: { id: keyof typeof SERIES; n: number };
  es: { titulo: string; entradilla: string };
  en: { titulo: string; entradilla: string };
}

export const ETIQUETAS = {
  homelab: { es: 'Homelab', en: 'Homelab' },
  ansible: { es: 'Ansible', en: 'Ansible' },
  redes: { es: 'Redes', en: 'Networking' },
  seguridad: { es: 'Seguridad', en: 'Security' },
  monitorizacion: { es: 'Monitorización', en: 'Monitoring' },
  docker: { es: 'Docker', en: 'Docker' },
  copias: { es: 'Copias', en: 'Backups' },
  hardware: { es: 'Hardware', en: 'Hardware' },
  ia: { es: 'IA', en: 'AI' },
  rust: { es: 'Rust', en: 'Rust' },
} as const;
export type Etiqueta = keyof typeof ETIQUETAS;

export const SERIES = {
  copias: { es: 'Copias que funcionan', en: 'Backups that work', total: 2 },
} as const;

export const ENTRADAS: Entrada[] = [
  {
    slug: 'ansible-publico-privado', fecha: '2026-07-09', min: 6, tags: ['ansible', 'seguridad'],
    es: { titulo: 'Ansible con un repo público y otro privado', entradilla: 'Los roles a la vista; el inventario y los secretos, aparte. Cómo lo separo y qué reviso antes de cada push.' },
    en: { titulo: 'Ansible with a public repo and a private one', entradilla: 'Roles in the open; inventory and secrets kept apart. How I split them and what I check before every push.' },
  },
  {
    slug: 'wireguard-servicios-internos', fecha: '2026-08-21', min: 7, tags: ['redes', 'seguridad'],
    es: { titulo: 'WireGuard para unir máquinas lejanas', entradilla: 'Mi servidor de casa y un par de máquinas en la nube en la misma red privada, y los servicios internos escuchando solo en el túnel.' },
    en: { titulo: 'WireGuard to join far-away machines', entradilla: 'My home server and a couple of cloud machines on one private network, with internal services listening only on the tunnel.' },
  },
  {
    slug: 'monitorizar-sin-volverse-loco', fecha: '2026-09-03', min: 8, tags: ['monitorizacion', 'homelab'],
    es: { titulo: 'Monitorizar un servidor de casa sin volverse loco', entradilla: 'Prometheus y Grafana para mirar, y alertas solo de lo que pide que haga algo. Lo que quité porque solo hacía ruido.' },
    en: { titulo: 'Monitoring a home server without losing your mind', entradilla: 'Prometheus and Grafana to look at things, and alerts only for what needs me to act. What I removed because it was just noise.' },
  },
  {
    slug: 'honeypot', fecha: '2026-09-30', min: 9, tags: ['seguridad', 'homelab'],
    es: { titulo: 'Un honeypot en casa: qué intentan los bots', entradilla: 'Un SSH y un Telnet falsos abiertos a internet. Treinta días de datos: usuarios, contraseñas, comandos y lo que me llevo a mis máquinas de verdad.' },
    en: { titulo: 'A honeypot at home: what the bots try', entradilla: 'A fake SSH and Telnet open to the internet. Thirty days of data: usernames, passwords, commands and what I take to my real machines.' },
  },
  {
    slug: 'docker-ufw-puertos', fecha: '2026-10-14', min: 7, tags: ['docker', 'redes', 'seguridad'],
    es: { titulo: 'Docker se salta ufw y otras sorpresas con puertos', entradilla: 'Lo que publica Docker no pasa por el cortafuegos, y un servidor web que abre el 80 sin pedirlo puede dejar sin renovar un certificado.' },
    en: { titulo: 'Docker bypasses ufw, and other port surprises', entradilla: 'What Docker publishes skips the firewall, and a web server that opens port 80 on its own can quietly break a certificate renewal.' },
  },
  {
    slug: 'copias-local-nube', fecha: '2026-10-29', min: 8, tags: ['copias', 'homelab'], serie: { id: 'copias', n: 1 },
    es: { titulo: 'Copias en local y en la nube, y probar que se pueden restaurar', entradilla: 'restic cifrado a un disco de casa y a la nube, con un simulacro que restaura de verdad y avisa si algo no cuadra.' },
    en: { titulo: 'Local and cloud backups, and proving they restore', entradilla: 'Encrypted restic to a disk at home and to the cloud, with a drill that really restores and complains if something is off.' },
  },
  {
    slug: 'ram-defectuosa', fecha: '2026-11-12', min: 9, tags: ['copias', 'hardware'], serie: { id: 'copias', n: 2 },
    es: { titulo: 'Cómo las copias delataron una RAM defectuosa', entradilla: 'restic se quejaba de índices que estaban bien. Un carácter cambiado, memtester y el parámetro memtest del núcleo para seguir funcionando sin abrir la caja.' },
    en: { titulo: 'How my backups gave away a faulty RAM module', entradilla: 'restic complained about indexes that were fine. One changed character, memtester and the kernel memtest parameter to keep going without opening the case.' },
  },
  {
    slug: 'rack-12u', fecha: '2026-11-26', min: 10, tags: ['hardware', 'homelab'],
    es: { titulo: 'Plan de un rack de 12U en casa', entradilla: 'Qué piezas, cuánto cuestan con los precios de 2026 (la RAM y los SSD por las nubes) y por qué cada una.' },
    en: { titulo: 'Planning a 12U rack at home', entradilla: 'Which parts, what they cost at 2026 prices (RAM and SSDs through the roof) and why each one.' },
  },
  {
    slug: 'kyu-terminal', fecha: '2026-11-25', min: 9, tags: ['rust', 'ia'],
    es: { titulo: 'Kyu: un terminal en Rust con Claude dentro', entradilla: 'Tauri, xterm.js, tres peleas con ConPTY y cómo habla con Claude Code por stream-json. Con los números frente a Windows Terminal.' },
    en: { titulo: 'Kyu: a Rust terminal with Claude inside', entradilla: 'Tauri, xterm.js, three fights with ConPTY and how it talks to Claude Code over stream-json. With the numbers against Windows Terminal.' },
  },
  {
    slug: 'programar-con-ia', fecha: '2026-12-10', min: 8, tags: ['ia'],
    es: { titulo: 'Programar con una IA como compañero', entradilla: 'Qué le dejo hacer, dónde se equivoca y las reglas que me he puesto después de unos cuantos meses.' },
    en: { titulo: 'Programming with an AI as a teammate', entradilla: 'What I let it do, where it gets things wrong and the rules I set myself after a few months.' },
  },
];

// Fecha de hoy en Madrid, AAAA-MM-DD
export const hoy = (): string =>
  new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Madrid', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date());

export const publicadas = (): Entrada[] => {
  const h = hoy();

  return ENTRADAS.filter((e) => e.fecha <= h).sort((a, b) => b.fecha.localeCompare(a.fecha));
};

export const buscar = (slug: string): Entrada | undefined => publicadas().find((e) => e.slug === slug);

export const fechaLarga = (f: string, idioma: Idioma): string =>
  new Intl.DateTimeFormat(idioma === 'es' ? 'es-ES' : 'en-GB', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' })
    .format(new Date(`${f}T00:00:00Z`));

export const TEXTOS = {
  es: {
    titulo: 'Blog', intro: 'Lo que voy aprendiendo con mi servidor de casa, la red, la seguridad y el hardware. Contado como pasó, con lo que salió mal incluido.',
    todo: 'Todo', min: 'min de lectura', de: 'de', volver: 'Blog', enEsta: 'En esta entrada', anterior: 'Anterior en la serie',
    siguiente: 'Siguiente en la serie', tambien: 'También en el blog', vacio: 'No hay entradas con esa etiqueta.',
  },
  en: {
    titulo: 'Blog', intro: 'What I learn running my home server, the network, security and hardware. Told as it happened, including what went wrong.',
    todo: 'All', min: 'min read', de: 'of', volver: 'Blog', enEsta: 'In this post', anterior: 'Previous in the series',
    siguiente: 'Next in the series', tambien: 'Also on the blog', vacio: 'No posts with that tag.',
  },
} as const;
