interface DirEntry extends Deno.DirEntry {
  path: string;
}

export function readDirRecursiveSync(path: string): DirEntry[] {
  const entryList: DirEntry[] = [];

  for (const dirEntry of Deno.readDirSync(path)) {
    entryList.push({ ...dirEntry, path: `${path}/${dirEntry.name}` });
    if (dirEntry.isDirectory) {
      entryList.push(...readDirRecursiveSync(`${path}/${dirEntry.name}`));
    }
  }

  return entryList;
}
