# Publishing Guide

## 1. Choose the permanent identity

The Marketplace publisher for this project is `py-darcula-theme-lab`. The
Publisher ID and extension `name` form the permanent Marketplace identity:

```text
py-darcula-theme-lab.darcula-classic-py-lab
```

Publisher IDs cannot be renamed after creation. The manifest `name` must be
unique in the Marketplace; `displayName` remains the user-facing title.

## 2. Create the Marketplace publisher

1. Sign in with a Microsoft account at
   https://marketplace.visualstudio.com/manage/publishers/
2. Select **Create publisher**.
3. Choose a permanent, unique **ID** and a public **Name**.
4. Save the publisher.

The blue verified-publisher badge is not required to publish. It is a separate
domain-verification program with additional age and ownership requirements.

## 3. Build and test the VSIX

Install Node.js 22 or newer, then run:

```sh
npm install
npm run validate
npm run list:vsix
npm run package:vsix
code --install-extension dist/darcula-classic-py-lab-1.0.3.vsix --force
```

Test the theme on Windows and macOS with representative Python, JavaScript,
JSON, Markdown, notebook, and terminal content before publishing.

## 4. Publish without a long-lived token

For a first release, open your publisher in the Marketplace management page,
choose **New extension** / **Visual Studio Code**, and upload the tested VSIX.
This avoids putting a publishing credential on the development machine.

## 5. CLI authentication if needed

The legacy CLI flow uses an Azure DevOps personal access token with:

- Organization: **All accessible organizations**
- Scope: **Marketplace > Manage**

Then run:

```sh
npx @vscode/vsce login <publisher-id>
npx @vscode/vsce publish
```

Never commit, paste into chat, or include the token in a VSIX. Global Azure
DevOps PATs are scheduled for retirement on December 1, 2026. For repeatable
publishing, prefer GitHub Actions OIDC trusted publishing or Microsoft Entra
ID workload identity instead of a long-lived PAT.

## 6. Optional Open VSX release

Open VSX is a separate registry used by VSCodium, Eclipse Theia, and some
VS Code-compatible editors. After creating the matching namespace and signing
the Open VSX Publisher Agreement, the same VSIX can be published there with
`ovsx` and a separate Open VSX token.

## Official references

- https://code.visualstudio.com/api/working-with-extensions/publishing-extension
- https://code.visualstudio.com/api/extension-guides/color-theme
- https://code.visualstudio.com/api/references/extension-manifest
- https://github.com/microsoft/vscode-vsce#trusted-publishing
