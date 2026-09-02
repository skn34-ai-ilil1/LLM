import fs from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const sourcePath = path.join(root, "src", "extension.js");
const outputPath = path.join(root, "dist", "extension.js");

const source = fs.readFileSync(sourcePath, "utf8");
const output = `${source.replace(/^\uFEFF/, "").replace(/\r\n?/g, "\n").replace(/\n*$/, "")}\n`;

fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(outputPath, output, "utf8");

console.log("Built dist/extension.js from src/extension.js");
