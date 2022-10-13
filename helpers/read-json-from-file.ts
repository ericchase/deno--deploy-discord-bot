export function readJSONFromFile(path: string) {
  return JSON.parse(Deno.readTextFileSync(path));
}
