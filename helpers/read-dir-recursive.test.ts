import { assertEquals } from "https://deno.land/std@0.159.0/testing/asserts.ts";

import { readDirRecursiveSync } from "./read-dir-recursive.ts";

Deno.test("readDirRecursiveSync", function () {
  const dirEntryList = readDirRecursiveSync("./test-directory");
  assertEquals(dirEntryList[0], {
    isDirectory: false,
    isFile: true,
    isSymlink: false,
    name: "test-file.json",
    path: "./test-directory/test-file.json",
  });
});
