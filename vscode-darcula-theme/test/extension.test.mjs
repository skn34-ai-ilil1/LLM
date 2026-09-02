import assert from "node:assert/strict";
import test from "node:test";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const { analyzeKotlin, maskNonCode } = require("../src/extension.js");

function selectedText(source, ranges) {
  return ranges.map(({ start, end }) => source.slice(start, end));
}

test("maskNonCode preserves offsets and newlines while hiding comments and strings", () => {
  const source = [
    'val text = "@Hidden(fake = true)"',
    "/* outer @Ignored /* nested this */ super */",
    "// class Phantom",
    "call(real = this)",
    "",
  ].join("\n");
  const masked = maskNonCode(source);

  assert.equal(masked.length, source.length);
  assert.deepEqual(
    [...masked].flatMap((character, index) => (character === "\n" ? [index] : [])),
    [...source].flatMap((character, index) => (character === "\n" ? [index] : [])),
  );
  assert.doesNotMatch(masked, /Hidden|Ignored|Phantom/);
  assert.match(masked, /call\(real = this\)/);
});

test("analyzeKotlin finds annotations, use-site targets, declarations, and receivers", () => {
  const source = [
    '@file:JvmName("Demo")',
    "@Composable",
    "class Screen : Base() {",
    "  interface Nested",
    "  object Singleton",
    "  typealias Label = String",
    "  fun render() = this.toString() + super.toString()",
    "}",
    "",
  ].join("\n");
  const analysis = analyzeKotlin(source);

  assert.deepEqual(selectedText(source, analysis.annotations), ["@file:JvmName", "@Composable"]);
  assert.deepEqual(selectedText(source, analysis.classDeclarations), ["Screen", "Nested", "Singleton", "Label"]);
  assert.deepEqual(selectedText(source, analysis.receivers), ["this", "super"]);
});

test("analyzeKotlin colors only call-site named arguments", () => {
  const source = [
    "fun greet(name: String = \"world\", loud: Boolean = false) = Unit",
    "class Person(val name: String = \"Ada\")",
    "val result = greet(name = \"Kotlin\", loud = nested(enabled = true))",
    "if (result == Unit) println(message = \"done\")",
    "val plain = 1",
    "",
  ].join("\n");
  const analysis = analyzeKotlin(source);

  assert.deepEqual(selectedText(source, analysis.namedArguments), ["name", "loud", "enabled", "message"]);
});

test("analyzeKotlin ignores Kotlin-looking text outside code", () => {
  const source = [
    'val sample = "call(fake = this) @Fake class Ghost"',
    "/* call(blocked = super) */",
    "// @Commented class Hidden",
    "actual(`when` = 1)",
    "",
  ].join("\n");
  const analysis = analyzeKotlin(source);

  assert.deepEqual(selectedText(source, analysis.annotations), []);
  assert.deepEqual(selectedText(source, analysis.classDeclarations), []);
  assert.deepEqual(selectedText(source, analysis.receivers), []);
  assert.deepEqual(selectedText(source, analysis.namedArguments), ["`when`"]);
});
