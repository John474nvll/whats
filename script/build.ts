import { build } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import { exec } from 'child_process';

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

    // Build server
    await new Promise((resolve, reject) => {
      const esbuildProcess = exec(
        'esbuild server/index.ts --bundle --platform=node --outfile=dist/index.cjs --format=cjs',
        { cwd: root },
        (error, stdout, stderr) => {
          if (error) {
            console.error('Server build failed:');
            console.error(stderr);
            console.error(stdout);
            reject(error);
          } else {
            console.log(stdout);
            resolve(undefined);
          }
        }
      );
    });

    console.log('Build completed successfully!');
  } catch (error) {
    console.error('Build failed:', error);
    process.exit(1);
  }
}

buildApp();
