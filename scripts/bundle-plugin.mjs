#!/usr/bin/env node

/**
 * Bundle a CodeLatch adapter plugin into a single ES module for production.
 *
 * OpenCode runs on Bun which natively transpiles TypeScript, so local
 * development can load source files directly. Production distribution needs
 * all workspace dependencies collapsed into a single consumable module.
 *
 * Usage:
 *   node scripts/bundle-plugin.mjs adapter-opencode
 *   node scripts/bundle-plugin.mjs adapter-kilocode
 *
 * Output:
 *   packages/<adapter>/dist/plugin.js  — bundled ES module
 *   packages/<adapter>/dist/plugin.js.map — source map
 */

import { build } from 'esbuild';
import { readdir, writeFile, mkdir } from 'fs/promises';
import { join, resolve } from 'path';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);

const ADAPTERS = ['adapter-opencode', 'adapter-kilocode'];

const adapterName = process.argv[2];

if (!adapterName) {
  console.error('Usage: node scripts/bundle-plugin.mjs <adapter-name>');
  console.error(`Available adapters: ${ADAPTERS.join(', ')}`);
  process.exit(1);
}

if (!ADAPTERS.includes(adapterName)) {
  console.error(`Unknown adapter: ${adapterName}`);
  console.error(`Available adapters: ${ADAPTERS.join(', ')}`);
  process.exit(1);
}

const projectRoot = resolve(import.meta.dirname, '..');
const adapterDir = join(projectRoot, 'packages', adapterName);
const entryPoint = join(adapterDir, 'src', 'plugin', 'index.ts');
const outDir = join(adapterDir, 'dist');

// Workspace packages that need to be bundled (not externalized)
const WORKSPACE_PACKAGES = [
  '@codelatch/core',
  '@codelatch/workflow-contracts',
  '@codelatch/schemas',
  '@codelatch/adapter-base',
  '@codelatch/shared-utils'
];

async function bundle() {
  console.log(`Bundling ${adapterName}...`);
  console.log(`  Entry: ${entryPoint}`);
  console.log(`  Output: ${outDir}/plugin.js`);

  await mkdir(outDir, { recursive: true });

  const result = await build({
    entryPoints: [entryPoint],
    bundle: true,
    outfile: join(outDir, 'plugin.js'),
    format: 'esm',
    platform: 'node',
    target: 'bun1',
    sourcemap: true,
    // Bundle all workspace packages — they are implementation deps,
    // not peer deps that the host provides.
    external: [
      // Only externalize truly external packages (none currently)
    ],
    // Mark workspace packages as not external so they get bundled
    packages: 'bundle',
    define: {
      // Replace process.env.NODE_ENV for production
      'process.env.NODE_ENV': '"production"'
    },
    logLevel: 'info',
    metafile: true
  });

  // Write a package.json in dist/ for OpenCode plugin resolution
  const distPackageJson = {
    name: `@codelatch/${adapterName}`,
    main: 'plugin.js',
    type: 'module'
  };

  await writeFile(
    join(outDir, 'package.json'),
    JSON.stringify(distPackageJson, null, 2)
  );

  console.log(`\nBundle complete!`);
  console.log(`  Output: ${outDir}/plugin.js`);
  console.log(`  Package: ${outDir}/package.json`);

  if (result.metafile) {
    const bytes = Object.values(result.metafile.outputs)
      .reduce((sum, o) => sum + (o.bytes || 0), 0);
    console.log(`  Size: ${(bytes / 1024).toFixed(1)} KB`);
  }
}

bundle().catch((err) => {
  console.error('Bundle failed:', err);
  process.exit(1);
});