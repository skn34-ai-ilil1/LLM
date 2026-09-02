"use strict";

const THEME_NAME = "Py Darcula Classic";
const KOTLIN_LANGUAGE_ID = "kotlin";
const REFRESH_DELAY_MS = 80;

const COLOR_IDS = Object.freeze({
  annotations: "pyDarcula.kotlin.annotation",
  namedArguments: "pyDarcula.kotlin.namedArgument",
  classDeclarations: "pyDarcula.kotlin.classDeclaration",
  receivers: "pyDarcula.kotlin.receiver",
});

const KOTLIN_USE_SITE_TARGETS = new Set([
  "file",
  "field",
  "property",
  "get",
  "set",
  "receiver",
  "param",
  "setparam",
  "delegate",
]);

const CONTROL_PARENTHESES = new Set(["if", "when", "while", "for", "catch"]);
const DECLARATION_KEYWORDS = /\b(fun|class|interface|object|typealias|constructor)\b/g;
const IDENTIFIER_START = /[\p{L}\p{Nl}_$]/u;
const IDENTIFIER_CONTINUE = /[\p{L}\p{Nl}\p{Nd}\p{Mn}\p{Mc}\p{Pc}_$]/u;

function codePointAt(text, index) {
  const value = text.codePointAt(index);
  return value === undefined ? "" : String.fromCodePoint(value);
}

function isIdentifierStart(character) {
  return character !== "" && IDENTIFIER_START.test(character);
}

function isIdentifierContinue(character) {
  return character !== "" && IDENTIFIER_CONTINUE.test(character);
}

function readIdentifier(text, index) {
  if (text[index] === "`") {
    const closing = text.indexOf("`", index + 1);
    if (closing === -1 || /[\r\n]/.test(text.slice(index + 1, closing))) {
      return null;
    }
    return {
      start: index,
      end: closing + 1,
      value: text.slice(index + 1, closing),
    };
  }

  const first = codePointAt(text, index);
  if (!isIdentifierStart(first)) {
    return null;
  }

  let end = index + first.length;
  while (end < text.length) {
    const character = codePointAt(text, end);
    if (!isIdentifierContinue(character)) {
      break;
    }
    end += character.length;
  }

  return {
    start: index,
    end,
    value: text.slice(index, end),
  };
}

function skipWhitespace(text, index) {
  let cursor = index;
  while (cursor < text.length && /\s/.test(text[cursor])) {
    cursor += 1;
  }
  return cursor;
}

function skipWhitespaceBackward(text, index) {
  let cursor = index;
  while (cursor > 0 && /\s/.test(text[cursor - 1])) {
    cursor -= 1;
  }
  return cursor;
}

function readIdentifierBefore(text, index) {
  const end = skipWhitespaceBackward(text, index);
  if (end === 0) {
    return null;
  }

  if (text[end - 1] === "`") {
    const opening = text.lastIndexOf("`", end - 2);
    if (opening === -1 || /[\r\n]/.test(text.slice(opening + 1, end - 1))) {
      return null;
    }
    return {
      start: opening,
      end,
      value: text.slice(opening + 1, end - 1),
    };
  }

  let start = end;
  while (start > 0 && isIdentifierContinue(text[start - 1])) {
    start -= 1;
  }
  if (start === end || !isIdentifierStart(text[start])) {
    return null;
  }

  return {
    start,
    end,
    value: text.slice(start, end),
  };
}

function blank(mask, index) {
  if (mask[index] !== "\r" && mask[index] !== "\n") {
    mask[index] = " ";
  }
}

function maskNonCode(source) {
  const mask = source.split("");
  let index = 0;

  while (index < source.length) {
    if (source.startsWith("//", index)) {
      while (index < source.length && source[index] !== "\r" && source[index] !== "\n") {
        blank(mask, index);
        index += 1;
      }
      continue;
    }

    if (source.startsWith("/*", index)) {
      let depth = 0;
      while (index < source.length) {
        if (source.startsWith("/*", index)) {
          depth += 1;
          blank(mask, index);
          blank(mask, index + 1);
          index += 2;
          continue;
        }
        if (source.startsWith("*/", index)) {
          depth -= 1;
          blank(mask, index);
          blank(mask, index + 1);
          index += 2;
          if (depth === 0) {
            break;
          }
          continue;
        }
        blank(mask, index);
        index += 1;
      }
      continue;
    }

    if (source.startsWith('\"\"\"', index)) {
      for (let offset = 0; offset < 3; offset += 1) {
        blank(mask, index + offset);
      }
      index += 3;
      while (index < source.length && !source.startsWith('\"\"\"', index)) {
        blank(mask, index);
        index += 1;
      }
      if (source.startsWith('\"\"\"', index)) {
        for (let offset = 0; offset < 3; offset += 1) {
          blank(mask, index + offset);
        }
        index += 3;
      }
      continue;
    }

    if (source[index] === '\"' || source[index] === "'") {
      const quote = source[index];
      blank(mask, index);
      index += 1;
      while (index < source.length) {
        const character = source[index];
        blank(mask, index);
        index += 1;
        if (character === "\\" && index < source.length) {
          blank(mask, index);
          index += 1;
          continue;
        }
        if (character === quote || character === "\r" || character === "\n") {
          break;
        }
      }
      continue;
    }

    index += 1;
  }

  return mask.join("");
}

function findAnnotations(masked) {
  const ranges = [];

  for (let index = 0; index < masked.length; index += 1) {
    if (masked[index] !== "@") {
      continue;
    }

    const previous = index > 0 ? codePointAt(masked, index - 1) : "";
    if (isIdentifierContinue(previous)) {
      continue;
    }

    let cursor = index + 1;
    let identifier = readIdentifier(masked, cursor);
    if (!identifier) {
      continue;
    }

    cursor = identifier.end;
    if (KOTLIN_USE_SITE_TARGETS.has(identifier.value) && masked[cursor] === ":") {
      cursor += 1;
      identifier = readIdentifier(masked, cursor);
      if (!identifier) {
        continue;
      }
      cursor = identifier.end;
    }

    while (true) {
      const dot = skipWhitespace(masked, cursor);
      if (masked[dot] !== ".") {
        break;
      }
      const next = readIdentifier(masked, skipWhitespace(masked, dot + 1));
      if (!next) {
        break;
      }
      cursor = next.end;
    }

    ranges.push({ start: index, end: cursor });
    index = cursor - 1;
  }

  return ranges;
}

function findClassDeclarations(masked) {
  const ranges = [];
  let index = 0;

  while (index < masked.length) {
    const identifier = readIdentifier(masked, index);
    if (!identifier) {
      index += codePointAt(masked, index).length || 1;
      continue;
    }

    if (["class", "interface", "object", "typealias"].includes(identifier.value)) {
      const declared = readIdentifier(masked, skipWhitespace(masked, identifier.end));
      if (declared) {
        ranges.push({ start: declared.start, end: declared.end });
        index = declared.end;
        continue;
      }
    }

    index = identifier.end;
  }

  return ranges;
}

function findReceivers(masked) {
  const ranges = [];
  let index = 0;

  while (index < masked.length) {
    const identifier = readIdentifier(masked, index);
    if (!identifier) {
      index += codePointAt(masked, index).length || 1;
      continue;
    }
    if (identifier.value === "this" || identifier.value === "super") {
      ranges.push({ start: identifier.start, end: identifier.end });
    }
    index = identifier.end;
  }

  return ranges;
}

function findStatementBoundary(text, index) {
  return Math.max(
    text.lastIndexOf("{", index - 1),
    text.lastIndexOf("}", index - 1),
    text.lastIndexOf(";", index - 1),
    text.lastIndexOf("=", index - 1),
  ) + 1;
}

function hasTopLevelColon(text, start) {
  let angleDepth = 0;
  for (let index = start; index < text.length; index += 1) {
    if (text[index] === "<") {
      angleDepth += 1;
    } else if (text[index] === ">" && angleDepth > 0) {
      angleDepth -= 1;
    } else if (text[index] === ":" && angleDepth === 0) {
      return true;
    }
  }
  return false;
}

function isDeclarationParenthesis(masked, index) {
  const boundary = findStatementBoundary(masked, index);
  const segment = masked.slice(boundary, index);
  let declaration = null;
  DECLARATION_KEYWORDS.lastIndex = 0;
  for (let match = DECLARATION_KEYWORDS.exec(segment); match; match = DECLARATION_KEYWORDS.exec(segment)) {
    declaration = { keyword: match[1], end: match.index + match[0].length };
  }

  if (!declaration) {
    return false;
  }
  if (declaration.keyword === "fun" || declaration.keyword === "constructor") {
    return true;
  }
  return !hasTopLevelColon(segment, declaration.end);
}

function isCallParenthesis(masked, index) {
  const previousEnd = skipWhitespaceBackward(masked, index);
  if (previousEnd === 0) {
    return false;
  }

  const previousIdentifier = readIdentifierBefore(masked, previousEnd);
  if (previousIdentifier && CONTROL_PARENTHESES.has(previousIdentifier.value)) {
    return false;
  }
  if (isDeclarationParenthesis(masked, index)) {
    return false;
  }
  if (previousIdentifier && previousIdentifier.end === previousEnd) {
    return true;
  }

  return [")", "]", "}", ">"].includes(masked[previousEnd - 1]);
}

function isNamedArgumentLabel(masked, identifier, frames) {
  const currentFrame = frames[frames.length - 1];
  if (!currentFrame || currentFrame.character !== "(" || !currentFrame.call) {
    return false;
  }

  const before = skipWhitespaceBackward(masked, identifier.start);
  if (before === 0 || !["(", ","].includes(masked[before - 1])) {
    return false;
  }

  const equals = skipWhitespace(masked, identifier.end);
  return masked[equals] === "=" && masked[equals + 1] !== "=" && masked[equals + 1] !== ">";
}

function findNamedArguments(masked) {
  const ranges = [];
  const frames = [];
  const matchingOpening = { ")": "(", "]": "[", "}": "{" };
  let index = 0;

  while (index < masked.length) {
    const character = masked[index];

    if (character === "(" || character === "[" || character === "{") {
      frames.push({
        character,
        call: character === "(" && isCallParenthesis(masked, index),
      });
      index += 1;
      continue;
    }

    if (character === ")" || character === "]" || character === "}") {
      const opening = matchingOpening[character];
      while (frames.length > 0) {
        const frame = frames.pop();
        if (frame.character === opening) {
          break;
        }
      }
      index += 1;
      continue;
    }

    const identifier = readIdentifier(masked, index);
    if (identifier) {
      if (isNamedArgumentLabel(masked, identifier, frames)) {
        ranges.push({ start: identifier.start, end: identifier.end });
      }
      index = identifier.end;
      continue;
    }

    index += codePointAt(masked, index).length || 1;
  }

  return ranges;
}

function analyzeKotlin(source) {
  const masked = maskNonCode(source);
  return {
    annotations: findAnnotations(masked),
    namedArguments: findNamedArguments(masked),
    classDeclarations: findClassDeclarations(masked),
    receivers: findReceivers(masked),
  };
}

function toVsCodeRanges(vscode, document, offsets) {
  return offsets.map(({ start, end }) => new vscode.Range(document.positionAt(start), document.positionAt(end)));
}

function activate(context) {
  // Keep the parser importable in plain Node tests; VS Code is only required at activation time.
  const vscode = require("vscode");
  const decorations = Object.fromEntries(
    Object.entries(COLOR_IDS).map(([name, colorId]) => [
      name,
      vscode.window.createTextEditorDecorationType({ color: new vscode.ThemeColor(colorId) }),
    ]),
  );
  let refreshTimer = null;

  function shouldDecorate() {
    const activeTheme = vscode.workspace.getConfiguration("workbench").get("colorTheme");
    const enabled = vscode.workspace
      .getConfiguration("pyDarcula")
      .get("kotlinDecorations.enabled", true);
    return activeTheme === THEME_NAME && enabled;
  }

  function clearEditor(editor) {
    for (const decoration of Object.values(decorations)) {
      editor.setDecorations(decoration, []);
    }
  }

  function refreshEditor(editor, enabled) {
    if (!enabled || editor.document.languageId !== KOTLIN_LANGUAGE_ID) {
      clearEditor(editor);
      return;
    }

    const analysis = analyzeKotlin(editor.document.getText());
    for (const [name, offsets] of Object.entries(analysis)) {
      editor.setDecorations(decorations[name], toVsCodeRanges(vscode, editor.document, offsets));
    }
  }

  function refreshVisibleEditors() {
    const enabled = shouldDecorate();
    for (const editor of vscode.window.visibleTextEditors) {
      refreshEditor(editor, enabled);
    }
  }

  function scheduleRefresh() {
    if (refreshTimer !== null) {
      clearTimeout(refreshTimer);
    }
    refreshTimer = setTimeout(() => {
      refreshTimer = null;
      refreshVisibleEditors();
    }, REFRESH_DELAY_MS);
  }

  context.subscriptions.push(
    ...Object.values(decorations),
    vscode.window.onDidChangeVisibleTextEditors(refreshVisibleEditors),
    vscode.workspace.onDidChangeTextDocument((event) => {
      if (event.document.languageId === KOTLIN_LANGUAGE_ID) {
        scheduleRefresh();
      }
    }),
    vscode.workspace.onDidChangeConfiguration((event) => {
      if (
        event.affectsConfiguration("workbench.colorTheme") ||
        event.affectsConfiguration("pyDarcula.kotlinDecorations.enabled")
      ) {
        refreshVisibleEditors();
      }
    }),
    {
      dispose() {
        if (refreshTimer !== null) {
          clearTimeout(refreshTimer);
          refreshTimer = null;
        }
      },
    },
  );

  refreshVisibleEditors();
}

function deactivate() {}

module.exports = {
  activate,
  deactivate,
  analyzeKotlin,
  maskNonCode,
};
