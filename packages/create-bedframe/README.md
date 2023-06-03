<div>
  >_<br />
  <br />
  B R O W S E R<br />
  E X T E N S I O N<br />
  D E V E L O P M E N T<br />
  F R A M E W O R K<br />
</div>

#

<p align="left">
  <a aria-label="Bedframe logo" href="https://bedframe.dev">
    <img src="https://img.shields.io/badge/BEDFRAME-7a46fc.svg?style=for-the-badge&logo=Bedframe&labelColor=CCC">
  </a>
  <a aria-label="@bedframe/core - NPM version" href="https://www.npmjs.com/package/@bedframe/core">
    <img alt="" src="https://img.shields.io/npm/v/@bedframe/core.svg?style=for-the-badge&labelColor=000000">
  </a>
  <a aria-label="@bedframe/cli - NPM version" href="https://www.npmjs.com/package/@bedframe/cli">
    <img alt="" src="https://img.shields.io/npm/v/@bedframe/cli.svg?style=for-the-badge&labelColor=000000">
  </a>
  <a aria-label="License" href="https://github.com/nyaggah/bedframe/blob/main/LICENSE">
    <img alt="" src="https://img.shields.io/npm/l/next.svg?style=for-the-badge&labelColor=000000">
  </a>
</p>

#

## **create-bedframe**

Standalone [@bedframe/cli](https://github.com/nyaggah/bedframe/tree/main/packages/cli) project scaffolding utility

### Installation

### Scaffolding Your First Bedframe Project

**_Compatibility Note_**

<blockquote>
Bedframe uses the offically supported Vite template presets. Vite requires <a href="https://nodejs.org/en" target="_blank">Node.js</a> version 14.18+, 16+. However, some templates require a higher Node.js version to work, please upgrade if your package manager warns about it.
</blockquote>

#### With NPM:

```bash
npm create bedframe
```

#### With YARN:

```bash
yarn create bedframe
```

#### With PNPM

```bash
pnpm create bedframe
```

Then follow the prompts!

You can also directly specify the `project name` via additional command line options. You can use `.` for the `project name` to scaffold in the current directory.

To scaffold a project called `chrome-extension`, run:

```bash
# npm 6.x
npm create bedframe chrome-extension

# npm 7+, extra double-dash is needed:
npm create bedframe chrome-extension

# yarn
yarn create bedframe chrome-extension

# pnpm
pnpm create bedframe chrome-extension
```
