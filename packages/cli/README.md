<div>
  >_<br />
  <br />
  B R O W S E R<br />
  E X T E N S I O N<br />
  D E V E L O P M E N T<br />
  F R A M E W O R K<br />
</div>

<br />

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

## **@bedframe/cli**

<!-- Your Browser Extension Development Framework (dev utility) -->

The Bedframe Command Line Interface (CLI) lets you make and manage your BED directly from the terminal.

## Installation

<blockquote>
  <br />
  <h4><strong>Node Version Requirement</strong></h4>  
  Bedframe CLI requires <a href="https://nodejs.org/" target="_blank" rel="noopener noreferrer">Node.js</a> 14.18+, 16+. You can manage multiple versions of Node on the same machine with <a href="https://github.com/tj/n" target="_blank" rel="noopener noreferrer">n</a>, <a href="https://github.com/creationix/nvm" target="_blank" rel="noopener noreferrer">nvm</a> or <a href="https://github.com/coreybutler/nvm-windows" target="_blank" rel="noopener noreferrer">nvm-windows</a>.
  <br /><br />
</blockquote>

```bash
# with npm
npm install -g @bedframe/cli

# with yarn
yarn add -g @bedframe/cli

#  with pnpm
pnpm add -g @bedframe/cli
```

After installation, you will have access to the `bedframe` executable in your command line. You can verify that it is properly installed by simply running `bedframe`, which should present you with an intro and help message.

```bash
Usage: bedframe [command] [options]

Options:
  -h, --help             display help for command
  -v, --version          display currently installed @bedframe/cli version

Commands:
  make [name] [options]  make your B E D
  help [command]         display help for command
```

You can check you have the right version with this command:

```bash
bedframe --version
```

## Making your BED

To create a new bedframe project, run:

```bash
bedframe make
```

Then follow the prompts!

You can specify the `project name` as the first argument of the `make` command. Using `.` for the `project name` will scaffold the project in the current directory.

```bash
# scaffold project called `chrome-extension`
bedframe make chrome-extension

# scaffold project in the current directory
bedframe make .
```

You will then be prompted to configure your BED, picking `Framework`, `Language`, `Browser` to target, etc. All configurations can be manually edited once you generate the project.

## Commands

### Make

The Bedframe `make` command is a scaffolding utitlity that creates a BED environment based on your chosen configuration of features you choose, and delegates the rest to Vite. Projects scaffolded this way can directly leverage the Vite plugin ecosystem which is Rollup-compatible. You end up with a familiar Vite-powered project you're used to.

Run the `make` command to launch the project scaffolding prompts. This command is also available as the standalone [`create-bedframe`](https://github.com/nyaggah/bedframe/tree/main/packages/create-bedframe) package.

### Args

**Name**

The CLI `name` argument sets manifests' `name` property (required) which is a short, plain text string (maximum of 45 characters) that identifies the extension. For example:

```json
{
  "name": "My extension name"
}
```

You can specify a locale-specific string; see [Internationalization](#) for details.

It is displayed in the following locations:

- Install dialog
- Extensions page (chrome://extensions)
- [Chrome Web Store](https://chrome.google.com/webstore)

See also [Short Name](#).

### Flags

You can optionally by-pass the prompts if you pass in the requisite flags to the `make` command.

As an example, to scaffold a multi-extension project i.e. BED environment targeting Chrome, Brave, Opera and Edge browsers you can run:

```bash
$ bedframe make multi-extension-project \
  --version 0.0.1  \
  --browsers chrome, brave, opera, edge \
  --packageManager yarn \
  --framework react \
  --language typescript \
  --style Styled Components \
  --lintFormat \
  --git \
  --gitHooks \
  --tests \
  --commitLint \
  --changesets \
  --installDeps \
```

If any required configuration isn't passed in via `flags` the CLI will prompt you for the missing requirements.

### Options

| Flag (short) | Flag (long)            | Type           | Description                                     | Default    |
| ------------ | ---------------------- | -------------- | ----------------------------------------------- | ---------- |
| -v           | --version              | string         | Specify project version                         | 0.0.1      |
| -b           | --browsers             | Browser[]      | Specify comma-separated list of target browsers | chrome     |
| -p           | --packageManager&nbsp; | PackageManager | Specify package manager to use                  | yarn       |
| -f           | --framework            | Framework      | Specify framework to use                        | react      |
| -l           | --language             | Language       | Specify language to use                         | typescript |
| -s           | --style                | Style          | Specify CSS solution to use                     | tailwind   |
| -o           | --lintFormat           | boolean        | Configure linting with formatting               | true       |
| -g           | --git                  | boolean        | Initialize git source control                   | true       |
| -h           | --gitHooks             | boolean        | Add git hooks (Husky + lint staged)             | true       |
| -t           | --tests                | boolean        | Add tests (Vitest + Testing Library + jsdom)    | true       |
| -c           | --commitLint           | boolean        | Add commit linting                              | true       |
| -x           | --changesets           | boolean        | Add changesets                                  | true       |
| -i           | --installDeps          | boolean        | Add &amp; install dependencies                  | true       |
| -y           | --yes                  | boolean        | Set up Bedframe w/ preconfigured defaults       | false      |
|              | --help                 |                | display help for command                        |            |

### Package Manager

Pick from either npm, yarn or pnpm

### Version

The `version` passed in via the Bedframe CLI make command flag (`-v, --version`) or via prompt response is used to set the `version` for both your project's package.json and the (one or more) manifests for the extension(s) in your project.

<blockquote>
<h4>Note</h4>
The `version` in manifest.json is not in semVer while the `version` in pacakge.json must be parseable by <a href="https://github.com/npm/node-semver">node-semver</a>. If you find the two need to be different in your project, you can alternatively pass in the Version Name flag (`--versionName`) and this will be the semVer-valid `version` used in the package.json and as `version_name` in manifest.json.
</blockquote>
<Br />

One to four dot-separated integers identifying the version of this extension. A couple of rules apply to the integers:

The integers must be between `0` and `65535`, inclusive.
Non-zero integers can't start with `0`. For example, `032` is invalid because it begins with a zero.
They must not be all zero. For example, `0` and `0.0.0.0` are invalid while `0.1.0.0` is valid.

Here are some examples of valid versions:

- `"version": "1"`
- `"version": "1.0"`
- `"version": "2.10.2"`
- `"version": "3.1.2.4567"`

If the published extension has a newer version string than the installed extension, then the extension is automatically updated.

The comparison starts with the leftmost integers. Then, if those integers are equal, the integers to the right are compared, and so on. For example, `1.2.0` is a newer version than `1.1.9.9999`.

A missing integer is equal to zero. For example, `1.1.9.9999` is newer than `1.1`, and `1.1.9.9999` is older than `1.2`.

### Browser

### framework

### language

### style

### lintFormat

### git

### gitHooks

### tests

### commitLint

### changesets

### installDeps

### yes

### help
