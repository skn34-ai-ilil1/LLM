# Py Darcula Classic Theme

An unofficial, code-free VS Code color theme that recreates the familiar
classic Darcula palette across the workbench, editor, terminal, notebooks,
syntax tokens, and semantic tokens.

This community project is not affiliated with or endorsed by JetBrains s.r.o.
IntelliJ, JetBrains, Darcula, and JetBrains Mono are names associated with
their respective owners.

## Features

- Dark Modern workbench surfaces with classic Darcula syntax accents
- Syntax colors for common languages and markup
- Detailed Python/Pylance semantic highlighting
- Dedicated Neo4j Cypher syntax and semantic highlighting
- Notebook, terminal, Markdown, diff, and Rainbow CSV colors
- One declarative package for Windows, macOS, Linux, and vscode.dev
- No executable code, telemetry, network requests, or workspace access

## Install and activate

After installing the extension:

1. Open **Preferences: Color Theme** from the Command Palette.
2. Select **Py Darcula Classic**.

To install a downloaded VSIX instead:

```sh
code --install-extension darcula-classic-py-lab-1.0.0.vsix
```

You can also use **Extensions: Install from VSIX...** from the Extensions
view menu.

## Recommended font: JetBrains Mono

Fonts are installed by the operating system, not by VS Code color themes.
Install [JetBrains Mono](https://www.jetbrains.com/lp/mono/) first, then add
these user settings:

```jsonc
{
  "editor.fontFamily": "'JetBrains Mono', Menlo, Consolas, 'Courier New', monospace",
  "terminal.integrated.fontFamily": "'JetBrains Mono', Menlo, Consolas, monospace",
  "editor.fontLigatures": true
}
```

macOS users with Homebrew can install the font with:

```sh
brew install --cask font-jetbrains-mono
```

Windows users can download the font from the JetBrains link above, extract
the archive, select the TTF files, and choose **Install**.

## Why the font is separate

A Marketplace theme can select colors and suggest a font family, but it cannot
safely install a system font on Windows or macOS. If JetBrains Mono is missing,
VS Code uses the fallback fonts from the settings above.

## Sources and attribution

The palette was adapted from classic Darcula materials in the
[JetBrains IntelliJ Community repository](https://github.com/JetBrains/intellij-community)
and from prior MIT-licensed Darcula theme work by Rafael Renan Pacheco. See the
bundled `THIRD_PARTY_NOTICES.md` file for the specific references and license
notices.

## Privacy and security

This extension contains JSON color definitions only. It has no activation
code, does not execute commands, does not collect telemetry, and does not make
network requests.

## 한국어 안내

설치 후 명령 팔레트에서 **기본 설정: 색 테마**를 열고
**Py Darcula Classic**을 선택하세요. JetBrains Mono 글꼴은 테마에
포함되지 않으므로 운영체제에 별도로 설치한 다음 위 설정을 적용해야
합니다.

## License

Distributed under the MIT License. Third-party material remains subject to
the notices in the bundled `THIRD_PARTY_NOTICES.md` file.
