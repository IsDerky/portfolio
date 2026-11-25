import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./i18n/request.ts');

const nextConfig: NextConfig = {
  pageExtensions: ['ts', 'tsx'],
  // Salida autocontenida solo para la imagen Docker; en Vercel no cambia nada
  output: process.env.NEXT_STANDALONE === '1' ? 'standalone' : undefined,
  // Transpila los paquetes de Three.js para evitar problemas de SSR
  transpilePackages: ['@react-three/fiber', '@react-three/drei', 'three'],
  
  // Configuración de webpack para Three.js
  webpack: (config) => {
    // Excluir paquetes problemáticos que no son necesarios en el browser
    config.externals.push({
      'utf-8-validate': 'commonjs utf-8-validate',
      'bufferutil': 'commonjs bufferutil',
    });

    // Configurar alias para evitar problemas de resolución de módulos
    config.resolve.alias = {
      ...config.resolve.alias,
      'three/examples/jsm': 'three/examples/jsm',
    };

    return config;
  },

  // Optimizaciones de imágenes y recursos estáticos
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'i.scdn.co',
      },
    ],
  },

  // Configuración experimental para mejorar el rendimiento
  experimental: {
    optimizePackageImports: ['three', '@react-three/fiber', '@react-three/drei', 'framer-motion', 'lucide-react'],
  },

  // Headers para permitir la carga de modelos 3D
  async headers() {
    return [
      {
        source: '/models/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },

  // www.derkyu.com sirve la misma web: mejor una sola URL (308, conserva ruta y query)
  async redirects() {
    return [
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'www.derkyu.com' }],
        destination: 'https://derkyu.com/:path*',
        permanent: true,
      },
    ];
  },
};

export default withNextIntl(nextConfig);