# Third-Party Notices

This project is an unofficial community adaptation. It is not affiliated with
or endorsed by JetBrains s.r.o.

## Darcula Theme for Visual Studio Code

Portions of `themes/darcula-classic-color-theme.json` are derived from
Darcula Theme v1.20.0 by Rafael Renan Pacheco at commit
`3b20c66a4c05f3f5e52c0bec5bc789445ba54756`:

https://github.com/rafaelrenanpacheco/darcula-theme/tree/3b20c66a4c05f3f5e52c0bec5bc789445ba54756

Copyright (c) 2020 Rafael Renan Pacheco

Licensed under the MIT License. The complete copyright and permission notice
is included in the root `LICENSE` file.

## JetBrains IntelliJ Community Edition

Classic Darcula color values and semantic roles were adapted with changes for
VS Code from these JetBrains sources at commit
`aa83bee51efc30cc2067ea50e7aad5e0b370262a`:

- [darcula.theme.json](https://github.com/JetBrains/intellij-community/blob/aa83bee51efc30cc2067ea50e7aad5e0b370262a/platform/platform-resources/src/themes/darcula.theme.json)
- [DefaultColorSchemesManager.xml](https://github.com/JetBrains/intellij-community/blob/aa83bee51efc30cc2067ea50e7aad5e0b370262a/platform/platform-resources/src/DefaultColorSchemesManager.xml)
- [PythonDarcula.xml](https://github.com/JetBrains/intellij-community/blob/aa83bee51efc30cc2067ea50e7aad5e0b370262a/python/pluginResources/colorSchemes/PythonDarcula.xml)
- [PyHighlighter.java](https://github.com/JetBrains/intellij-community/blob/aa83bee51efc30cc2067ea50e7aad5e0b370262a/python/python-syntax-core/src/com/jetbrains/python/highlighting/PyHighlighter.java)

The referenced upstream material is licensed under the Apache License,
Version 2.0. A complete copy is included in `licenses/Apache-2.0.txt`.

The following upstream notice is reproduced from JetBrains `NOTICE.txt`:

This software includes code from IntelliJ IDEA  
Copyright (C) JetBrains s.r.o.  
https://www.jetbrains.com/idea/

Changes made for this project include translating JetBrains UI keys, editor
attributes, and Python highlighting roles into VS Code workbench colors,
TextMate scopes, and semantic token selectors; adding coverage for notebooks,
Markdown, diffs, terminals, and other VS Code surfaces; and adjusting selectors
where the two editors use different token models.

## JetBrains Mono

JetBrains Mono is recommended but is not included in the VSIX. It is available
separately under the SIL Open Font License 1.1 from:
https://github.com/JetBrains/JetBrainsMono
