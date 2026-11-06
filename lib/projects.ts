export interface Project {
  id: string;
  title: string;
  description: string;
  longDescription: string;
  image?: string;
  lightImage?: string;
  darkBackground?: boolean;
  tags: string[];
  category: 'infra' | 'security' | 'web' | 'tools';
  liveUrl?: string;
  githubUrl?: string;
  year: string;
  featured: boolean;
  details?: {
    title: string;
    text: string;
  }[];
}

export const projects: Project[] = [
  {
    id: 'homelab',
    title: 'Homelab',
    description: 'My home server, run like production and managed with Ansible.',
    longDescription: 'Encrypted backups with monthly restore drills, external monitoring, hardening and self-hosted CI/CD with rollback, all rebuilt from Ansible roles.',
    tags: ['Ansible', 'Linux', 'restic', 'systemd', 'GitHub Actions'],
    category: 'infra',
    githubUrl: 'https://github.com/IsDerky/homelab',
    year: '2025',
    featured: true,
    details: [
      {
        title: 'Configuration as code',
        text: 'SSH, firewall, fail2ban, backups, alerts, nginx and Cloudflare Tunnel as Ansible roles with secrets in Vault. A second run ends with changed=0.',
      },
      {
        title: 'Backups that are tested',
        text: 'restic to Google Drive, encrypted before leaving the server, and a monthly drill that restores and checks the data on its own.',
      },
    ],
  },
  {
    id: 'cowrie-honeypot',
    title: 'Cowrie Honeypot',
    description: 'SSH and Telnet honeypot in Docker, isolated from the LAN.',
    longDescription: 'Layered isolation (non-root, read-only filesystem, iptables in DOCKER-USER and systemd) and an isolation test that stops the service if it fails.',
    tags: ['Docker', 'iptables', 'systemd', 'Bash', 'Ansible'],
    category: 'security',
    githubUrl: 'https://github.com/IsDerky/cowrie-honeypot',
    year: '2026',
    featured: true,
  },
  {
    id: 'asistente-ops',
    title: 'Ops Assistant',
    description: 'Discord bot to operate my server from my phone.',
    longDescription: 'A root collector, an unprivileged bot with read-only LLM tools, actions that need a confirmation click and an external watchdog on Cloudflare Workers defined in Terraform.',
    tags: ['TypeScript', 'Bun', 'Python', 'Terraform', 'Cloudflare Workers'],
    category: 'infra',
    githubUrl: 'https://github.com/IsDerky/asistente-ops',
    year: '2026',
    featured: true,
  },
  {
    id: 'oficina-pixel',
    title: 'Oficina Pixel',
    description: 'Status dashboard for my server as a pixel-art building.',
    longDescription: 'Every animation is a real event received over SSE: deploys, backups, bans or attacks on the honeypot. LAN only and read-only.',
    image: '/projects/oficina.png',
    tags: ['TypeScript', 'Canvas', 'SSE', 'nginx'],
    category: 'tools',
    githubUrl: 'https://github.com/IsDerky/oficina-pixel',
    year: '2026',
    featured: false,
  },
  {
    id: 'bodycamrp',
    title: 'Bodycam RP',
    description: 'Browser-based bodycam overlay configurator for FiveM and GTA Roleplay streamers.',
    longDescription: 'Customize your bodycam overlay with your name, rank, badge number, one of 5 designs, font, logo, and screen position — then launch it directly as an OBS browser source. No installation or account required.',
    image: '/logos/bodycamrp-logo.png',
    tags: ['Next.js', 'React', 'PostgreSQL', 'OBS'],
    category: 'web',
    liveUrl: 'https://bodycamrp.org',
    githubUrl: 'https://github.com/IsDerky/bodycam-rp-overlay',
    year: '2026',
    featured: false,
  },
];

export const getFeaturedProjects = () => projects.filter((p) => p.featured);
export const getProjectById = (id: string) => projects.find((p) => p.id === id);
