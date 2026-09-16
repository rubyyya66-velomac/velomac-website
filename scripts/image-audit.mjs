import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const baseUrl = process.env.AUDIT_BASE_URL || "http://localhost:3001";
const imageRoot = path.join(process.cwd(), "public", "images");
const failures = [];

const sourceFiles = await listFiles(imageRoot);
await runInBatches(sourceFiles, 12, async (file) => {
  try {
    const metadata = await sharp(await readFile(file)).metadata();
    if (!metadata.width || !metadata.height) {
      failures.push(`Source image has invalid dimensions: ${path.relative(process.cwd(), file)}`);
    }
  } catch (error) {
    failures.push(`Source image cannot be decoded: ${path.relative(process.cwd(), file)} (${error.message})`);
  }
});

const sitemapResponse = await fetch(`${baseUrl}/sitemap.xml`);
if (!sitemapResponse.ok) {
  throw new Error(`Could not load sitemap: HTTP ${sitemapResponse.status}`);
}

const sitemapXml = await sitemapResponse.text();
const routes = [...sitemapXml.matchAll(/<loc>(.*?)<\/loc>/g)].map((match) => new URL(match[1]).pathname);
const renderedImages = new Set();

await runInBatches(routes, 10, async (route) => {
  const response = await fetch(new URL(route, baseUrl));
  if (!response.ok) {
    failures.push(`Page failed: ${route} (HTTP ${response.status})`);
    return;
  }

  const html = await response.text();
  for (const match of html.matchAll(/<img\b[^>]*\bsrc="([^"]+)"/gi)) {
    const src = match[1].replaceAll("&amp;", "&");
    if (!src.startsWith("data:")) renderedImages.add(new URL(src, baseUrl).toString());
  }
});

await runInBatches([...renderedImages], 8, async (imageUrl) => {
  try {
    const response = await fetch(imageUrl);
    const contentType = response.headers.get("content-type") || "";
    const buffer = Buffer.from(await response.arrayBuffer());

    if (!response.ok || !contentType.startsWith("image/") || buffer.length < 100) {
      failures.push(`Rendered image failed: ${imageUrl} (HTTP ${response.status}, ${contentType || "no content type"}, ${buffer.length} bytes)`);
      return;
    }

    const metadata = await sharp(buffer).metadata();
    if (!metadata.width || !metadata.height) {
      failures.push(`Rendered image has invalid dimensions: ${imageUrl}`);
    }
  } catch (error) {
    failures.push(`Rendered image cannot be decoded: ${imageUrl} (${error.message})`);
  }
});

console.log(`Decoded ${sourceFiles.length} source images.`);
console.log(`Checked ${renderedImages.size} rendered image responses across ${routes.length} sitemap pages.`);

if (failures.length) {
  failures.forEach((failure) => console.error(failure));
  process.exitCode = 1;
} else {
  console.log("Image audit passed with no missing, empty or undecodable images.");
}

async function listFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const resolved = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...(await listFiles(resolved)));
    else if (/\.(avif|gif|jpe?g|png|svg|webp)$/i.test(entry.name)) files.push(resolved);
  }

  return files;
}

async function runInBatches(items, batchSize, task) {
  for (let index = 0; index < items.length; index += batchSize) {
    await Promise.all(items.slice(index, index + batchSize).map(task));
  }
}
