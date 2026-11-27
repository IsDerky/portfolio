// Genera los iconos (favicon, apple-icon y PWA) desde app/icon.svg:
// public/icon-192.png, icon-512.png, icon-maskable-512.png, app/apple-icon.png
// y app/favicon.ico. Se lanza solo en `dev` y `build`; los ficheros no se versionan.
// (app/icon.svg, el icono vectorial de la pestaña, sí se mantiene a mano.)
import { readFileSync, writeFileSync } from "node:fs";
import sharp from "sharp";

const FONDO = "#0f0f0f"; // --surface-deep del tema oscuro, que es el de por defecto
// El SVG cambia de color con prefers-color-scheme (el render no lo evalúa): aquí, en blanco sobre fondo oscuro.
const svg = readFileSync("app/icon.svg", "utf8").replace("fill:#0a0a0a", "fill:#fff");

// El logo sobre fondo opaco, ocupando `escala` del lado (el mayor de sus lados).
async function icono(lado, escala) {
  const logo = Math.round(lado * escala);
  const capa = await sharp(Buffer.from(svg), { density: 72 * Math.ceil((logo * 2) / 100) })
    .resize(logo, logo, { fit: "inside" })
    .png()
    .toBuffer();
  const { width, height } = await sharp(capa).metadata();
  return sharp({ create: { width: lado, height: lado, channels: 4, background: FONDO } })
    .composite([{ input: capa, left: Math.round((lado - width) / 2), top: Math.round((lado - height) / 2) }])
    .png({ compressionLevel: 9 })
    .toBuffer();
}

// ICO con PNG dentro (lo aceptan todos los navegadores desde hace años).
function ico(pngs) {
  const cabecera = Buffer.alloc(6 + 16 * pngs.length);
  cabecera.writeUInt16LE(0, 0);
  cabecera.writeUInt16LE(1, 2);
  cabecera.writeUInt16LE(pngs.length, 4);
  let desplazamiento = cabecera.length;
  pngs.forEach(({ lado, datos }, i) => {
    const o = 6 + 16 * i;
    cabecera.writeUInt8(lado >= 256 ? 0 : lado, o);
    cabecera.writeUInt8(lado >= 256 ? 0 : lado, o + 1);
    cabecera.writeUInt16LE(1, o + 4);
    cabecera.writeUInt16LE(32, o + 6);
    cabecera.writeUInt32LE(datos.length, o + 8);
    cabecera.writeUInt32LE(desplazamiento, o + 12);
    desplazamiento += datos.length;
  });
  return Buffer.concat([cabecera, ...pngs.map((p) => p.datos)]);
}

// «any»: el lanzador recorta las esquinas, el logo puede ir grande.
writeFileSync("public/icon-192.png", await icono(192, 0.66));
writeFileSync("public/icon-512.png", await icono(512, 0.66));
// «maskable»: Android puede recortarlo en un círculo del 80 % del lado; un
// cuadrado cabe entero si su lado es ≤ 0,8/√2 ≈ 0,566.
writeFileSync("public/icon-maskable-512.png", await icono(512, 0.56));
// iOS redondea él solo y no admite transparencia.
writeFileSync("app/apple-icon.png", await icono(180, 0.62));
writeFileSync(
  "app/favicon.ico",
  ico([
    { lado: 16, datos: await icono(16, 0.9) },
    { lado: 32, datos: await icono(32, 0.86) },
    { lado: 48, datos: await icono(48, 0.84) },
  ]),
);
console.log("Iconos generados");
