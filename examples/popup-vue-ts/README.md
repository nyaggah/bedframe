  <div>
  >_<br />
  <br />
  <span style="color:#c792e9">B R O W S E R</span><br />
  <span style="color: #c3e88d">E X T E N S I O N</span><br />
  <span style="color: #8addff">D E V E L O P M E N T</span><br />
  <span style="color: #ffcb6b">F R A M E W O R K</span><br />
</div>

<br />

# Popup Extension - Vue 3 + TypeScript + Vite

A browser extension built with [Bedframe](https://bedframe.dev), a modern framework for cross-browser extension development.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Run tests
npm run test
```

## 📋 Project Overview

This is a **popup extension** that also includes embedded options. The extension is built using the Bedframe framework, which provides a unified development experience across multiple browsers.

### Extension Type

- **Primary**: Popup extension
- **Options**: Embedded options page

### Supported Browsers

- Chrome
- Brave
- Opera
- Edge
- Firefox
- Safari

## 🏗️ Architecture & Tech Stack

### Core Framework

- **[Bedframe](https://bedframe.dev)** - Cross-browser extension development framework
- **Vue 3** - Progressive JavaScript framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server

### Styling & UI

- **Tailwind CSS v4** - Utility-first CSS framework
- **shadcn/ui** - Component library (New York theme)
- **Inter Font** - Typography with multiple weights (400, 600, 700, 800)

### Development Tools

- **npm** - Package manager and runtime
- **Vitest** - Testing framework with Happy DOM
- **Prettier** - Code formatting
- **Oxlint** - Fast linting
- **Lefthook** - Git hooks management

### Quality Assurance

- **Conventional Commits** - Standardized commit messages
- **Commitizen** - Interactive commit prompts
- **Commitlint** - Commit message validation
- **Lint-staged** - Pre-commit linting
- **Changesets** - Version management

## 📁 Project Structure

```
src/
├── _config/                 # Configuration files
│   ├── bedframe.config.ts   # Main Bedframe configuration
│   ├── shadcn.config.ts     # shadcn/ui configuration
│   └── tests.config.ts      # Test configuration
├── assets/                  # Static assets
│   ├── fonts/              # Inter font files
│   └── icons/              # Extension icons
├── components/             # Vue components
│   ├── App.vue            # Main app component
│   ├── HelloWorld.vue     # Example component
│   └── options.vue        # Options page component
├── manifests/             # Browser-specific manifests
│   ├── base.manifest.ts   # Base manifest configuration
│   ├── chrome.ts         # Chrome-specific manifest
│   ├── brave.ts          # Brave-specific manifest
│   ├── opera.ts          # Opera-specific manifest
│   ├── edge.ts           # Edge-specific manifest
│   ├── firefox.ts        # Firefox-specific manifest
│   └── safari.ts         # Safari-specific manifest
├── pages/                # HTML entry points
│   ├── main.html         # Main popup page
│   └── options.html      # Options page
├── scripts/              # Extension scripts
│   └── service-worker.ts # Service worker
└── styles/               # Global styles
    └── style.css         # Main stylesheet
```

## ⚙️ Configuration

The project configuration is centralized in `src/_config/bedframe.config.ts` and organized into three distinct categories:

### 1. Browser Configuration

Defines which browsers are targeted and their specific manifests:

```typescript
browser: [
  chrome.browser,
  brave.browser,
  opera.browser,
  edge.browser,
  firefox.browser,
  safari.browser,
]
```

### 2. Extension Configuration

Defines the extension type and behavior:

```typescript
extension: {
  type: 'popup',
  options: 'embedded',
  manifest: [chrome, brave, opera, edge, firefox, safari],
  pages: {
    main: 'src/pages/main.html',
    options: 'src/pages/options.html',
  },
}
```

### 3. Development Configuration

Defines the development stack and tooling:

```typescript
development: {
  template: {
    config: {
      framework: 'vue',
      language: 'typescript',
      packageManager: 'npm',
      style: {
        framework: 'tailwind',
        components: 'shadcn',
        theme: 'new-york',
        fonts: [/* Inter font configuration */],
      },
      lintFormat: true,
      tests: {/* Test configuration */},
      git: true,
      gitHooks: true,
      commitLint: true,
      changesets: true,
    },
  },
}
```

## 🔧 Development Workflow

### Git Hooks (Lefthook)

The project uses Lefthook for managing Git hooks:

- **pre-commit**: Runs lint-staged to format and lint changed files
- **commit-msg**: Validates commit messages using conventional commits
- **prepare-commit-msg**: Opens interactive commit prompt with Commitizen

### Available Scripts

```bash
# Development
npm run dev              # Start development server
npm run build            # Build for production
npm run test             # Run tests with coverage
npm run format           # Format code with Prettier
npm run lint             # Lint code with Oxlint
npm run fix              # Format and lint code

# Extension Management
npm run zip              # Create extension zip file
npm run publish          # Publish extension
npm run version          # Version management with Changesets

# Safari Conversion
npm run convert:safari   # Convert to Safari Web Extension
```

### Testing

- **Framework**: Vitest with Happy DOM
- **Coverage**: Istanbul provider with text, JSON, and HTML reports
- **Setup**: Global test environment with custom setup files

### Code Quality

- **Linting**: Oxlint for fast JavaScript/TypeScript linting
- **Formatting**: Prettier with Tailwind CSS plugin
- **Type Safety**: TypeScript with strict configuration
- **Conventional Commits**: Standardized commit message format

## 🚀 Deployment

### Local Building

```bash
# Build for all browsers
npm run build

# Build for specific browser
npm run build --mode chrome
npm run build --mode firefox
```

### Automated Publishing via GitHub Actions

The project uses GitHub Actions for automated publishing to extension stores. The workflow is triggered on pushes to the `main` branch and can also be manually triggered.

#### Workflow: `.github/workflows/mvp.yml`

The **MVP (Make, Version & Publish)** workflow handles the complete release process:

1. **Build & Test**

   - Builds the extension for all browsers
   - Runs formatting and linting
   - Executes unit tests

2. **Version Management**

   - Uses Changesets to create or update release pull requests
   - Automatically manages versioning based on conventional commits

3. **Release Creation**

   - Creates GitHub releases with release notes
   - Generates extension zip files for distribution

4. **Store Publishing**
   - **Chrome Web Store**: Uploads to Chrome Web Store
   - **Firefox Add-ons**: Uploads to Mozilla Add-ons (AMO)
   - **Edge Add-ons**: Uploads to Microsoft Edge Add-ons

#### Required Secrets

The workflow requires the following GitHub secrets for publishing:

**Chrome Web Store:**

- `EXTENSION_ID`
- `CLIENT_ID`
- `CLIENT_SECRET`
- `REFRESH_TOKEN`

**Firefox Add-ons:**

- `WEB_EXT_API_KEY`
- `WEB_EXT_API_SECRET`

**Edge Add-ons:**

- `EDGE_PRODUCT_ID`
- `EDGE_CLIENT_ID`
- `EDGE_CLIENT_SECRET`

### Dependency Management

The project includes automated dependency updates via Dependabot:

- **Schedule**: Weekly updates on Saturdays
- **Strategy**: Version increase for non-dev dependencies
- **Labels**: Automatically labels PRs with 'dependencies'
- **Conventional Commits**: Uses `fix(deps)` prefix for releases

## 📚 Key Features

- **Cross-browser compatibility** - Works on Chrome, Brave, Opera, Edge, Firefox, and Safari
- **Modern development stack** - Vue 3, TypeScript, Tailwind CSS
- **Quality assurance** - Automated testing, linting, and formatting
- **Git workflow** - Conventional commits with automated validation
- **Component library** - shadcn/ui components with New York theme
- **Font optimization** - Inter font with multiple weights
- **Service worker** - Background script for extension functionality
- **Automated publishing** - CI/CD pipeline for extension store deployment

## Using this example template

### 1. Clone example repo and remove git history:

```bash
npx degit nyaggah/bedframe/examples/popup-vue-ts my-popup-vue-ts
```

### 2. Change into that directory:

```bash
cd my-popup-vue-ts
```

### 3. Rename the files and folders

Find all files in the root directory that start with `__` leading double underscores to have a leading `.` dot:

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

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

## 🔗 Resources

- [Bedframe Documentation](https://bedframe.dev)
- [Vue Documentation](https://vuejs.org)
- [Tailwind CSS Documentation](https://tailwindcss.com)
- [shadcn/ui Documentation](https://ui.shadcn.com)
- [Conventional Commits](https://www.conventionalcommits.org)
