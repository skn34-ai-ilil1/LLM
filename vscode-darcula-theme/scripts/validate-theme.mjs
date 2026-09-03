import fs from "node:fs";
import path from "node:path";
import process from "node:process";

const root = path.resolve(import.meta.dirname, "..");
const manifestPath = path.join(root, "package.json");
const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
const errors = [];

const kotlinColors = {
  "pyDarcula.kotlin.annotation": { dark: "#BBB529", light: "#777200" },
  "pyDarcula.kotlin.namedArgument": { dark: "#467CDA", light: "#2F5EAE" },
  "pyDarcula.kotlin.classDeclaration": { dark: "#A9B7C6", light: "#52606D" },
  "pyDarcula.kotlin.receiver": { dark: "#CC7832", light: "#9A4E0D" },
};

const semanticForeground = (rule) => (typeof rule === "string" ? rule : rule?.foreground);

const requiredManifestFields = ["name", "displayName", "version", "publisher", "engines"];
for (const field of requiredManifestFields) {
  if (!manifest[field]) errors.push(`package.json is missing ${field}`);
}

if (Object.prototype.hasOwnProperty.call(manifest, "__metadata")) {
  errors.push("package.json must not contain installed-extension __metadata.");
}

for (const field of ["main", "browser"]) {
  const runtime = manifest[field];
  if (typeof runtime !== "string" || runtime.length === 0) {
    errors.push(`package.json is missing ${field} runtime entry.`);
  } else {
    const runtimePath = path.resolve(root, runtime);
    if (!fs.existsSync(runtimePath) || !fs.statSync(runtimePath).isFile()) {
      errors.push(`${field} runtime does not exist: ${runtime}`);
    }
  }
}

if (!(manifest.activationEvents ?? []).includes("onLanguage:kotlin")) {
  errors.push("package.json must activate onLanguage:kotlin.");
}

const pylanceExtensionId = "ms-python.vscode-pylance";
if (!(manifest.extensionDependencies ?? []).includes(pylanceExtensionId)) {
  errors.push(`package.json must depend on ${pylanceExtensionId}.`);
}

const contributions = manifest.contributes ?? {};
const contributedColors = new Map(
  (contributions.colors ?? []).map((color) => [color?.id, color]),
);
for (const [id, expectedDefaults] of Object.entries(kotlinColors)) {
  const contribution = contributedColors.get(id);
  if (!contribution) {
    errors.push(`package.json must contribute color ${id}.`);
    continue;
  }
  for (const [variant, expectedColor] of Object.entries(expectedDefaults)) {
    if (contribution.defaults?.[variant] !== expectedColor) {
      errors.push(`${id} ${variant} default must use ${expectedColor}.`);
    }
  }
}

const kotlinDecorationSetting =
  contributions.configuration?.properties?.["pyDarcula.kotlinDecorations.enabled"];
if (kotlinDecorationSetting?.type !== "boolean" || kotlinDecorationSetting?.default !== true) {
  errors.push("pyDarcula.kotlinDecorations.enabled must be a boolean that defaults to true.");
}

const kotlinLanguage = (contributions.languages ?? []).find((language) => language?.id === "kotlin");
if (!kotlinLanguage) {
  errors.push("package.json must contribute the Kotlin language.");
} else {
  for (const extension of [".kt", ".kts"]) {
    if (!(kotlinLanguage.extensions ?? []).includes(extension)) {
      errors.push(`Kotlin language contribution must include ${extension}.`);
    }
  }
}

const configurationDefaults = contributions.configurationDefaults ?? {};
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

  for (const [id, expectedDefaults] of Object.entries(kotlinColors)) {
    if (theme.colors?.[id] !== expectedDefaults.dark) {
      errors.push(`Theme color ${id} must use ${expectedDefaults.dark}.`);
    }
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

  const pythonSelfRule = theme.tokenColors?.find(
    (rule) => rule.name === "Python Darcula self and cls",
  );
  const pythonSelfScopes = Array.isArray(pythonSelfRule?.scope)
    ? pythonSelfRule.scope
    : [pythonSelfRule?.scope];
  const requiredPythonSelfScopes = [
    "variable.parameter.function.language.special.self.python",
    "variable.parameter.function.language.special.cls.python",
    "variable.language.special.self.python",
    "variable.language.special.cls.python",
  ];
  for (const scope of requiredPythonSelfScopes) {
    if (!pythonSelfScopes.includes(scope)) {
      errors.push(`Python self/cls rule must include ${scope}.`);
    }
  }
  if (pythonSelfRule?.settings?.foreground !== "#CC7832") {
    errors.push("Python TextMate self and cls must use #CC7832.");
  }

  const representativeKotlinSemanticRules = {
    "comment:kotlin": "#808080",
    "keyword:kotlin": "#CC7832",
    "string:kotlin": "#6A8759",
    "class:kotlin": "#769AA5",
    "class.declaration:kotlin": "#A9B7C6",
    "parameter:kotlin": "#9876AA",
    "property:kotlin": "#9876AA",
    "function:kotlin": "#FFC66D",
    "decorator:kotlin": "#BBB529",
  };
  for (const [selector, expectedColor] of Object.entries(representativeKotlinSemanticRules)) {
    const actualColor = semanticForeground(theme.semanticTokenColors?.[selector]);
    if (actualColor !== expectedColor) {
      errors.push(`Semantic token ${selector} must use ${expectedColor}.`);
    }
  }

  for (const selector of ["selfParameter:python", "clsParameter:python"]) {
    if (semanticForeground(theme.semanticTokenColors?.[selector]) !== "#CC7832") {
      errors.push(`Semantic token ${selector} must use #CC7832.`);
    }
  }

  for (const selector of ["function.builtin:python", "method.builtin:python"]) {
    if (semanticForeground(theme.semanticTokenColors?.[selector]) !== "#8888C6") {
      errors.push(`Semantic token ${selector} must use #8888C6.`);
    }
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
