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

async function optimizeEntry(entry, destination = outputDir) {
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(entry.slug)) throw new Error('Image slug must be kebab-case');
  const relativeSourcePath = String(entry.sourceImage).replace(/^\//, '');
  const sourcePath = path.resolve(publicDir, relativeSourcePath);
  if (!sourcePath.startsWith(path.join(publicDir, 'portfolio', 'originals') + path.sep)) {
    throw new Error(`Source image must be inside portfolio/originals: ${entry.slug}`);
  }

  if (!existsSync(sourcePath)) {
    throw new Error(`Missing source image for ${entry.slug}: ${sourcePath}`);
  }

  const outputPath = path.join(destination, `${entry.slug}.webp`);

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

  const projectContent = path.join(rootDir, 'content', 'projects');
  const projectOutput = path.join(publicDir, 'projects', 'optimized');
  rmSync(projectOutput, { recursive: true, force: true });
  mkdirSync(projectOutput, { recursive: true });
  if (existsSync(projectContent)) {
    for (const file of readdirSync(projectContent).filter((file) => file.endsWith('.json'))) {
      const project = JSON.parse(readFileSync(path.join(projectContent, file), 'utf8'));
      if (project.published !== true || !project.coverImage) continue;
      await optimizeEntry({ slug: project.slug, sourceImage: project.coverImage }, projectOutput);
      console.log(`Optimized project cover ${project.slug}`);
    }
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
