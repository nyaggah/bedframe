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
    <img alt="@bedframe/cli - NPM version" src="https://img.shields.io/npm/v/@bedframe/cli.svg?style=for-the-badge&labelColor=000000&label=cli">
  </a>
  <a aria-label="@bedframe/core - NPM version" href="https://www.npmjs.com/package/@bedframe/core">
    <img alt="@bedframe/core - NPM version" src="https://img.shields.io/npm/v/@bedframe/core.svg?style=for-the-badge&labelColor=000000&label=core">
  </a>
  <a aria-label="@bedframe/skills - NPM version" href="https://www.npmjs.com/package/@bedframe/skills">
    <img alt="@bedframe/skills - NPM version" src="https://img.shields.io/npm/v/@bedframe/skills.svg?style=for-the-badge&labelColor=000000&label=skills">
  </a>
  <a aria-label="License" href="https://github.com/nyaggah/bedframe/blob/main/LICENSE">
    <img alt="License" src="https://img.shields.io/npm/l/next.svg?style=for-the-badge&labelColor=000000">
  </a>
</p>

## [B E D F R A M E](https://bedframe.dev)

<!-- ![Bedframe - Make, Version & Publish cross-browser extensions continously with ease](https://raw.githubusercontent.com/nyaggah/bedframe/main/packages/cli/public/assets/bedframe-masthead.png) -->

![Bedframe - Make, Version & Publish cross-browser extensions continously with ease](https://github.com/nyaggah/bedframe/assets/284415/d545dea4-129e-42f0-82fd-5e856c655e61)
![bedframe-cli](https://github.com/nyaggah/bedframe/assets/284415/512540dd-18b7-4fbe-9ebe-861722b83a97)

Bedframe is a Vite-based framework for building, versioning, and publishing cross-browser extensions from one project.

Bedframe is built around the `B.E.D.` model:

- `Browser`: browser targets and per-browser manifest deltas
- `Extension`: extension type, pages, scripts, runtime surface
- `Development`: framework, language, tooling, testing, release flow

This repository contains the framework monorepo, including:

- `@bedframe/cli` for project scaffolding and workflows (`make`, `dev`, `build`, `zip`, `version`, `publish`)
- `@bedframe/core` for core APIs, plugin helpers, and shared types
- `@bedframe/skills` for portable agent-ready Bedframe guidance (`AGENTS.md` + skills references)

## Getting Started

Install the Bedframe CLI globally with your package manager of choice:

```bash
# pnpm
pnpm add -g @bedframe/cli

# npm
npm install -g @bedframe/cli

# yarn
yarn global add @bedframe/cli

# bun
bun add -g @bedframe/cli
```

Create a project:

```bash
bedframe make
```

Then run the standard flow in your new project:

```bash
bedframe dev
bedframe build
bedframe zip
```

For release workflows:

```bash
bedframe version
bedframe publish --browsers chrome,firefox,edge
```

## Documentation

Start here:

- Quickstart: https://www.bedframe.dev/docs/quickstart
- Full docs index: https://www.bedframe.dev/docs

Recommended reading order:

1. Quickstart
2. Bedframe config and architecture references
3. Browser manifest and publish workflow docs
4. Agent usage docs (`AGENTS.md` + skills) for repo-native AI workflows

## Packages

| Package                                      | Version                                                                               | Description                                                            |
| -------------------------------------------- | ------------------------------------------------------------------------------------- | ---------------------------------------------------------------------- |
| [@bedframe/cli](packages/cli/)               | ![@bedframe/cli version](https://img.shields.io/npm/v/@bedframe/cli.svg?label=%20)    | CLI workflows for scaffold, dev, build, zip, version, and publish     |
| [@bedframe/core](packages/core/)             | ![@bedframe/core version](https://img.shields.io/npm/v/@bedframe/core.svg?label=%20)  | Core Bedframe APIs, Vite integration helpers, and shared types         |
| [@bedframe/skills](packages/skills/)         | ![@bedframe/skills version](https://img.shields.io/npm/v/@bedframe/skills.svg?label=%20) | Portable Bedframe agent contract and task references                |
| [create-bedframe](packages/create-bedframe/) | ![create-bedframe version](https://img.shields.io/npm/v/create-bedframe.svg?label=%20) | Standalone project-creation utility                                  |

## Monorepo Utility Packages

| Package                                                    | Version                                                                                              | Description                                      |
| ---------------------------------------------------------- | ---------------------------------------------------------------------------------------------------- | ------------------------------------------------ |
| [eslint-config-bedframe](packages/eslint-config-bedframe/) | ![eslint-config-bedframe version](https://img.shields.io/npm/v/eslint-config-bedframe.svg?label=%20) | Shared lint configuration for Bedframe packages     |
| [@bedframe/tsconfig](packages/tsconfig/)                   | ![@bedframe/tsconfig version](https://img.shields.io/npm/v/@bedframe/tsconfig.svg?label=%20)         | Shared TypeScript configuration for Bedframe packages |

## Authors

- Joe Nyaggah ([@nyaggah](https://twitter.com/nyaggah))

## License

[MIT](LICENSE).
