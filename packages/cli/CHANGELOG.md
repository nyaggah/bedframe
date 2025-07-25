# @bedframe/cli

## 0.0.95

### Patch Changes

- b18f69c: - update mvp workflow to use updated env vars for edge publish flow
  - update env vars for examples

## 0.0.94

### Patch Changes

- c2dd105: feat: update Edge Add-ons publishing to use API v1.1

  - Replace OAuth token authentication with API key authentication
  - Update `EdgeUploadConfig` to use `productId`, `clientId`, and `apiKey`
  - Remove deprecated `getEdgeAccessToken` function
  - Update API endpoint to use current Microsoft Edge Add-ons API
  - Add proper validation for required environment variables
  - Improve error handling with specific troubleshooting tips
  - Update environment variable names in \_\_env stub file (generated `.env`)
  - Add helpful setup instructions for Partner Center configuration

## 0.0.93

### Patch Changes

- 4e86680: - lint/format: use oxlint and prettier; remove eslint
  - git hooks: use lefthook instead of husky
  - add tailwind prettier plugin

## 0.0.92

### Patch Changes

- 9be2502: - generate projects with vite 6
  - update crx to version 2
  - upgrade tailwind to version 4
- Updated dependencies [9be2502]
  - @bedframe/core@0.0.46

## 0.0.91

### Patch Changes

- 7f8128b: add temp legacy config.

  ```
  legacy: {
    skipWebSocketTokenCheck: true,
  },
  ```

  Temporary workaround for upstream (crxjs) issue:
  change to Vite CORS policies in the dev server:

  "
  In Vite 6.0.8 and below, WebSocket server was able to connect from any web pages. However,
  that could be exploited by a malicious web page.

  In Vite 6.0.9+, the WebSocket server now requires a token to connect from a web page.
  But this may break some plugins and frameworks that connects to the WebSocket server
  on their own. Enabling this option will make Vite skip the token check.

  We do not recommend enabling this option unless you are sure that you are fine with
  that security weakness.
  "

  ^^^

  - https://github.com/crxjs/chrome-extension-tools/issues/971#issuecomment-2605520184
  - https://github.com/vitejs/vite/blob/9654348258eaa0883171533a2b74b4e2825f5fb6/packages/vite/src/node/config.ts#L535

## 0.0.90

### Patch Changes

- b8be7c0: in/else instead of ternary
- Updated dependencies [d79f51a]
  - @bedframe/core@0.0.45

## 0.0.89

### Patch Changes

- 897c2be: author.email should exist in baseManifest

## 0.0.88

### Patch Changes

- ac4d4c0: fix issue with first run lint+format (lint-staged)

  - missmatched eslint plugin versions causing error on first run/ project gen `lint:format` tastk

## 0.0.87

### Patch Changes

- fd2cf80: project gen updates + commit hook clean up

## 0.0.86

### Patch Changes

- be98acb: update deps; fix vulns
- Updated dependencies [be98acb]
  - @bedframe/core@0.0.44

## 0.0.85

### Patch Changes

- cb43b96: omit sourcemaps in cli dist

## 0.0.84

### Patch Changes

- ac7b5fe: move assets dir out of bundled CLI

## 0.0.83

### Patch Changes

- 4dcdc9e: update uploadToEdge / getEdgeAccessToken funcs

## 0.0.82

### Patch Changes

- 6ad62bd: expect full edge token url in secreates

## 0.0.81

### Patch Changes

- f9f5cb5: use cwu cli v3 + remove use-submission-api for amo

## 0.0.80

### Patch Changes

- fc4df64: project gen name/path formatting

  ensure the different possible project name variations passed into prompts (args and options) are formatted correctly

  fixes #453

## 0.0.79

### Patch Changes

- 9367af8: - feat(create-bedframe): output standalone make command + update bin
  - feat(cli-commands): ensure build and dev scripts have desc of options/args (browser array)
  - code clean up
  - remove codemod command <~~ CRX handles Firefox builds now aka Bedframe supports Firefox/Safari + All chromium (Arc, Brave, Chrome, Edge, Opera,...)
  - update packages to latest
- Updated dependencies [9367af8]
  - @bedframe/core@0.0.43

## 0.0.78

### Patch Changes

- 193838b: Bun in BED! 🎉 cli ux; code clean up
- Updated dependencies [193838b]
  - @bedframe/core@0.0.42

## 0.0.77

### Patch Changes

- 247cdee: bump project-gen packages to latest
- Updated dependencies [247cdee]
  - @bedframe/core@0.0.41

## 0.0.76

### Patch Changes

- 8f93209: better project gen output files shape; code cleanu up

## 0.0.75

### Patch Changes

- 374e197: cross-browesr manifest handling; dev/build commands
- Updated dependencies [374e197]
  - @bedframe/core@0.0.40

## 0.0.74

### Patch Changes

- 3aa3b96: better project gen functionality; clean up; drop styled-components; better manifest handling
- Updated dependencies [3aa3b96]
  - @bedframe/core@0.0.39

## 0.0.73

### Patch Changes

- 89225b0: fixes trailing comma issue (cli) + bump deps + minor qol updates
- Updated dependencies [89225b0]
  - @bedframe/core@0.0.38

## 0.0.72

### Patch Changes

- 17aa31f: dep bump; postcss fix
- 9234577: bump deps + actually fix issue w/ postcss (hopefully) 🙃
- Updated dependencies [9234577]
  - @bedframe/core@0.0.37

## 0.0.71

### Patch Changes

- f40a7ec: fix devtools setPage urls
- Updated dependencies [f40a7ec]
  - @bedframe/core@0.0.36

## 0.0.70

### Patch Changes

- a657e15: templates, commands, utility funcs updates

## 0.0.69

### Patch Changes

- 3800dd1: image location fix

## 0.0.68

### Patch Changes

- 5f006c2: update readmes; code clean up
- Updated dependencies [5f006c2]
  - @bedframe/core@0.0.35

## 0.0.67

### Patch Changes

- d3215e8: update cli version installed on project gen

## 0.0.66

### Patch Changes

- e9805b9: quality of life type stuffs; code cleanups

## 0.0.65

### Patch Changes

- 2eecb22: mvp workflow publish ci feedback/ dx

## 0.0.64

### Patch Changes

- 635b0d7: env troubleshoot edge productId for token getting... should work meow

## 0.0.63

### Patch Changes

- 0d9006a: publish troublshoot...

## 0.0.62

### Patch Changes

- f5792b6: fix issue w/ zip dir/name formatting

## 0.0.61

### Patch Changes

- cf98c4e: feat(publish): ensure we find zip to send to chrome and edge

## 0.0.60

### Patch Changes

- 7ef3100: refactor the zip command, output should work meow

## 0.0.59

### Patch Changes

- db7b1de: feat(commands): zip / publish update zipPath construction... maybe güd meow ? 🤷 lets bill o'reilly it!

## 0.0.58

### Patch Changes

- ac3be72: construct zipPath from root dir

## 0.0.57

### Patch Changes

- bc777d1: strip fs-extra; wrap node-native fs/promises funcs instead
- Updated dependencies [bc777d1]
  - @bedframe/core@0.0.34

## 0.0.56

### Patch Changes

- 60be0eb: clean up; bump version to install core/cli
- Updated dependencies [60be0eb]
  - @bedframe/core@0.0.33

## 0.0.55

### Patch Changes

- 6146772: code cleanup

## 0.0.54

### Patch Changes

- fcba27b: feat(workspace): code re-org + better cli dx
- Updated dependencies [5671c14]
  - @bedframe/core@0.0.32

## 0.0.53

### Patch Changes

- 37a44d6: template and bedframe config typings update
- Updated dependencies [37a44d6]
  - @bedframe/core@0.0.31

## 0.0.52

### Patch Changes

- bb22f55: fix content script imports; clean up package.json scripts

## 0.0.51

### Patch Changes

- b96f331: project gen refactor; moar readable

## 0.0.50

### Patch Changes

- 1619309: include deps an configs for tailwind + shadcn

## 0.0.49

### Patch Changes

- b0dae68: update release workflow"
- Updated dependencies [b0dae68]
  - @bedframe/core@0.0.30

## 0.0.48

### Patch Changes

- a91d1da: global var for crx (troubleshoot)
- Updated dependencies [a91d1da]
  - @bedframe/core@0.0.29

## 0.0.47

### Patch Changes

- 6980b24: bump installed core version
- 49c4cac: bump core version
- a62a118: fix broken build... fix externals
- Updated dependencies [a62a118]
  - @bedframe/core@0.0.28

## 0.0.46

### Patch Changes

- d0afdaf: fix: esm only; bump eslint packages
- 86f2ccd: fix: troubleshoot esm + globalThis missing... wip
- Updated dependencies [86f2ccd]
  - @bedframe/core@0.0.27

## 0.0.45

### Patch Changes

- 545dec7: return to crx v0.0.14 for now
- Updated dependencies [545dec7]
  - @bedframe/core@0.0.26

## 0.0.44

### Patch Changes

- 0ee1e4b: bump installed core version
- Updated dependencies [0ee1e4b]
  - @bedframe/core@0.0.25

## 0.0.43

### Patch Changes

- 755ba71: update packages to install, prompt ui updates, code clean up
- Updated dependencies [755ba71]
  - @bedframe/core@0.0.24

## 0.0.42

### Patch Changes

- a23e22d: project gen (tailwind) ensure config created correctly

## 0.0.41

### Patch Changes

- a49c03e: project gen; cli make command graphic

## 0.0.40

### Patch Changes

- 122bbfa: project gen updates; better cli ux

## 0.0.39

### Patch Changes

- b664c1b: project gen account for tailwind; pages and components
- Updated dependencies [b664c1b]
  - @bedframe/core@0.0.23

## 0.0.38

### Patch Changes

- def1859: updated project gen types; clean up
- Updated dependencies [def1859]
  - @bedframe/core@0.0.22

## 0.0.37

### Patch Changes

- 3b85a74: project gen updates; release workflow updates; better ux; code clean up

## 0.0.36

### Patch Changes

- 6e7bc03: bump @bedframe/core version on install

## 0.0.35

### Patch Changes

- 2ad08f3: code clean up
- Updated dependencies [2ad08f3]
  - @bedframe/core@0.0.21

## 0.0.34

### Patch Changes

- 802c5f2: project gen (make bed) updates

## 0.0.33

### Patch Changes

- 55d6bf1: project gen updates galore!
- Updated dependencies [55d6bf1]
  - @bedframe/core@0.0.20

## 0.0.32

### Patch Changes

- 72d2e02: project gen updates; simpler manifest + no bedframe.config (for now)

## 0.0.31

### Patch Changes

- 60f2dd8: feat(changeset): project gen updates; clean up
- Updated dependencies [60f2dd8]
  - @bedframe/core@0.0.19

## 0.0.30

### Patch Changes

- adc2209: feat(changeset): project gen updates;

## 0.0.29

### Patch Changes

- 21a971e: clean up project gen

## 0.0.28

### Patch Changes

- 558f631: project gen updates; bump deps etc
- Updated dependencies [558f631]
  - @bedframe/core@0.0.18

## 0.0.27

### Patch Changes

- 6ab1217: project gen updates (troubleshoot bundling)
- b0bc1fe: feat(cli): bump installed core version
- Updated dependencies [6ab1217]
  - @bedframe/core@0.0.17

## 0.0.26

### Patch Changes

- d084473: bump installed @bedframe/core package

## 0.0.25

### Patch Changes

- f266d40: feat(changeset): project gen updates; repo cleanup
- Updated dependencies [f266d40]
  - @bedframe/core@0.0.16

## 0.0.24

### Patch Changes

- fe6e613: project gen updates + bedframe config updates
- Updated dependencies [fe6e613]
  - @bedframe/core@0.0.15

## 0.0.23

### Patch Changes

- 8b64ca0: feat(bedframe config): fix issue with bedframe config when has tests

## 0.0.22

### Patch Changes

- b7026ec: project gen updates + re-write configs
- Updated dependencies [b7026ec]
  - @bedframe/core@0.0.14

## 0.0.21

### Patch Changes

- 9fd50a2: rejig the whole thang

## 0.0.20

### Patch Changes

- 5b43398: feat(cli): write manifest package vite config updates + rejigg

## 0.0.19

### Patch Changes

- 2c5b852: feat(workflow): remove yarn + npm; use pnpm
- e8a20a7: feat(workflow): add pnpm install step before deps install
- Updated dependencies [2c5b852]
- Updated dependencies [e8a20a7]
  - @bedframe/core@0.0.13

## 0.0.18

### Patch Changes

- 2d5508e: issue w/ release workflow (don't use yarn)
- Updated dependencies [2d5508e]
  - @bedframe/core@0.0.12

## 0.0.17

### Patch Changes

- 1890834: feat: updates to project gen
- 514f38d: use pnpm in turborepo
- Updated dependencies [514f38d]
  - @bedframe/core@0.0.11

## 0.0.16

### Patch Changes

- d4680a7: project gen updates (wip); file renaming

## 0.0.15

### Patch Changes

- 2f2dd56: feat(changeset): update project deps versions

## 0.0.14

### Patch Changes

- 94d7631: feat(project gen): reconfigure project generation

## 0.0.13

### Patch Changes

- 70b27b4: feat(intro component): spruce up intro component a lil bit

## 0.0.12

### Patch Changes

- f76db7d: feat(intro component): clean up intro component (first run experience [WIP])

## 0.0.11

### Patch Changes

- a640dee: feat(cli): project generation: use execa to directly install
- Updated dependencies [a640dee]
  - @bedframe/core@0.0.10

## 0.0.10

### Patch Changes

- f4bc59d: feat: readme updates; cd into project before git
- Updated dependencies [f4bc59d]
  - @bedframe/core@0.0.9

## 0.0.9

### Patch Changes

- 5d09fd9: update readmes; make moar uniform
- Updated dependencies [5d09fd9]
  - @bedframe/core@0.0.8

## 0.0.8

### Patch Changes

- 92b4409: feat: beef up readmes; update some jsdoc
- Updated dependencies [92b4409]
  - @bedframe/core@0.0.6

## 0.0.7

### Patch Changes

- 0ab40c4: ### core:

  - create manifest fields helper methods;

  ### cli:

  - clean up

- Updated dependencies [0ab40c4]
  - @bedframe/core@0.0.4

## 0.0.6

### Patch Changes

- 8b7799e: ### @bedframe/cli:

  - update Make command and usage a lil bit
  - fix issue with duped root dir (ensureDir nonesense)
  - ayyyyyeeee! we got that side_panel action y'all!! 🚀
  - fix issue w/ no name, version, desc + include author deets <--- who's out here just including emails publicly?, joey??

  ### create-bedframe:

  - make package esm only.. bundling woes 😔
  - make it executable (include shebang comment line)

## 0.0.5

### Patch Changes

- 7df839d: feat: add create-bedframe (initial)

## 0.0.4

### Patch Changes

- 9d2fa31: feat(ci,core): build script update
- Updated dependencies [9d2fa31]
  - @bedframe/core@0.0.3

## 0.0.3

### Patch Changes

- 690a358: feat(cli): add fs-extra to deps

## 0.0.2

### Patch Changes

- cd6ddef: strip husky prepare scripts from core and cli
- Updated dependencies [cd6ddef]
  - @bedframe/core@0.0.2

## 0.0.1

### Patch Changes

- 9e0ea00: add licenses (MIT) + update package.json scripts and repo settings
- 9e0ea00: update prompts & stubs, package.json scripts
- 9e0ea00: prep cli and core for publish
- 9e0ea00: add licenses (MIT) + update package.json scripts and repo settings
- Updated dependencies [9e0ea00]
- Updated dependencies [9e0ea00]
- Updated dependencies [9e0ea00]
- Updated dependencies [9e0ea00]
  - @bedframe/core@0.0.1
