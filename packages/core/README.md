<div>
  >_<br />
  <br />
  <span style="color:#c792e9">B R O W S E R</span><br />
  <span style="color: #c3e88d">E X T E N S I O N</span><br />
  <span style="color: #8addff">D E V E L O P M E N T</span><br />
  <span style="color: #ffcb6b">F R A M E W O R K</span><br />
</div>

<br />

<p align="left">
  <a aria-label="Bedframe logo" href="https://bedframe.dev">
    <img src="https://img.shields.io/badge/BEDFRAME-7a46fc.svg?style=for-the-badge&logo=Bedframe&labelColor=CCC">
  </a>
  <a aria-label="@bedframe/cli - NPM version" href="https://www.npmjs.com/package/@bedframe/cli">
    <img alt="" src="https://img.shields.io/npm/v/@bedframe/cli.svg?style=for-the-badge&labelColor=000000">
  </a>
  <a aria-label="@bedframe/core - NPM version" href="https://www.npmjs.com/package/@bedframe/core">
    <img alt="" src="https://img.shields.io/npm/v/@bedframe/core.svg?style=for-the-badge&labelColor=000000">
  </a>
  <a aria-label="License" href="https://github.com/nyaggah/bedframe/blob/main/LICENSE">
    <img alt="" src="https://img.shields.io/npm/l/next.svg?style=for-the-badge&labelColor=000000">
  </a>
</p>

## **@bedframe/core**

Your Browser Extension Development Framework (core types &amp; funcs)

## Installation

<blockquote>
  <br />
  <h4><strong>Node Version Requirement</strong></h4>  
  Bedframe CLI requires <a href="https://nodejs.org/" target="_blank" rel="noopener noreferrer">Node.js</a> 14.18+, 16+. You can manage multiple versions of Node on the same machine with <a href="https://github.com/tj/n" target="_blank" rel="noopener noreferrer">n</a>, <a href="https://github.com/creationix/nvm" target="_blank" rel="noopener noreferrer">nvm</a> or <a href="https://github.com/coreybutler/nvm-windows" target="_blank" rel="noopener noreferrer">nvm-windows</a>.
  <br /><br />
</blockquote>

```bash
#  with pnpm
pnpm add @bedframe/core -D

# with npm
npm install @bedframe/core -D

# with yarn
yarn add @bedframe/core -D
```

## Scaffolding Your First Bedframe Project

<blockquote>
<br />
<strong>Compatibility Note</strong><br/>
Bedframe uses the offically supported Vite template presets. Vite requires <a href="https://nodejs.org/en" target="_blank">Node.js</a> version 14.18+, 16+. However, some templates require a higher Node.js version to work, please upgrade if your package manager warns about it.
<br /><br />
</blockquote>

The best way to get started with Bedframe is by using the `create-bedframe` project generator or run the `make` command using the `@bedframe/cli`.

If building a project from scratch, assuming you've generated a Vite project (w/ React + TypeScript), after installing `@beframe/core`, ensure a folder structure like the following:

The default Bedframe setup generates a production-ready Chrome Popup extension BED setup complete with sensible default configurations for:

- **Required**: base framework configuration (e.g. Vite + React with TypeScript)
- **Recommended**: linting & formating (w/ eslint + prettier w/ lint-staged)
- **Recommended**: source control (w/ git)
  - publish/ release workflows (ci/cd w/ github actions)
  - automated dependency updates (w/ dependapot workflows)
  - conventional commits and git hooks (commitizen + commitlint)
  - changesets (w/ changesets)
    - conventional changelog
- **Optional**: tests (unit testing w/ Vitest)

```bash

# Bedframe (default) project structure
bedframe-project/
├─ .git/
├─ .husky/
├─ .vscode
├─ public/
│  ├─ icons/
│  │  ├─ icon-16x16.png
│  │  ├─ icon-32x32.png
│  │  ├─ icon-48x48.png
│  │  ├─ icon-128x128.png
├─ src/
│  ├─ components/
│  ├─ manifest/
│  │  ├─ chrome.ts
│  │  ├─ index.ts
│  ├─ pages/
│  │  ├─ main/
│  │  │  ├─ main.ts
│  │  │  ├─ main.html
│  │  ├─ options/
│  │  │  ├─ options.ts
│  │  │  ├─ options.html
├─ vitest/
│  ├─ vitest.setup.ts
├─ .gitignore
├─ LICENSE
├─ package.json
├─ README.md
├─ tsconfig.ts
├─ tsconfig.node.ts
├─ vite.config.ts
├─ vitest.config.ts
```

## Defining your manifest

```typescript
function createManifest(
  manifest: Manifest, // chrome.runtime.ManifestV3
  browser: Browser, // "chrome" | "brave" | "opera" | "edge" | "firefox" | "safari"
): BuildTarget
```

```typescript
// types
type Manifest = chrome.runtime.ManifestV3

type Browser = 'Chrome' | 'Brave' | 'Opera' | 'Edge' | 'Firefox' | 'Safari'

type BuildTarget = {
  manifest: Manifest
  browser: Browser
}
```

## Usage

Assuming you have a manifest for Chrome browser here `src/manifest/chrome.ts`, you'd create your manifest like so:

```typescript

import { createManifest } from '@bedframe/core'

export chrome = createManifest({
  // Required
  name: "My Chrome Extension",
  version: "0.0.1",
  manifest_version: 3,

   // Recommended
  action: {
    //
  },
  default_locale: "en",
  description: "A plain text description",
  icons: {...},
},

// tell vite.config which browser to target the build for
'chrome'
)

```

the `createManifest` returns an `BuildTarget` object that contains the MV3 manifest + a strin denoting what browser the manifest is for.

we pass this along to the `vite.config.ts`

```typescript
import { resolve } from 'node:path'
import { defineConfig } from 'vite'
import { crx } from '@crxjs/vite-plugin'
import react from '@vitejs/plugin-react'
import { getManifest } from '@bedframe/core'
import * as manifest from './src/manifest'

export default ({ mode }) => {
  return defineConfig({
    resolve: {
      alias: {
        '@': resolve(__dirname, './src'),
      },
    },
    plugins: [
      react(),
      crx({
        manifest: getManifest(mode, [manifest.chrome]),
      }),
    ],
    build: {
      outDir: `dist/${mode}`,
    },
  })
}
```

ensure you have a script to dev in local and build (for production), etc like so:

```json
// package.json
{
  // other fields...
  "scripts": {
    "dev": "vite --mode",
    "build": "tsc && vite build",
    "dev:all": "concurrently \"vite --mode chrome\" \"vite --mode brave\" \"vite --mode opera\" \"vite --mode edge\"",
    "build:all": "concurrently \"tsc && vite build --mode chrome\" \"tsc && vite build --mode brave\" \"tsc && vite build --mode opera\" \"tsc && vite build --mode edge\""
  }
  // other fields...
}
```

now when we run

```bash
npm run build
```

the extension for chrome will be built and output in the `dist/` folder:

```bash
# Output for you chrome extension
dist/
├─ chrome/
│  ├─ assets/
│  ├─ icons/
│  ├─ manifest.json
│  ├─ service-worker-loader.js
```

### Load in Chrome

load unpacked from dist/chrome

### Developing w/ Bedframe

npm run dev
npm run build (watch ?)

- HMR
- etc
