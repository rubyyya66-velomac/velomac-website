import sharp from "sharp";
import { fileURLToPath } from "node:url";

const asset = (name) => fileURLToPath(new URL(`../public/images/brand/${name}`, import.meta.url));
const logo = await sharp(asset("velomac-logo-transparent.png"))
  .trim()
  .resize({ width: 105 })
  .png()
  .toBuffer();

const art = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <linearGradient id="background" x2="1" y2="1" gradientUnits="objectBoundingBox">
      <stop stop-color="#09192d"/>
      <stop offset="1" stop-color="#102d4e"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#background)"/>
  <path fill="#3287e3" d="M0 0h1200v8H0z"/>
  <rect x="64" y="59" width="153" height="105" rx="8" fill="#fff"/>
  <g font-family="Arial, Helvetica, sans-serif">
    <text x="65" y="230" fill="#a9d1ff" font-size="22" font-weight="700" letter-spacing="4">BUYER TOOLS</text>
    <text x="62" y="315" fill="#fff" font-size="62" font-weight="700">Comparing Flowmeter</text>
    <text x="62" y="388" fill="#fff" font-size="62" font-weight="700">Quotations?</text>
    <text x="64" y="464" fill="#d3e7ff" font-size="35">Look Beyond the Unit Price.</text>
    <text x="65" y="556" fill="#a9d1ff" font-size="20" font-weight="700" letter-spacing="2">PDF + EDITABLE XLSX</text>
    <g transform="translate(799 153)">
      <rect x="16" y="17" width="315" height="307" rx="10" fill="#000" opacity=".19"/>
      <rect width="315" height="307" rx="10" fill="#f7faff"/>
      <path fill="#1264ba" d="M10 0h295a10 10 0 0 1 10 10v38H0V10A10 10 0 0 1 10 0z"/>
      <text x="19" y="31" fill="#fff" font-size="16" font-weight="700" letter-spacing="1">QUOTE COMPARISON</text>
      <path d="M16 98h282m-282 52h282m-282 52h282m-282 52h282M134 62v210m56-210v210m56-210v210" stroke="#c9dbef" fill="none"/>
      <g fill="#163655" font-size="16" font-weight="700">
        <text x="18" y="133">Scope</text><text x="18" y="185">Freight</text><text x="18" y="237">Destination</text>
      </g>
      <g fill="#1264ba" font-size="16" font-weight="700" text-anchor="middle">
        <text x="162" y="86">A</text><text x="218" y="86">B</text><text x="274" y="86">C</text>
      </g>
      <path d="M151 124h22m34 0h22m34 0h22m-134 52h22m34 0h22m34 0h22m-134 52h22m34 0h22m34 0h22" stroke="#7ca7d6" stroke-width="5" stroke-linecap="round"/>
    </g>
  </g>
</svg>`;

await sharp(Buffer.from(art))
  .composite([{ input: logo, left: 88, top: 74 }])
  .png({ compressionLevel: 9, palette: true, colours: 256 })
  .toFile(asset("quotation-comparison-share.png"));
