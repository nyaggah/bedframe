import { join, resolve } from 'node:path'
import type prompts from 'prompts'
import { ensureWriteFile, outputFile } from './utils.fs'

export function writeReadMe(response: prompts.Answers<string>): void {
  const { name: projectName, path: projectPath } = response.extension.name
  const { browser: browsers } = response
  const { manifest, license } = response.extension
  const {
    type,
    override: overridePage,
    options: optionsPage,
  } = response.extension
  const { name: extensionType } = type

  const {
    framework,
    language,
    packageManager,
    lintFormat,
    tests: hasTests,
    style,
    git,
    gitHooks,
    changesets,
    commitLint,
  } = response.development.template.config

  const projectDescription = manifest[0].manifest.description

  const pm = packageManager.toLowerCase()
  const pmInstall = pm === 'yarn' ? 'yarn' : `${pm} install`

  const isStyle = {
    tailwind: style.toLowerCase() === 'tailwind',
  }

  const readMePath = resolve(join(projectPath, 'README.md'))
  const backTicks = '```'

  // Generate extension type description
  const getExtensionTypeDescription = () => {
    const typeDescriptions: Record<string, string> = {
      popup: 'Popup extension',
      overlay: 'Overlay extension (content script)',
      sidepanel: 'Sidepanel extension',
      devtools: 'DevTools extension',
    }
    return typeDescriptions[extensionType] || 'Browser extension'
  }

  // Generate additional features description
  const getAdditionalFeatures = () => {
    const features = []
    if (overridePage !== 'none') {
      features.push(`${overridePage} page override`)
    }
    if (optionsPage !== 'none') {
      features.push(`${optionsPage} options page`)
    }
    return features.length > 0 ? ` that also ${features.join(' and ')}` : ''
  }

  // Generate supported browsers list
  const getSupportedBrowsers = () => {
    return browsers
      .map(
        (browser: string) => browser.charAt(0).toUpperCase() + browser.slice(1),
      )
      .join('\n- ')
  }

  // Generate project structure based on extension type
  const getProjectStructure = () => {
    let structure = `src/
├── _config/                 # Configuration files
│   ├── bedframe.config.ts   # Main Bedframe configuration
│   ${isStyle.tailwind ? '├── shadcn.config.ts     # shadcn/ui configuration\n│   ' : ''}└── tests.config.ts      # Test configuration
├── assets/                  # Static assets
│   ├── fonts/              # Inter font files
│   └── icons/              # Extension icons
├── components/             # React components
│   ├── app.tsx            # Main app component
│   ├── intro.tsx          # Welcome/intro component
│   └── layout.tsx         # Layout wrapper`

    // Add extension-specific components
    if (extensionType === 'sidepanel') {
      structure += `
│   ├── sidepanel-main.tsx # Main sidepanel
│   └── sidepanel-welcome.tsx # Welcome sidepanel`
    }
    if (extensionType === 'overlay') {
      structure += `
│   └── content.tsx        # Content script component`
    }
    if (extensionType === 'devtools') {
      structure += `
│   └── devtools.tsx       # DevTools component`
    }
    if (overridePage !== 'none') {
      structure += `
│   └── ${overridePage}.tsx        # ${overridePage} page component`
    }
    if (optionsPage !== 'none') {
      structure += `
│   └── options.tsx        # Options page component`
    }

    structure += `
├── manifests/             # Browser-specific manifests
│   ├── base.manifest.ts   # Base manifest configuration`

    // Add browser manifests
    browsers.forEach((browser: string) => {
      structure += `
│   ├── ${browser}.ts         # ${browser.charAt(0).toUpperCase() + browser.slice(1)}-specific manifest`
    })

    structure += `
├── pages/                # HTML entry points`

    if (extensionType === 'sidepanel') {
      structure += `
│   ├── sidepanel-main.html # Main sidepanel
│   └── sidepanel-welcome.html # Welcome sidepanel`
    }
    if (extensionType === 'overlay') {
      structure += `
│   └── main.html          # Main overlay page`
    }
    if (extensionType === 'devtools') {
      structure += `
│   └── devtools.html      # DevTools page`
    }
    if (overridePage !== 'none') {
      structure += `
│   └── ${overridePage}.html       # ${overridePage} page`
    }
    if (optionsPage !== 'none') {
      structure += `
│   └── options.html       # Options page`
    }

    structure += `
├── scripts/              # Extension scripts
│   └── service-worker.ts # Service worker
${extensionType === 'overlay' ? '│   └── content.tsx       # Content script\n' : ''}└── styles/               # Global styles
    └── style.css         # Main stylesheet`

    return structure
  }

  // Generate available scripts section
  const getAvailableScripts = () => {
    let scripts = `# Development
${pm} run dev              # Start development server
${pm} run build            # Build for production`

    if (hasTests) {
      scripts += `
${pm} run test             # Run tests with coverage`
    }

    if (lintFormat) {
      scripts += `
${pm} run format           # Format code with Prettier
${pm} run lint             # Lint code with Oxlint
${pm} run fix              # Format and lint code`
    }

    scripts += `
# Extension Management
${pm} run zip              # Create extension zip file
${pm} run publish          # Publish extension`

    if (changesets) {
      scripts += `
${pm} run version          # Version management with Changesets`
    }

    if (browsers.includes('safari')) {
      scripts += `
# Safari Conversion
${pm} run convert:safari   # Convert to Safari Web Extension`
    }

    return scripts
  }

  // Generate tech stack section
  const getTechStack = () => {
    let stack = `### Core Framework

- **[Bedframe](https://bedframe.dev)** - Cross-browser extension development framework
- **React 19** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server`

    if (isStyle.tailwind) {
      stack += `

### Styling & UI

- **Tailwind CSS v4** - Utility-first CSS framework
- **shadcn/ui** - Component library (New York theme)
- **Inter Font** - Typography with multiple weights (400, 600, 700, 800)`
    }

    stack += `

### Development Tools

- **${packageManager.charAt(0).toUpperCase() + packageManager.slice(1)}** - Package manager and runtime`

    if (hasTests) {
      stack += `
- **Vitest** - Testing framework with Happy DOM`
    }

    if (lintFormat) {
      stack += `
- **Prettier** - Code formatting
- **Oxlint** - Fast linting`
    }

    if (gitHooks) {
      stack += `
- **Lefthook** - Git hooks management`
    }

    if (commitLint) {
      stack += `

### Quality Assurance

- **Conventional Commits** - Standardized commit messages
- **Commitizen** - Interactive commit prompts
- **Commitlint** - Commit message validation`
    }

    if (lintFormat) {
      stack += `
- **Lint-staged** - Pre-commit linting`
    }

    if (changesets) {
      stack += `
- **Changesets** - Version management`
    }

    return stack
  }

  // Generate configuration section
  const getConfigurationSection = () => {
    let config = `The project configuration is centralized in \`src/_config/bedframe.config.ts\` and organized into three distinct categories:

### 1. Browser Configuration

Defines which browsers are targeted and their specific manifests:

${backTicks}typescript
browser: [
${browsers.map((browser: string) => `  ${browser}.browser,`).join('\n')}
]
${backTicks}

### 2. Extension Configuration

Defines the extension type and behavior:

${backTicks}typescript
extension: {
  type: '${extensionType}',${
    overridePage !== 'none'
      ? `
  overrides: '${overridePage}',`
      : ''
  }${
    optionsPage !== 'none'
      ? `
  options: '${optionsPage}',`
      : ''
  }
  manifest: [${browsers.join(', ')}],`

    if (extensionType === 'sidepanel') {
      config += `
  pages: {
    welcome: 'src/pages/sidepanel-welcome.html',
    main: 'src/pages/sidepanel-main.html',${
      overridePage !== 'none'
        ? `
    ${overridePage}: 'src/pages/${overridePage}.html',`
        : ''
    }
  },`
    } else if (extensionType === 'overlay') {
      config += `
  pages: {
    overlay: 'src/pages/main.html',${
      overridePage !== 'none'
        ? `
    ${overridePage}: 'src/pages/${overridePage}.html',`
        : ''
    }
  },`
    } else if (extensionType === 'devtools') {
      config += `
  pages: {
    devtools: 'src/pages/devtools.html',${
      overridePage !== 'none'
        ? `
    ${overridePage}: 'src/pages/${overridePage}.html',`
        : ''
    }
  },`
    } else if (overridePage !== 'none') {
      config += `
  pages: {
    ${overridePage}: 'src/pages/${overridePage}.html',
  },`
    }

    config += `
}
${backTicks}

### 3. Development Configuration

Defines the development stack and tooling:

${backTicks}typescript
development: {
  template: {
    config: {
      framework: '${framework}',
      language: '${language}',
      packageManager: '${packageManager}',
      style: {
        framework: '${style}',${
          isStyle.tailwind
            ? `
        components: 'shadcn',
        theme: 'new-york',`
            : ''
        }
        fonts: [/* Inter font configuration */],
      },${
        lintFormat
          ? `
      lintFormat: true,`
          : ''
      }${
        hasTests
          ? `
      tests: {/* Test configuration */},`
          : ''
      }${
        git
          ? `
      git: true,`
          : ''
      }${
        gitHooks
          ? `
      gitHooks: true,`
          : ''
      }${
        commitLint
          ? `
      commitLint: true,`
          : ''
      }${
        changesets
          ? `
      changesets: true,`
          : ''
      }
    },
  },
}
${backTicks}`

    return config
  }

  // Generate development workflow section
  const getDevelopmentWorkflow = () => {
    let workflow = ''

    if (gitHooks) {
      workflow += `### Git Hooks (Lefthook)

The project uses Lefthook for managing Git hooks:

- **pre-commit**: Runs lint-staged to format and lint changed files
- **commit-msg**: Validates commit messages using conventional commits
- **prepare-commit-msg**: Opens interactive commit prompt with Commitizen

`
    }

    workflow += `### Available Scripts

${backTicks}bash
${getAvailableScripts()}
${backTicks}`

    if (hasTests) {
      workflow += `
### Testing

- **Framework**: Vitest with Happy DOM
- **Coverage**: Istanbul provider with text, JSON, and HTML reports
- **Setup**: Global test environment with custom setup files

`
    }

    if (lintFormat) {
      workflow += `### Code Quality

- **Linting**: Oxlint for fast JavaScript/TypeScript linting
- **Formatting**: Prettier with Tailwind CSS plugin
- **Type Safety**: TypeScript with strict configuration`
    }

    if (commitLint) {
      workflow += `
- **Conventional Commits**: Standardized commit message format`
    }

    return workflow
  }

  // Generate deployment section
  const getDeploymentSection = () => {
    let deployment = `### Local Building

${backTicks}bash
# Build for all browsers
${pm} run build

# Build for specific browser
${pm} run build --mode chrome
${pm} run build --mode firefox
${backTicks}`

    if (git) {
      deployment += `

### Automated Publishing via GitHub Actions

The project uses GitHub Actions for automated publishing to extension stores. The workflow is triggered on pushes to the \`main\` branch and can also be manually triggered.

#### Workflow: \`.github/workflows/mvp.yml\`

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

- \`EXTENSION_ID\`
- \`CLIENT_ID\`
- \`CLIENT_SECRET\`
- \`REFRESH_TOKEN\`

**Firefox Add-ons:**

- \`WEB_EXT_API_KEY\`
- \`WEB_EXT_API_SECRET\`

**Edge Add-ons:**

- \`EDGE_PRODUCT_ID\`
- \`EDGE_CLIENT_ID\`
- \`EDGE_CLIENT_SECRET\`

### Dependency Management

The project includes automated dependency updates via Dependabot:

- **Schedule**: Weekly updates on Saturdays
- **Strategy**: Version increase for non-dev dependencies
- **Labels**: Automatically labels PRs with 'dependencies'
- **Conventional Commits**: Uses \`fix(deps)\` prefix for releases`
    }

    return deployment
  }

  // Generate key features section
  const getKeyFeatures = () => {
    const features = [
      '**Cross-browser compatibility** - Works on ' +
        browsers
          .map((b: string) => b.charAt(0).toUpperCase() + b.slice(1))
          .join(', '),
      '**Modern development stack** - React 19, TypeScript' +
        (isStyle.tailwind ? ', Tailwind CSS' : ''),
      '**Quality assurance** - Automated testing, linting, and formatting',
      '**Git workflow** - Conventional commits with automated validation',
    ]

    if (isStyle.tailwind) {
      features.push(
        '**Component library** - shadcn/ui components with New York theme',
      )
      features.push('**Font optimization** - Inter font with multiple weights')
    }

    features.push(
      '**Service worker** - Background script for extension functionality',
    )

    if (git) {
      features.push(
        '**Automated publishing** - CI/CD pipeline for extension store deployment',
      )
    }

    return features.join('\n- ')
  }

  const readMeContent = `<div>
  >_<br />
  <br />
  <span style="color:#c792e9">B R O W S E R</span><br />
  <span style="color: #c3e88d">E X T E N S I O N</span><br />
  <span style="color: #8addff">D E V E L O P M E N T</span><br />
  <span style="color: #ffcb6b">F R A M E W O R K</span><br />
</div>

<br />

# ${projectName} - Browser Extension

${projectDescription}

A browser extension built with [Bedframe](https://bedframe.dev), a modern framework for cross-browser extension development.

## 🚀 Quick Start

${backTicks}bash
# Install dependencies
${pmInstall}

# Start development server
${pm} run dev

# Build for production
${pm} run build${
    hasTests
      ? `

# Run tests
${pm} run test`
      : ''
  }
${backTicks}

## 📋 Project Overview

This is a **${getExtensionTypeDescription().toLowerCase()}**${getAdditionalFeatures()}. The extension is built using the Bedframe framework, which provides a unified development experience across multiple browsers.

### Extension Type

- **Primary**: ${getExtensionTypeDescription()}
${overridePage !== 'none' ? `- **Additional**: ${overridePage.charAt(0).toUpperCase() + overridePage.slice(1)} override` : ''}${
    optionsPage !== 'none'
      ? `
- **Options**: ${optionsPage} options page`
      : ''
  }

### Supported Browsers

- ${getSupportedBrowsers()}

## 🏗️ Architecture & Tech Stack

${getTechStack()}

## 📁 Project Structure

${backTicks}
${getProjectStructure()}
${backTicks}

## ⚙️ Configuration

${getConfigurationSection()}

## 🔧 Development Workflow

${getDevelopmentWorkflow()}

## 🚀 Deployment

${getDeploymentSection()}

## 📚 Key Features

- ${getKeyFeatures()}

## 📄 License

${license} License - see [LICENSE](LICENSE) file for details.

## 🔗 Resources

- [Bedframe Documentation](https://bedframe.dev)
- [React Documentation](https://react.dev)${
    isStyle.tailwind
      ? `
- [Tailwind CSS Documentation](https://tailwindcss.com)
- [shadcn/ui Documentation](https://ui.shadcn.com)`
      : ''
  }${
    commitLint
      ? `
- [Conventional Commits](https://www.conventionalcommits.org)`
      : ''
  }
`

  ensureWriteFile(readMePath)
    .then(() =>
      outputFile(readMePath, readMeContent).catch((error) =>
        console.error(error),
      ),
    )
    .catch(console.error)
}
