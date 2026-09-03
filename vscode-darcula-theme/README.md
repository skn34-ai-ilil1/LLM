# Py Darcula Classic Theme

An unofficial VS Code theme that recreates the classic Darcula palette across
the workbench, editor, terminal, notebooks, syntax tokens, and semantic tokens.
It includes detailed Python/Pylance colors and context-aware Kotlin colors.

This community project is not affiliated with or endorsed by JetBrains s.r.o.
IntelliJ, JetBrains, Darcula, and JetBrains Mono are names associated with
their respective owners.

## Features

- Classic Darcula workbench and editor palette
- Detailed Python/Pylance semantic highlighting
- Kotlin properties, parameters, enum members, types, classes, and functions
- Kotlin annotations in `#BBB529`
- Kotlin call-site named arguments in `#467CDA`
- Kotlin class declarations in `#A9B7C6`, distinct from type references
- Kotlin `this` and `super` in `#CC7832`
- Named-argument blue for JavaScript and TypeScript JSX attributes
- Dedicated Neo4j Cypher syntax and semantic highlighting
- Notebook, terminal, Markdown, diff, and Rainbow CSV colors
- Desktop and web extension entry points for Windows, macOS, Linux, and vscode.dev

## Install and activate

After installing the extension:

1. Open **Preferences: Color Theme** from the Command Palette.
2. Select **Py Darcula Classic**.

To install a downloaded VSIX instead:

```sh
code --install-extension darcula-classic-py-lab-1.1.2.vsix
```

You can also choose **Extensions: Install from VSIX...** from the Extensions
view menu.

## Kotlin highlighting

For full Kotlin syntax and semantic information, use a Kotlin language
extension that registers the `kotlin` language ID, such as JetBrains Kotlin.
Py Darcula Classic does not bundle, patch, replace, or intercept that language
extension.

Some Kotlin language servers assign the same semantic token to declaration
parameters and call-site named arguments. To keep those roles separate, this
extension applies a small decoration layer only to visible Kotlin editors and
only while **Py Darcula Classic** is active. It recognizes comments, strings,
nested block comments, declarations, calls, and delimiter context before
coloring a label.

Disable this layer without changing the rest of the theme:

```jsonc
{
  "pyDarcula.kotlinDecorations.enabled": false
}
```

## Python call-argument inlay hints

Pylance remains an extension dependency. The theme supplies default settings
that enable Python inlay hints, add padding, and show supported call-argument
names. Explicit user or workspace settings can override these defaults.

With Marketplace access, VS Code installs Pylance automatically with this
extension. Offline or Marketplace-blocked environments must install Pylance
separately.

## Recommended font: JetBrains Mono

Fonts are installed by the operating system, not by VS Code color themes.
Install [JetBrains Mono](https://www.jetbrains.com/lp/mono/) first, then add:

```jsonc
{
  "editor.fontFamily": "'JetBrains Mono', Menlo, Consolas, 'Courier New', monospace",
  "terminal.integrated.fontFamily": "'JetBrains Mono', Menlo, Consolas, monospace",
  "editor.fontLigatures": true
}
```

## Privacy and security

The Kotlin decoration layer reads only the text of currently visible Kotlin
editors and processes it locally in memory. The extension does not collect
telemetry, make network requests, execute workspace commands, or write project
files.

## Sources and attribution

The palette was adapted from classic Darcula materials in the
[JetBrains IntelliJ Community repository](https://github.com/JetBrains/intellij-community)
and from prior MIT-licensed Darcula theme work by Rafael Renan Pacheco. See
`THIRD_PARTY_NOTICES.md` for references and license notices.

## 한국어 안내

설치 후 명령 팔레트에서 **기본 설정: 색 테마**를 열고
**Py Darcula Classic**을 선택하세요.

Kotlin에서는 프로퍼티·파라미터·enum 멤버는 보라색, 반환형 같은 타입
참조는 청록색, 클래스 선언명은 Python 클래스 선언명과 같은 회청색으로
표시됩니다. 어노테이션은 노란색이며 호출 위치의 named argument만
`#467CDA`로 표시됩니다. 일반 대입과 기본 파라미터에는 이 파란색을
적용하지 않습니다.

JetBrains Mono 글꼴은 VSIX에 포함되지 않으므로 운영체제에 별도로
설치한 뒤 위의 글꼴 설정을 적용해야 합니다.

## License

Distributed under the MIT License. Third-party material remains subject to
the notices in `THIRD_PARTY_NOTICES.md`.
