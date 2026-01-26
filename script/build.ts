import { build } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.resolve(__dirname, '..');

async function buildApp() {
  try {
    console.log('Starting build...');
    await build({
      configFile: path.resolve(root, 'vite.config.ts'),
      root: path.resolve(root, 'client'),
      build: {
        outDir: path.resolve(root, 'dist/public'),
        emptyOutDir: true,
      }
    });
    console.log('Build completed successfully!');
  } catch (error) {
    console.error('Build failed:', error);
    process.exit(1);
  }
}

buildApp();
