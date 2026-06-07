import { readFileSync, readdirSync, statSync, unlinkSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { join, relative, parse } from 'path';

if (!process.env.IMAGEKIT_PRIVATE_KEY) {
  console.error('IMAGEKIT_PRIVATE_KEY missing in environment');
  process.exit(1);
}

const ROOT = join(import.meta.dirname, '..');
const IMAGES_DIR = join(ROOT, 'public', 'images');
const OUTPUT = join(ROOT, 'scripts', 'imagekit_mapping.json');
const FOLDER_PREFIX = '/tilal-web';
const EXTENSIONS = new Set(['.jpg', '.jpeg', '.png', '.webp', '.gif', '.avif']);

function walk(dir) {
  const results = [];
  const entries = readdirSync(dir, { withFileTypes: true });
  for (const e of entries) {
    const full = join(dir, e.name);
    if (e.isDirectory()) {
      results.push(...walk(full));
    } else if (EXTENSIONS.has(parse(e.name).ext.toLowerCase())) {
      results.push(full);
    }
  }
  return results;
}

async function upload(filepath) {
  const file = readFileSync(filepath);
  const base64 = file.toString('base64');
  const name = relative(IMAGES_DIR, filepath).replace(/\\/g, '/');
  const folder = join(FOLDER_PREFIX, parse(name).dir).replace(/\\/g, '/');

  const res = await fetch('https://upload.imagekit.io/api/v1/files/upload', {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${Buffer.from(process.env.IMAGEKIT_PRIVATE_KEY + ':').toString('base64')}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      file: `data:image/${parse(name).ext.slice(1)};base64,${base64}`,
      fileName: parse(name).base,
      folder,
      useUniqueFileName: false,
      overwriteFile: true,
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Upload failed for ${name}: ${err}`);
  }

  return res.json();
}

async function main() {
  const files = walk(IMAGES_DIR);
  console.log(`Found ${files.length} images`);

  const mapping = {};
  let success = 0;
  let failed = 0;

  for (const filepath of files) {
    const localPath = relative(ROOT, filepath).replace(/\\/g, '/');
    try {
      const result = await upload(filepath);
      unlinkSync(filepath);
      mapping[localPath] = result.url;
      success++;
      console.log(`✓ ${localPath} -> ${result.url}`);
    } catch (err) {
      mapping[localPath] = null;
      failed++;
      console.error(`✗ ${localPath}: ${err.message}`);
    }
  }

  const outputDir = parse(OUTPUT).dir;
  if (!existsSync(outputDir)) mkdirSync(outputDir, { recursive: true });

  writeFileSync(OUTPUT, JSON.stringify(mapping, null, 2), 'utf-8');
  console.log(`\nDone: ${success} uploaded, ${failed} failed`);
  console.log(`Mapping saved to ${OUTPUT}`);
}

main().catch(console.error);
