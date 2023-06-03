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

## [B E D F R A M E](https://bedframe.dev)

Your **B**rowser **E**xtension **D**evelopment Framework

Make, validate, publish and manage cross-browser extensions with ease.

## Getting Started

Visit https://bedframe.dev/docs to get started with Bedframe.

## Documentation

Visit https://bedframe.dev/docs to view the full documentation.

## Why

why bedframe exists...
current landscape...

## What

Bedframe is your Browser Extension Development (BED) Framework
Not a framework in the (another javascript framework?!) traditional sense of the word but more of an opinionated arch and app structure for building production-ready, commercial, cross-browser extensions.

**Why prod-ready? Why commercial?**<br />
Technically a browser extension is just a collection of html, css, js and a manifest.json file.

A typescript + react build process coupled with continuous integration and continuous deployment is likely something you don't need or (frankly) want in a relatively simple extension. But if your extension is a "product" or its for a "client" or you have "users" that rely on your extension... Bedframe helps you bring the front-end best practices for arch and workflows you're used to in your "regular" web development:
unit tests, github actions that run on protected main branch, changesets, conventional changelogs... automated versioning, tagging and publishing.

**Frameworks**<br />
Bedframe generates projects bootstrapped with Vite and support template configurations for:

- Vanilla
- React
- Preact
- Lit
- Svelte
- Vue

## How

how we configure the BED

## Packages

| Package                          | Version                                                                              | Description                                                         |
| -------------------------------- | ------------------------------------------------------------------------------------ | ------------------------------------------------------------------- |
| [@bedframe/cli](packages/cli/)   | ![@bedframe/cli version](https://img.shields.io/npm/v/@bedframe/cli.svg?label=%20)   | Bedframe CLI utility. Make and manage your BED from the commandline |
| [@bedframe/core](packages/core/) | ![@bedframe/core version](https://img.shields.io/npm/v/@bedframe/core.svg?label=%20) | Bedframe types and functions                                        |

## Monorepo Utility Packages

| Package                                                    | Version                                                                                              | Description                                                                                                 |
| ---------------------------------------------------------- | ---------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| [eslint-config-bedframe](packages/eslint-config-bedframe/) | ![eslint-config-bedframe version](https://img.shields.io/npm/v/eslint-config-bedframe.svg?label=%20) | `eslint` configurations (includes `eslint-config-turbo`, `eslint-config-next` and `eslint-config-prettier`) |
| [tsconfig](packages/tsconfig/)                             | &nbsp;                                                                                               | `tsconfig.json`s used throughout the monorepo                                                               |

## License

[MIT](LICENSE).
