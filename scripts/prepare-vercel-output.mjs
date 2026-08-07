import { cp, mkdir, readdir, rm } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const outputDirectory = join(root, 'public');

if (dirname(outputDirectory) !== root) {
  throw new Error('Refusing to prepare output outside the project root.');
}

await rm(outputDirectory, { recursive: true, force: true });
await mkdir(outputDirectory, { recursive: true });

const deployableDirectories = ['assets', 'services'];
const rootEntries = await readdir(root, { withFileTypes: true });
const deployableRootFiles = rootEntries
  .filter(
    (entry) =>
      entry.isFile() &&
      /\.(?:html|svg|txt|xml)$/i.test(entry.name),
  )
  .map((entry) => entry.name);

for (const directory of deployableDirectories) {
  await cp(join(root, directory), join(outputDirectory, directory), {
    recursive: true,
  });
}

for (const file of deployableRootFiles) {
  await cp(join(root, file), join(outputDirectory, file));
}

console.log(
  `Prepared Vercel output in public/ with ${deployableRootFiles.length} root files and ${deployableDirectories.length} asset directories.`,
);
