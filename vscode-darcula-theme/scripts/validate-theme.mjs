import fs from "node:fs";
import path from "node:path";
import process from "node:process";

const root = path.resolve(import.meta.dirname, "..");
const manifestPath = path.join(root, "package.json");
const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
const errors = [];

const requiredManifestFields = ["name", "displayName", "version", "publisher", "engines"];
for (const field of requiredManifestFields) {
  if (!manifest[field]) errors.push(`package.json is missing ${field}`);
}

const pylanceExtensionId = "ms-python.vscode-pylance";
if (!(manifest.extensionDependencies ?? []).includes(pylanceExtensionId)) {
  errors.push(`package.json must depend on ${pylanceExtensionId}.`);
}

const configurationDefaults = manifest.contributes?.configurationDefaults ?? {};
const pythonEditorDefaults = configurationDefaults["[python]"] ?? {};
if (pythonEditorDefaults["editor.inlayHints.enabled"] !== "on") {
  errors.push("Python inlay hints must default to 'on'.");
}
if (pythonEditorDefaults["editor.inlayHints.padding"] !== true) {
  errors.push("Python inlay-hint padding must default to true.");
}
if (configurationDefaults["python.analysis.inlayHints.callArgumentNames"] !== "all") {
  errors.push("Pylance call-argument-name hints must default to 'all'.");
}

const themes = manifest.contributes?.themes ?? [];
if (themes.length !== 1) errors.push("Exactly one color theme must be contributed.");

for (const contribution of themes) {
  const themePath = path.join(root, contribution.path);
  if (!fs.existsSync(themePath)) {
    errors.push(`Theme file does not exist: ${contribution.path}`);
    continue;
  }

  const theme = JSON.parse(fs.readFileSync(themePath, "utf8"));
  if (theme.name !== contribution.label) {
    errors.push(`Theme name '${theme.name}' does not match label '${contribution.label}'.`);
  }
  if (theme.type !== "dark") errors.push("Theme type must be 'dark'.");
  if (!theme.colors || !theme.tokenColors || !theme.semanticTokenColors) {
    errors.push("Theme must include colors, tokenColors, and semanticTokenColors.");
  }

  const jsxAttributeRule = theme.tokenColors?.find(
    (rule) => rule.name === "Android Studio Classic Darcula JSX attribute names",
  );
  const jsxAttributeScopes = Array.isArray(jsxAttributeRule?.scope)
    ? jsxAttributeRule.scope
    : [jsxAttributeRule?.scope];
  for (const scope of ["entity.other.attribute-name.js.jsx", "entity.other.attribute-name.tsx"]) {
    if (!jsxAttributeScopes.includes(scope)) {
      errors.push(`JSX attribute rule must include ${scope}.`);
    }
  }
  if (jsxAttributeRule?.settings?.foreground !== "#467CDA") {
    errors.push("JSX attribute names must use #467CDA.");
  }
}

const iconPath = path.join(root, manifest.icon ?? "");
if (!manifest.icon || !fs.existsSync(iconPath)) {
  errors.push("Marketplace icon is missing.");
} else {
  const header = fs.readFileSync(iconPath).subarray(0, 24);
  const pngSignature = "89504e470d0a1a0a";
  if (header.subarray(0, 8).toString("hex") !== pngSignature) {
    errors.push("Marketplace icon must be a PNG file.");
  } else {
    const width = header.readUInt32BE(16);
    const height = header.readUInt32BE(20);
    if (width < 128 || height < 128) errors.push("Marketplace icon must be at least 128x128.");
    if (width !== height) errors.push("Marketplace icon must be square.");
  }
}

for (const requiredFile of ["README.md", "LICENSE", "CHANGELOG.md", "SUPPORT.md", "THIRD_PARTY_NOTICES.md", "licenses/Apache-2.0.txt"]) {
  if (!fs.existsSync(path.join(root, requiredFile))) errors.push(`${requiredFile} is missing.`);
}

if (errors.length > 0) {
  console.error(errors.map((error) => `ERROR: ${error}`).join("\n"));
  process.exit(1);
}

console.log(`Validated ${manifest.publisher}.${manifest.name}@${manifest.version}`);
