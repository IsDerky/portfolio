import type { Contenido } from '@/components/blog/Prosa';
import * as ansible from './ansible-publico-privado';
import * as wireguard from './wireguard-servicios-internos';
import * as monitorizar from './monitorizar-sin-volverse-loco';
import * as honeypot from './honeypot';
import * as docker from './docker-ufw-puertos';
import * as copias from './copias-local-nube';
import * as ram from './ram-defectuosa';
import * as rack from './rack-12u';
import * as ia from './programar-con-ia';

// Texto de cada entrada por slug (los datos van en lib/blog.ts)
export const CONTENIDO: Record<string, { es: Contenido; en: Contenido }> = {
  'ansible-publico-privado': ansible,
  'wireguard-servicios-internos': wireguard,
  'monitorizar-sin-volverse-loco': monitorizar,
  honeypot,
  'docker-ufw-puertos': docker,
  'copias-local-nube': copias,
  'ram-defectuosa': ram,
  'rack-12u': rack,
  'programar-con-ia': ia,
};
