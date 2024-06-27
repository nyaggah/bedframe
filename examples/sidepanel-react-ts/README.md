  <div>
  >_<br />
  <br />
  <span style="color:#c792e9">B R O W S E R</span><br />
  <span style="color: #c3e88d">E X T E N S I O N</span><br />
  <span style="color: #8addff">D E V E L O P M E N T</span><br />
  <span style="color: #ffcb6b">F R A M E W O R K</span><br />
</div>

<br />

# Side Panel Extension - React + TypeScript + Vite

The default Bedframe setup generates production-ready cross-browser extension BED code complete with sensible default configurations for:

- **Required**: base framework configuration (e.g. Vite + Metaframework and Language config e.g React w/ TypeScript)
- **Recommended**: linting & formating (w/ eslint + prettier w/ lint-staged)
- **Recommended**: source control (w/ git)
  - publish/ release workflows (ci/cd w/ github actions)
  - automated dependency updates (w/ dependapot workflows)
  - conventional commits and git hooks (commitizen + commitlint)
  - changesets (w/ changesets)
    - conventional changelog
- **Optional**: tests (unit testing w/ Vitest)

## Bedframe (default) project structure

```bash
  >_ bedframe-project/
  ├ .git/
  ├ .github/
  │ ├ ○ assets/
  │ │ └ ○ fonts/
  ├ .changeset/
  ├ .husky/
  ├ ○ public/
  │ ├ ○ assets/
  │ │ ├ ○ fonts/
  │ │ └ ○ icons/
  ├ ○ src/
  │ ├ ○ _config/
  │ │ ├ ○ bedframe.config.ts
  │ │ └ ○ tests.config.ts
  │ ├ ○ components/
  │ ├ ○ manifests/
  │ │ ├ ○ chrome.ts
  │ │ ├ ○ brave.ts
  │ │ ├ ○ opera.ts
  │ │ ├ ○ edge.ts
  │ │ ├ ○ firefox.ts
  │ │ └ ○ safari.ts
  │ ├ ○ pages/
  │ │ ├ ○ newtab/
  │ │ └ ○ options/
  │ ├ ○ scripts/
  │ ├ └ ○ service-worker.ts
  │ └ ○ styles/
  ├ .gitignore
  ├ .prettierignore
  ├ ○ package.json
  ├ ○ README.md
  ├ ○ tsconfig.json
  ├ ○ tsconfig.node.json
  └ ○ vite.config.ts
```

## Using this example template

### 1. Clone example repo and remove git history:

```bash
npx degit nyaggah/bedframe/examples/sidepanel-react-ts my-sidepanel-react-ts
```

### 2. Change into that directory:

```bash
cd my-sidepanel-react-ts
```

### 3. Rename the dot files and folders

Find all files in the root directory that start with `__` leading double underscores and rename to have a leading `.` dot:

- \_\_changeset/
- \_\_github/
- \_\_husky/
- \_\_vscode/
- \_\_env.example

```bash
# macOS / Unix-like systems
for file in __*; do mv "$file" ".${file:2}"; done

# windows
Get-ChildItem -Name __* | Rename-Item -NewName {$_ -replace '^__','.'}
```

### 4. Install dependencies

install project dependencies

```bash
npm install
```

### 5. Develop extension(s) locally

```bash
# start vite dev server for all extensions concurrently
npm run dev

# start vite dev server for 1 extension
npm run dev chrome

# start vite dev server for multiple extension(s) concurrently

# ^^^ see console output; might need to open different terminals for each
npm run dev chrome,firefox,edge
```

### 6. Build extension(s)

```bash
# build all extensions concurrently
npm run build

# build only 1 extension
npm run build chrome

# build only multiple extension(s) concurrently
npm run build chrome,firefox,edge
```
