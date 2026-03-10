import { promises as fs } from 'node:fs'
import path from 'node:path'
import type prompts from 'prompts'
import { resolveDependencyPlan } from '../features/dependency-plan'
import { packageSpecifier } from '../features/versions'
import { parameterizeString } from './write-package-json'

type JsonRecord = Record<string, unknown>

async function readJson(filePath: string): Promise<JsonRecord> {
  const raw = await fs.readFile(filePath, 'utf8')
  try {
    return JSON.parse(raw) as JsonRecord
  } catch {
    const withoutBlockComments = raw.replace(/\/\*[\s\S]*?\*\//g, '')
    const withoutLineComments = withoutBlockComments.replace(/^\s*\/\/.*$/gm, '')
    const withoutTrailingCommas = withoutLineComments.replace(/,\s*([}\]])/g, '$1')
    return JSON.parse(withoutTrailingCommas) as JsonRecord
  }
}

async function writeJson(filePath: string, value: JsonRecord): Promise<void> {
  await fs.writeFile(filePath, `${JSON.stringify(value, null, 2)}\n`)
}

async function resolveViteConfigPaths(
  projectPath: string,
  language: string,
): Promise<{ readPath: string; writePath: string; cleanupPaths: string[] }> {
  const candidates = [
    'vite.config.ts',
    'vite.config.js',
    'vite.config.mts',
    'vite.config.mjs',
  ]
  const preferredName =
    language.toLowerCase() === 'typescript' ? 'vite.config.ts' : 'vite.config.js'
  const preferredPath = path.join(projectPath, preferredName)
  const candidatePaths = candidates.map((candidate) => path.join(projectPath, candidate))

  let readPath = preferredPath

  for (const candidatePath of candidatePaths) {
    try {
      await fs.access(candidatePath)
      readPath = candidatePath
      break
    } catch {
      // Continue checking candidates.
    }
  }

  return {
    readPath,
    writePath: preferredPath,
    cleanupPaths: candidatePaths.filter((candidatePath) => candidatePath !== preferredPath),
  }
}

function updatePackageScripts(
  response: prompts.Answers<string>,
): Record<string, string> {
  const { browser } = response
  const { language, packageManager } = response.development.template.config
  const { lintFormat, tests, git, changesets, commitLint } =
    response.development.template.config

  const pm = packageManager.toLowerCase()
  const pmRun = pm !== 'yarn' ? `${pm} run` : pm

  const scripts: Record<string, string> = {
    dev: 'bedframe dev',
    build: `${language === 'typescript' ? 'tsc && ' : ''}bedframe build`,
    publish: 'bedframe publish -b',
    zip: 'bedframe zip',
  }

  if (changesets) scripts.version = 'bedframe version'
  if (git) {
    scripts.release =
      'gh release create $npm_package_name@$npm_package_version ./dist/*.zip --generate-notes'
  }
  if (lintFormat) {
    scripts.format = 'oxfmt .'
    scripts.lint = 'oxlint --fix .'
    scripts.fix = `${pmRun} format && ${pmRun} lint`
  }
  if (tests) scripts.test = 'vitest run --coverage'
  if (commitLint) scripts.commit = `${lintFormat ? 'lint-staged && ' : ''}cz`
  if (browser.includes('safari')) {
    scripts['convert:safari'] =
      'xcrun safari-web-extension-converter dist/safari --project-location . --app-name $npm_package_name-safari'
  }

  return scripts
}

export async function codemodPackageJson(
  response: prompts.Answers<string>,
): Promise<void> {
  const { path: projectPath } = response.extension.name
  const packageJsonPath = path.join(projectPath, 'package.json')
  const pkg = await readJson(packageJsonPath)

  const dependencyPlan = resolveDependencyPlan(response)
  const resolvedDependencies = Object.fromEntries(
    dependencyPlan.dependencies.map((packageName) => [
      packageName,
      packageSpecifier(packageName),
    ]),
  )
  const resolvedDevDependencies = Object.fromEntries(
    dependencyPlan.devDependencies.map((packageName) => [
      packageName,
      packageSpecifier(packageName),
    ]),
  )

  const extensionManifest = response.extension.manifest[0].manifest
  const extensionAuthor = response.extension.author
  const lintFormat = Boolean(response.development.template.config.lintFormat)
  const commitLint = Boolean(response.development.template.config.commitLint)

  const existingDependencies = (pkg.dependencies ?? {}) as Record<string, string>
  const existingDevDependencies = (pkg.devDependencies ?? {}) as Record<string, string>

  pkg.name = parameterizeString(extensionManifest.name)
  pkg.version = extensionManifest.version
  pkg.description = extensionManifest.description
  pkg.license = response.extension.license
  pkg.private = response.extension.isPrivate
  pkg.type = 'module'
  pkg.author = {
    name: extensionAuthor.name,
    email: extensionAuthor.email,
    url: extensionAuthor.url,
  }
  pkg.scripts = {
    ...(pkg.scripts as Record<string, string> | undefined),
    ...updatePackageScripts(response),
  }
  pkg.dependencies = {
    ...existingDependencies,
    ...resolvedDependencies,
  }
  pkg.devDependencies = {
    ...existingDevDependencies,
    ...resolvedDevDependencies,
  }

  if (lintFormat) {
    pkg['lint-staged'] = {
      '*.{js,jsx,ts,tsx,css,html,json}': 'oxfmt --no-error-on-unmatched-pattern',
      '*.{js,jsx,ts,tsx}': 'oxlint --fix',
    }
  }
  if (commitLint) {
    pkg.commitlint = {
      extends: ['@commitlint/config-conventional'],
    }
    pkg.config = {
      ...(pkg.config as Record<string, unknown> | undefined),
      commitizen: {
        path: './node_modules/cz-conventional-changelog',
      },
    }
  }

  await writeJson(packageJsonPath, pkg)
}

export async function codemodTsconfigFiles(
  response: prompts.Answers<string>,
): Promise<void> {
  const { style, tests } = response.development.template.config
  const { path: projectPath } = response.extension.name
  const isTailwind = String(style).toLowerCase() === 'tailwind'

  const tsconfigPath = path.join(projectPath, 'tsconfig.json')
  const appPath = path.join(projectPath, 'tsconfig.app.json')
  const nodePath = path.join(projectPath, 'tsconfig.node.json')
  const hasAppConfig = await fs
    .access(appPath)
    .then(() => true)
    .catch(() => false)
  const hasNodeConfig = await fs
    .access(nodePath)
    .then(() => true)
    .catch(() => false)

  const rootTsConfig = await readJson(tsconfigPath)
  const existingRootCompilerOptions = (rootTsConfig.compilerOptions ??
    {}) as JsonRecord
  const existingTypes = Array.isArray(existingRootCompilerOptions.types)
    ? (existingRootCompilerOptions.types as unknown[]).filter(
        (typeName): typeName is string => typeof typeName === 'string',
      )
    : []
  const mergedTypes = Array.from(new Set([...existingTypes, '@types/chrome']))
  rootTsConfig.compilerOptions = {
    ...existingRootCompilerOptions,
    baseUrl: '.',
    types: mergedTypes,
    paths: {
      '@/*': ['./src/*'],
    },
  }
  if (hasAppConfig || hasNodeConfig) {
    rootTsConfig.references = [
      { path: './tsconfig.app.json' },
      { path: './tsconfig.node.json' },
    ]
  }
  await writeJson(tsconfigPath, rootTsConfig)

  if (!hasAppConfig && !hasNodeConfig) {
    return
  }

  let appTsConfig: JsonRecord = {}
  try {
    appTsConfig = await readJson(appPath)
  } catch {
    appTsConfig = {}
  }
  appTsConfig.compilerOptions = {
    ...((appTsConfig.compilerOptions as JsonRecord | undefined) ?? {}),
    types: ['@bedframe/core', ...(tests ? ['jest'] : []), '@types/chrome'],
    moduleResolution: 'bundler',
    noEmit: true,
    strict: true,
    noUnusedLocals: true,
    noUnusedParameters: true,
    noFallthroughCasesInSwitch: true,
    paths: {
      '@/*': ['./src/*'],
    },
  }
  appTsConfig.include = ['src']
  appTsConfig.exclude = ['src/manifests', 'src/_config/bedframe.config.ts']
  await writeJson(appPath, appTsConfig)

  let nodeTsConfig: JsonRecord = {}
  try {
    nodeTsConfig = await readJson(nodePath)
  } catch {
    nodeTsConfig = {}
  }
  nodeTsConfig.compilerOptions = {
    ...((nodeTsConfig.compilerOptions as JsonRecord | undefined) ?? {}),
    moduleResolution: 'bundler',
    noEmit: true,
    strict: true,
    noUnusedLocals: true,
    noUnusedParameters: true,
    noFallthroughCasesInSwitch: true,
    paths: {
      '@/*': ['./src/*'],
    },
  }
  nodeTsConfig.include = [
    'src/manifests',
    'package.json',
    'vite.config.ts',
    ...(isTailwind ? ['tailwind.config.js', 'postcss.config.js'] : []),
    'src/_config/bedframe.config.ts',
  ]
  await writeJson(nodePath, nodeTsConfig)
}

export async function codemodViteConfig(
  response: prompts.Answers<string>,
): Promise<void> {
  const { tests, style, language, framework } = response.development.template.config
  const isTailwind = String(style).toLowerCase() === 'tailwind'
  const frameworkName = String(framework).toLowerCase()
  const { path: projectPath } = response.extension.name
  const { readPath, writePath, cleanupPaths } = await resolveViteConfigPaths(
    projectPath,
    String(language),
  )
  let source = ''
  try {
    source = await fs.readFile(readPath, 'utf8')
  } catch {
    source = ''
  }
  source = source.replace(
    /^import\s*\{[^}]*\}\s*from\s*['"]@bedframe\/core['"]\s*\n?/m,
    "import { bedframe } from '@bedframe/core'\n",
  )

  const ensureImport = (line: string, match: RegExp): void => {
    if (!match.test(source)) {
      source = `${line}\n${source}`
    }
  }

  source = source.replace(/^.*@vitejs\/plugin-react.*\n?/gm, '')
  source = source.replace(/^.*@vitejs\/plugin-vue.*\n?/gm, '')
  source = source.replace(/^.*@sveltejs\/vite-plugin-svelte.*\n?/gm, '')
  source = source.replace(/^.*@preact\/preset-vite.*\n?/gm, '')

  ensureImport(
    "import { bedframe } from '@bedframe/core'",
    /from ['"]@bedframe\/core['"]/,
  )
  ensureImport(
    "import { defineConfig } from 'vite'",
    /from ['"]vite['"]/,
  )
  ensureImport(
    "import { resolve } from 'node:path'",
    /resolve\s*\}\s*from ['"]node:path['"]|resolve\s+from ['"]node:path['"]/,
  )
  ensureImport(
    "import bedframeConfig from './src/_config/bedframe.config'",
    /from ['"]\.\/src\/_config\/bedframe\.config['"]/,
  )

  let frameworkPluginCall = ''
  if (frameworkName === 'react') {
    ensureImport(
      "import react from '@vitejs/plugin-react'",
      /from ['"]@vitejs\/plugin-react['"]/,
    )
    frameworkPluginCall = 'react(),'
  } else if (frameworkName === 'vue') {
    ensureImport(
      "import vue from '@vitejs/plugin-vue'",
      /from ['"]@vitejs\/plugin-vue['"]/,
    )
    frameworkPluginCall = 'vue(),'
  } else if (frameworkName === 'svelte') {
    ensureImport(
      "import { svelte } from '@sveltejs/vite-plugin-svelte'",
      /from ['"]@sveltejs\/vite-plugin-svelte['"]/,
    )
    frameworkPluginCall = 'svelte(),'
  } else if (frameworkName === 'preact') {
    ensureImport(
      "import preact from '@preact/preset-vite'",
      /from ['"]@preact\/preset-vite['"]/,
    )
    frameworkPluginCall = 'preact(),'
  }

  if (isTailwind) {
    ensureImport(
      "import tailwindcss from '@tailwindcss/vite'",
      /from ['"]@tailwindcss\/vite['"]/,
    )
  } else {
    source = source.replace(/^.*@tailwindcss\/vite.*\n?/gm, '')
  }

  source = source.replace(
    /import\s+path\s+from\s+['"]node:path['"]/g,
    "import path, { resolve } from 'node:path'",
  )
  source = source.replace(/^import\s+path\s+from\s+['"]path['"]\s*\n?/gm, '')

  source = source
    .replace(
      /const\s*\{\s*manifest,\s*pages\s*\}\s*=\s*bedframeConfig\.extension\s*\n?/g,
      '',
    )
    .replace(
      /const\s*\{[\s\S]*?\}\s*=\s*bedframeConfig\.development\.template\.config\s*\n?/g,
      '',
    )
    .replace(/export\s+default\s+defineConfig\([\s\S]*?\)\s*$/m, '')
    .trimEnd()

  const block = `
const { manifest, pages } = bedframeConfig.extension
const {
  ${tests ? 'tests,' : ''}
} = bedframeConfig.development.template.config

export default defineConfig(({ mode }) => ({
  root: resolve(__dirname, './src'),
  publicDir: resolve(__dirname, 'public'),
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
  plugins: [
    bedframe(manifest),
    ${frameworkPluginCall}
    ${isTailwind ? 'tailwindcss(),' : ''}
  ],
  build: {
    outDir: resolve(__dirname, 'dist', mode),
    emptyOutDir: true,
    rollupOptions: {
      input: pages,
    },
  },
  ${tests ? 'test: tests,' : ''}
  server: {
    port: Number(process.env.BEDFRAME_DEV_PORT) || 5173,
    cors: {
      origin: [/chrome-extension:\\/\\//],
    },
  },
}))
`

  await fs.writeFile(writePath, `${source}\n${block.trimStart()}\n`)
  await Promise.all(
    cleanupPaths.map(async (cleanupPath) => {
      await fs.rm(cleanupPath, { force: true })
    }),
  )
}
