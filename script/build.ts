import { build } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import { build as esbuild } from 'esbuild';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.resolve(__dirname, '..');

async function buildApp() {
  try {
    console.log('Starting build...');

    // Build client
    await build({
      configFile: path.resolve(root, 'vite.config.ts'),
      root: path.resolve(root, 'client'),
      build: {
        outDir: path.resolve(root, 'dist/public'),
        emptyOutDir: true,
      }
    });

    // Read package.json and parse it
    const packageJson = JSON.parse(fs.readFileSync(path.resolve(root, 'package.json'), 'utf-8'));

    // Build server
    await esbuild({
      entryPoints: [path.resolve(root, 'server/index.ts')],
      bundle: true,
      platform: 'node',
      outfile: path.resolve(root, 'dist/index.cjs'),
      format: 'cjs',
      external: Object.keys(packageJson.dependencies),
    });

    console.log('Build completed successfully!');
  } catch (error) {
    console.error('Build failed:', error);
    process.exit(1);
  }
}

buildApp();
