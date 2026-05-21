import sharp from 'sharp';
import { statSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const assetsDir = resolve(__dirname, '..', 'src', 'assets');

const files = [
  'hero-bg.png',
  'unthai-ai-automation-bg.png',
  'unthai-cinematic-bg.png',
];

for (const f of files) {
  const inPath = resolve(assetsDir, f);
  const outPath = inPath.replace(/\.png$/, '.webp');
  const before = statSync(inPath).size;
  await sharp(inPath).webp({ quality: 82, effort: 6 }).toFile(outPath);
  const after = statSync(outPath).size;
  console.log(`${f}: ${(before/1024).toFixed(1)}KB -> ${(after/1024).toFixed(1)}KB (${outPath.split('/').pop()})`);
}
