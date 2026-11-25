# Derkyu - Portfolio

Mi portfolio personal: proyectos, stack y experiencia, hecho con Next.js 15 y animaciones 3D. En producción en [derkyu.com](https://derkyu.com).

## Stack

- **Framework**: Next.js 15.5 (App Router)
- **React**: 19.1
- **TypeScript**: v5
- **Estilos**: Tailwind CSS v4 + tw-animate-css
- **Animaciones**: Framer Motion 12
- **3D**: Three.js 0.180 + React Three Fiber + Drei
- **Componentes UI**: Radix UI + shadcn/ui
- **Iconos**: Lucide React
- **Idiomas**: next-intl (español, inglés y francés)

## Funcionalidades

- **Modelo 3D interactivo** con Three.js en la portada
- **Diseño responsive** mobile-first
- **Animaciones** con Framer Motion para las transiciones entre páginas
- **Tema oscuro** con la paleta en espacio de color OKLCH
- **Tres idiomas** con next-intl
- **Widget de Spotify** con lo que estoy escuchando en ese momento
- **Paleta de comandos** para navegar con el teclado

## Estructura

```
portfolio/
├── app/                    # App Router de Next.js
│   ├── about/              # Página "Sobre mí"
│   ├── works/              # Proyectos
│   ├── api/spotify/        # Endpoint del widget de Spotify
│   ├── layout.tsx          # Layout raíz
│   ├── page.tsx            # Portada
│   └── globals.css         # Estilos globales
├── components/
│   ├── sections/           # Secciones de página (header, hero, footer…)
│   ├── animations/         # Utilidades de animación
│   ├── providers/          # Providers de React Context
│   ├── layout/             # Componentes de layout
│   └── ui/                 # Componentes de shadcn/ui
├── hooks/                  # Hooks propios
├── i18n/ y messages/       # Configuración y textos de next-intl
├── lib/                    # Utilidades
└── public/
    ├── models/             # Modelos 3D (GLB)
    └── logos/              # Imágenes y logos de los proyectos
```

## Puesta en marcha

### Requisitos

- Node.js 20+
- pnpm

### Desarrollo

```bash
pnpm install    # dependencias
pnpm dev        # servidor de desarrollo
pnpm build      # build de producción
pnpm start      # arranca el build de producción
```

Abre [http://localhost:3000](http://localhost:3000).

### Variables de entorno

Solo las necesita el widget de Spotify; sin ellas, `/api/spotify` responde que no suena nada. Copia `.env.example` a `.env.local` y rellena las credenciales de tu app de Spotify.

### Docker

```bash
docker build -t portfolio .
docker run --rm -p 3000:3000 --env-file .env.local portfolio
```

Build multi-etapa con la salida standalone de Next.js: la imagen final corre con el usuario sin privilegios `node`, no lleva código fuente ni devDependencies, e incluye healthcheck.

### CI

Cada push y cada pull request pasa lint, comprobación de tipos y build de producción; después construye la imagen Docker y comprueba que el contenedor responde en el puerto 3000 (`.github/workflows/ci.yml`).

## Páginas

- **Inicio** (`/`): hero con el modelo 3D, resumen y contacto
- **Sobre mí** (`/about`): bio, contribuciones de GitHub y experiencia
- **Proyectos** (`/works`): proyectos destacados con demo y enlaces

## Componentes clave

### Visor de modelos 3D
- Centrado y escalado automáticos
- Controles orbitales con límites de zoom
- Rotación automática
- Carga diferida con indicador de progreso

### Sistema de animaciones
Provider global que sincroniza las transiciones de página y las animaciones de cada elemento:
- Fade-in con retardos configurables
- Texto rotatorio con efecto stagger
- Efecto máquina de escribir
- Hooks de animación propios

## Dependencias principales

| Paquete | Para qué |
|---------|----------|
| `next` | Framework de React con SSR/SSG |
| `three` + `@react-three/fiber` | Render 3D |
| `framer-motion` | Animaciones declarativas |
| `next-intl` | Traducciones |
| `tailwindcss` | CSS utility-first |
| `lucide-react` | Iconos |
| `react-activity-calendar` | Calendario de contribuciones de GitHub |

## Deploy

En producción va en [Vercel](https://vercel.com). La imagen Docker sirve para correrlo en cualquier otro sitio.

## Licencia

Portfolio personal; el código y los recursos son de Derkyu.

## Autor

**Derkyu** · Barcelona
