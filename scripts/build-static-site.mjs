import { cp, mkdir, rm, stat } from "node:fs/promises";
import { join } from "node:path";

const outputDir = "dist";
const outputFile = join(outputDir, "index.html");

await rm(outputDir, { recursive: true, force: true });
await mkdir(outputDir, { recursive: true });
await cp("index.html", outputFile);

const { size } = await stat(outputFile);
if (size === 0) {
  throw new Error("dist/index.html was created but is empty");
}

console.log(`Built ${outputFile}`);
