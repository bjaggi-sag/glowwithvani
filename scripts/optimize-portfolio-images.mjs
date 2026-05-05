import { existsSync, mkdirSync, readdirSync, readFileSync, rmSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');
const contentDir = path.join(rootDir, 'content', 'portfolio');
const publicDir = path.join(rootDir, 'public');
const outputDir = path.join(publicDir, 'portfolio', 'optimized');

const maxWidth = 1800;
const quality = 82;

function readPortfolioEntries() {
  const files = readdirSync(contentDir).filter((file) => file.endsWith('.json')).sort();
  return files.map((file) => {
    const filePath = path.join(contentDir, file);
    const raw = JSON.parse(readFileSync(filePath, 'utf8'));
    return raw;
  });
}

async function optimizeEntry(entry) {
  const relativeSourcePath = String(entry.sourceImage).replace(/^\//, '');
  const sourcePath = path.join(publicDir, relativeSourcePath);

  if (!existsSync(sourcePath)) {
    throw new Error(`Missing source image for ${entry.slug}: ${sourcePath}`);
  }

  const outputPath = path.join(outputDir, `${entry.slug}.webp`);

  await sharp(sourcePath)
    .rotate()
    .resize({ width: maxWidth, height: maxWidth, fit: 'inside', withoutEnlargement: true })
    .webp({ quality, effort: 5 })
    .toFile(outputPath);
}

async function main() {
  mkdirSync(outputDir, { recursive: true });
  rmSync(outputDir, { recursive: true, force: true });
  mkdirSync(outputDir, { recursive: true });

  const entries = readPortfolioEntries();

  for (const entry of entries) {
    await optimizeEntry(entry);
    console.log(`Optimized ${entry.slug}`);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
