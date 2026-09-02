# Changelog

All notable changes to this extension are documented here.

## 1.1.1 - 2026-09-02

- Matched Python `self` and `cls` to the keyword orange (`#CC7832`) used by
  `class`, across both TextMate and Pylance semantic highlighting.

## 1.1.0 - 2026-08-28

- Added Kotlin semantic colors for declarations, type references, properties,
  parameters, enum members, functions, keywords, literals, and comments.
- Matched Kotlin annotations to Python's decorator yellow (`#BBB529`).
- Matched call-site named arguments, including annotation arguments, to
  Darcula's blue (`#467CDA`) without recoloring defaults or assignments.
- Separated Kotlin class declarations (`#A9B7C6`) from type and return-type
  references (`#769AA5`).
- Matched Kotlin `this` and `super` to keyword orange (`#CC7832`).
- Added desktop and web runtime entry points with no telemetry or network use.
- Reconstructed a clean, reproducible package source without installed-extension
  metadata or modified third-party Kotlin extension files.

## 1.0.7 - 2026-08-27

- Matched JavaScript JSX and TypeScript JSX attribute names such as `role`,
  `className`, and `data-*` to the named-argument blue (`#467CDA`).

## 1.0.6 - 2026-08-27

- Added Pylance as an extension dependency so official VS Code installs it
  automatically when Marketplace access is available.
- Enabled Python inlay hints and padding by default.
- Enabled Pylance call-argument-name hints for all supported arguments.
- Kept these options as configuration defaults so users can override them.

## 1.0.5 - 2026-08-27

- Matched Python function-call keyword arguments to Android Studio Classic
  Darcula's Kotlin named-argument blue (`#467CDA`).
- Updated both TextMate and Pylance semantic-token rules so the color remains
  consistent with either highlighting path.

## 1.0.4 - 2026-08-26

- Added dedicated TextMate and semantic highlighting for Cypher.
- Separated query keywords, functions, labels, properties, variables,
  parameters, literals, operators, and comments with the Darcula palette.
- Fixed Neo4j's `variable.property` scope falling back to the base text color.

## 1.0.3 - 2026-08-25

- Matched the workbench backgrounds shown by VS Code Dark Modern when the
  extension is disabled: `#1F1F1F` for editor surfaces and `#181818` for the
  sidebar, panel, activity bar, title bar, and status bar.
- Applied the darker editor surface consistently to notebooks, terminals,
  minimaps, sticky scroll, peek views, and notifications.

## 1.0.2 - 2026-08-25

- Replaced the true-black workbench with a softer layered charcoal palette.
- Restored visual separation across the editor, sidebar, tabs, panels, notebooks,
  terminal, and Codex/chat surfaces without changing syntax colors.

## 1.0.1 - 2026-08-25

- Changed the editor, gutter, sidebar, panel, terminal, notebook, and Codex/chat
  surfaces to a true-black base.
- Kept inputs, request bubbles, code blocks, and hover states slightly lighter
  for visual separation and readability.

## 1.0.0 - 2026-08-25

- Prepared the original local theme for cross-platform VSIX and Marketplace distribution.
- Added workbench, editor, terminal, notebook, syntax, and semantic token colors.
- Added detailed Python/Pylance, Markdown, diff, and Rainbow CSV highlighting.
- Added Marketplace metadata, artwork, privacy information, and third-party notices.
- Documented the optional JetBrains Mono setup for Windows and macOS.
