import { promises as fs } from 'node:fs'
import { existsSync } from 'node:fs'
import path from 'node:path'
import { createRequire } from 'node:module'
import url from 'node:url'
import type prompts from 'prompts'
import { copyFolder } from './copy-folder'
import { ensureDir, outputFile } from './utils.fs'

type TemplateVars = Record<string, string>

function boolLabel(value: unknown): string {
  return value ? 'enabled' : 'disabled'
}

function installCommand(packageManager: string): string {
  switch (packageManager.toLowerCase()) {
    case 'bun':
      return 'bun install'
    case 'pnpm':
      return 'pnpm install'
    case 'yarn':
      return 'yarn'
    default:
      return 'npm install'
  }
}

function directPublishBrowsers(browsers: string[]): string {
  const supported = browsers.filter((browser) =>
    ['chrome', 'firefox', 'edge'].includes(browser.toLowerCase()),
  )
  return supported.length > 0 ? supported.join(' ') : 'chrome'
}

function additionalPages(response: prompts.Answers<string>): string {
  const { override, options, type } = response.extension
  const extensionType = type.name.toLowerCase()
  const pages: string[] = []

  if (options !== 'none') pages.push('options')
  if (override !== 'none') pages.push(override)

  if (extensionType === 'sidepanel') {
    pages.push('sidepanel-welcome', 'sidepanel-main')
  }
  if (extensionType === 'devtools') {
    pages.push('devtools', 'devtools-panel')
  }
  if (extensionType === 'overlay') {
    pages.push('overlay')
  }

  return pages.length > 0 ? pages.join(', ') : 'none'
}

function renderTemplate(template: string, vars: TemplateVars): string {
  let rendered = template
  for (const [key, value] of Object.entries(vars)) {
    rendered = rendered.replaceAll(`{{${key}}}`, value)
  }
  return rendered
}

type SkillsSourceType = 'env' | 'workspace' | 'installed'

interface ResolvedSkillsSource {
  root: string
  source: SkillsSourceType
}

let resolvedSkillsSource: ResolvedSkillsSource | null | undefined

function warnSkills(message: string): void {
  console.warn(`[bedframe] ${message}`)
}

function resolveWorkspaceSkillsRoot(startDir: string): string | null {
  let current = startDir
  while (true) {
    const candidate = path.join(current, 'packages', 'skills')
    const packageJson = path.join(candidate, 'package.json')
    if (existsSync(packageJson)) {
      return candidate
    }
    const parent = path.dirname(current)
    if (parent === current) {
      break
    }
    current = parent
  }
  return null
}

function resolveInstalledSkillsRoot(): string | null {
  try {
    const require = createRequire(import.meta.url)
    const packageJsonPath = require.resolve('@bedframe/skills/package.json')
    return path.dirname(packageJsonPath)
  } catch {
    return null
  }
}

function resolveSkillsSource(): ResolvedSkillsSource | null {
  if (resolvedSkillsSource !== undefined) {
    return resolvedSkillsSource
  }

  const envOverride = process.env.BEDFRAME_SKILLS_PATH
  if (envOverride) {
    const envRoot = path.resolve(envOverride)
    if (existsSync(path.join(envRoot, 'package.json'))) {
      resolvedSkillsSource = { root: envRoot, source: 'env' }
      return resolvedSkillsSource
    }
    warnSkills(
      `BEDFRAME_SKILLS_PATH is set but invalid: ${envRoot}. Expected a directory with package.json.`,
    )
  }

  const __dirname = path.dirname(url.fileURLToPath(import.meta.url))
  const workspaceRoot = resolveWorkspaceSkillsRoot(__dirname)
  if (workspaceRoot) {
    resolvedSkillsSource = { root: workspaceRoot, source: 'workspace' }
    return resolvedSkillsSource
  }

  const installedRoot = resolveInstalledSkillsRoot()
  if (installedRoot) {
    resolvedSkillsSource = { root: installedRoot, source: 'installed' }
    return resolvedSkillsSource
  }

  resolvedSkillsSource = null
  warnSkills(
    'Unable to resolve skills source. Set BEDFRAME_SKILLS_PATH or install @bedframe/skills. Continuing scaffold without skills copy.',
  )
  return resolvedSkillsSource
}

function getSkillsPath(...parts: string[]): string | null {
  const source = resolveSkillsSource()
  if (!source) return null
  return path.join(source.root, ...parts)
}

const skillDirectoryNames = ['bedframe']

function templateVars(response: prompts.Answers<string>): TemplateVars {
  const browsers = response.browser.map((browser: string) => browser.toLowerCase())
  const {
    framework,
    language,
    packageManager,
    lintFormat,
    tests,
    git,
    gitHooks,
    commitLint,
    changesets,
  } = response.development.template.config
  const { manifest, type, override, options } = response.extension

  return {
    project_name: response.extension.name.name,
    extension_purpose: manifest[0].manifest.description,
    package_name: manifest[0].manifest.name,
    release_targets: browsers.join(', '),
    browser_targets: browsers.join(', '),
    extension_type: type.name.toLowerCase(),
    options_mode: options === 'none' ? 'none' : options,
    override_mode: override,
    additional_pages: additionalPages(response),
    framework: framework.toLowerCase(),
    language: language.toLowerCase(),
    package_manager: packageManager.toLowerCase(),
    lint_format: boolLabel(lintFormat),
    tests: boolLabel(tests),
    git: boolLabel(git),
    git_hooks: boolLabel(gitHooks),
    commit_lint: boolLabel(commitLint),
    changesets: boolLabel(changesets),
    install_command: installCommand(packageManager),
    example_dev_browser: browsers[0] ?? 'chrome',
    example_build_browsers: browsers.slice(0, 2).join(',') || 'chrome',
    example_publish_browsers: directPublishBrowsers(browsers),
  }
}

export async function writeAgentContract(
  response: prompts.Answers<string>,
): Promise<void> {
  const rootDir = path.resolve(response.extension.name.path)
  const vars = templateVars(response)

  const projectAgentsTemplatePath = getSkillsPath('AGENTS.md')
  if (projectAgentsTemplatePath && existsSync(projectAgentsTemplatePath)) {
    const projectAgentsTemplate = await fs.readFile(projectAgentsTemplatePath, 'utf8')
    await outputFile(path.join(rootDir, 'AGENTS.md'), projectAgentsTemplate)
  } else {
    warnSkills('AGENTS.md template not found in resolved skills source. Skipping root AGENTS.md generation.')
  }

  const nestedTemplates: Array<{
    source: string
    destination: string
    enabled?: boolean
  }> = [
    {
      source: 'src__config__AGENTS.md',
      destination: path.join(rootDir, 'src', '_config', 'AGENTS.md'),
    },
    {
      source: 'src__manifests__AGENTS.md',
      destination: path.join(rootDir, 'src', 'manifests', 'AGENTS.md'),
    },
    {
      source: 'src__pages__AGENTS.md',
      destination: path.join(rootDir, 'src', 'pages', 'AGENTS.md'),
    },
    {
      source: 'src__scripts__AGENTS.md',
      destination: path.join(rootDir, 'src', 'scripts', 'AGENTS.md'),
    },
    {
      source: 'src__tests__AGENTS.md',
      destination: path.join(rootDir, 'src', '__tests__', 'AGENTS.md'),
      enabled: Boolean(response.development.template.config.tests),
    },
  ]

  for (const template of nestedTemplates) {
    if (template.enabled === false) continue
    const sourcePath = getSkillsPath(
      'bedframe',
      'references',
      'nested-agents',
      template.source,
    )
    if (!sourcePath || !existsSync(sourcePath)) {
      warnSkills(`Nested AGENTS template missing: ${template.source}. Skipping.`)
      continue
    }
    await ensureDir(path.dirname(template.destination))
    const content = await fs.readFile(sourcePath, 'utf8')
    await outputFile(template.destination, renderTemplate(content, vars))
  }
}

export async function installProjectSkills(
  response: prompts.Answers<string>,
): Promise<void> {
  const rootDir = path.resolve(response.extension.name.path)
  const skillsDestination = path.join(rootDir, '.agents', 'skills')
  await ensureDir(skillsDestination)

  for (const skillName of skillDirectoryNames) {
    const sourcePath = getSkillsPath(skillName)
    if (!sourcePath || !existsSync(sourcePath)) {
      warnSkills(`Skill directory not found: ${skillName}. Skipping skill copy.`)
      continue
    }
    await copyFolder(sourcePath, path.join(skillsDestination, skillName))
  }
}
