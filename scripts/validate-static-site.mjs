import { readFile } from "node:fs/promises";

const html = await readFile("index.html", "utf8");
const workflow = await readFile(".github/workflows/static.yml", "utf8");

const checks = [
  [html.startsWith("<!DOCTYPE html>"), "index.html must start with a doctype"],
  [/<html\s+lang="en">/.test(html), "index.html must declare lang=\"en\""],
  [/<meta\s+name="viewport"/.test(html), "index.html must include a viewport meta tag"],
  [/<title>[^<]+<\/title>/.test(html), "index.html must include a title"],
  [/<div class="deck">/.test(html), "index.html must include the deck root"],
  [/<script>[\s\S]*<\/script>/.test(html), "index.html must include its navigation script"],
  [html.trim().endsWith("</html>"), "index.html must close the html document"],
  [workflow.includes("npm test"), "workflow must run regression checks"],
  [workflow.includes("npm run build"), "workflow must build the static artifact"],
  [workflow.includes("path: dist"), "workflow must publish only the dist directory"],
  [!workflow.includes("path: '.'"), "workflow must not upload the repository root"]
];

const failures = checks.filter(([passed]) => !passed).map(([, message]) => message);

if (failures.length > 0) {
  throw new Error(`Static site validation failed:\n- ${failures.join("\n- ")}`);
}

console.log("Static site validation passed");
