import { strToU8, zipSync } from 'fflate';
import downloadSourceCode from './downloadSource.ts?raw';
import { gitignoreContent } from './gitignoreContent';
import indexHtml from '../index.html?raw';
import packageJson from '../package.json?raw';
import packageLock from '../package-lock.json?raw';
import readme from '../README.md?raw';
import tsconfig from '../tsconfig.json?raw';
import viteConfig from '../vite.config.ts?raw';

// Embed text sources in the app so the archive does not rely on a temporary ZIP file.
const sources = import.meta.glob('./**/*.{ts,tsx,css}', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>;

const imageNames = [
  'bg-paper.jpg',
  'bg-tech.jpg',
  'lamp-desk.jpg',
  'logo-k.png',
  'logo-mark.png',
  'paper-seal.jpg',
  'poster-hall.jpg',
  'poster.jpg',
];

export const sourceArchiveName = 'kaizhixuan-source.zip';

export async function createSourceArchiveUrl(): Promise<string> {
  const files: Record<string, Uint8Array> = {
    '.gitignore': strToU8(gitignoreContent),
    'README.md': strToU8(readme),
    'index.html': strToU8(indexHtml),
    'package.json': strToU8(packageJson),
    'package-lock.json': strToU8(packageLock),
    'tsconfig.json': strToU8(tsconfig),
    'vite.config.ts': strToU8(viteConfig),
    'src/downloadSource.ts': strToU8(downloadSourceCode),
  };

  for (const [path, source] of Object.entries(sources)) {
    files[`src/${path.slice(2)}`] = strToU8(source);
  }

  // Images already load from the preview, so fetch them from the same origin.
  await Promise.all(imageNames.map(async (name) => {
    const response = await fetch(`/images/${name}`);
    if (!response.ok || response.headers.get('content-type')?.includes('text/html')) {
      throw new Error(`无法读取图片 ${name}，请检查预览资源。`);
    }
    files[`public/images/${name}`] = new Uint8Array(await response.arrayBuffer());
  }));

  const zipped = zipSync(files, { level: 1 });
  const buffer = new ArrayBuffer(zipped.byteLength);
  new Uint8Array(buffer).set(zipped);
  return URL.createObjectURL(new Blob([buffer], { type: 'application/zip' }));
}
