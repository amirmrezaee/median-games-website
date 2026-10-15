import { mkdir, copyFile, cp, rm } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { loadCatalog, selectGames, isPromoted } from './catalog.mjs';
import { writeFile } from 'node:fs/promises';
const root = fileURLToPath(new URL('../', import.meta.url));
const output = path.resolve(root, 'dist');
const catalog = await loadCatalog();
// Generated compatibility adapter preserves synchronous browser rendering.
await writeFile(path.join(root, 'games.js'), '// Generated from data/studio.v1.json and scripts/catalog.mjs. Do not edit.\nwindow.MEDIAN_STUDIO = ' + JSON.stringify(catalog) + ';\nwindow.MEDIAN_GAMES = window.MEDIAN_STUDIO.games;\n' + isPromoted.toString() + '\nwindow.MEDIAN_SELECT_GAMES = ' + selectGames.toString() + ';\n');
if (output !== path.join(root, 'dist')) throw new Error('Invalid output path');
await rm(output, { recursive: true, force: true });
await mkdir(output, { recursive: true });
for (const name of ['index.html', 'styles.css', 'games.js', 'app.js', 'motion.css', 'motion.js', '.nojekyll']) await copyFile(path.join(root, name), path.join(output, name));
await cp(path.join(root, 'assets'), path.join(output, 'assets'), { recursive: true });
await cp(path.join(root, 'data'), path.join(output, 'data'), { recursive: true });
console.log('Website ready in dist/');
