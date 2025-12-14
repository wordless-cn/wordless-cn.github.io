import fs from "node:fs";
import path from "node:path";

const sourceDir = path.join(import.meta.dirname, "json-simple");
const targetDir = path.join(import.meta.dirname, "json-bare");

console.log(sourceDir);
console.log(targetDir);

const sourceFiles = fs.readdirSync(sourceDir);

for (const filename of sourceFiles) {
  const sourcePath = path.join(sourceDir, filename);
  const targetPath = path.join(targetDir, filename);
  const data = JSON.parse(fs.readFileSync(sourcePath, "utf-8"));
  const words = [...data].map((x) => x.word);
  if (words.some((x) => typeof x !== "string")) {
    console.log(`invalid data in ${filename}`);
    continue;
  }
  const content = JSON.stringify(words);
  fs.writeFileSync(targetPath, content, "utf-8");
  console.log(`written data from ${filename}`);
}
