import { assertEquals } from "https://deno.land/std@0.159.0/testing/asserts.ts";

import { readJSONFromFile } from "./read-json-from-file.ts";

Deno.test("readJSONFromFile", function () {
  const contents = readJSONFromFile("./test-directory/test-file.json");
  assertEquals(contents.hello, "world!");
});
