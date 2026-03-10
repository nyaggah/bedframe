import { existsSync, readFileSync } from 'node:fs'
import path from 'node:path'
import { createRequire } from 'node:module'
import { fileURLToPath } from 'node:url'

type PackageJsonShape = {
  name?: string
  version?: string
}

const require = createRequire(import.meta.url)

function readVersion(packageJsonPath: string): string {
  const packageJson = JSON.parse(
    readFileSync(packageJsonPath, 'utf8'),
  ) as PackageJsonShape

  if (!packageJson.version) {
    throw new Error(`Missing version in ${packageJsonPath}`)
  }

  return packageJson.version
}

function readPackageName(packageJsonPath: string): string | undefined {
  const packageJson = JSON.parse(
    readFileSync(packageJsonPath, 'utf8'),
  ) as PackageJsonShape
  return packageJson.name
}

function resolvePackageJsonUpwards(
  startDir: string,
  packageName: string,
): string {
  let currentDir = startDir

  while (true) {
    const candidate = path.join(currentDir, 'package.json')

    try {
      if (readPackageName(candidate) === packageName) {
        return candidate
      }
    } catch {
      // Continue walking up until a matching package root is found.
    }

    const parent = path.dirname(currentDir)
    if (parent === currentDir) {
      throw new Error(`Unable to resolve ${packageName} package.json from ${startDir}`)
    }
    currentDir = parent
  }
}

function resolveCurrentCliVersion(): string {
  const __dirname = path.dirname(fileURLToPath(import.meta.url))
  const packageJsonPath = resolvePackageJsonUpwards(__dirname, '@bedframe/cli')
  return readVersion(packageJsonPath)
}

function resolveCurrentCoreVersion(): string {
  const resolvedEntry = require.resolve('@bedframe/core')
  const packageJsonPath = path.resolve(path.dirname(resolvedEntry), '..', 'package.json')
  return readVersion(packageJsonPath)
}

const dynamicVersionPackages = {
  '@bedframe/cli': `^${resolveCurrentCliVersion()}`,
  '@bedframe/core': `^${resolveCurrentCoreVersion()}`,
} as const

const cliPackageJsonPath = resolvePackageJsonUpwards(
  path.dirname(fileURLToPath(import.meta.url)),
  '@bedframe/cli',
)
const repoRootPath = path.resolve(path.dirname(cliPackageJsonPath), '..', '..')
const cliTarballPath = path.join(
  repoRootPath,
  'packages',
  'cli',
  `bedframe-cli-${resolveCurrentCliVersion()}.tgz`,
)
const coreTarballPath = path.join(
  repoRootPath,
  'packages',
  'core',
  `bedframe-core-${resolveCurrentCoreVersion()}.tgz`,
)

const localBedframeTarballs = {
  '@bedframe/cli': `file:${cliTarballPath}`,
  '@bedframe/core': `file:${coreTarballPath}`,
} as const

const publishedBedframeSpecifiers = {
  '@bedframe/cli': `^${resolveCurrentCliVersion()}`,
  '@bedframe/core': `^${resolveCurrentCoreVersion()}`,
} as const

export function packageSpecifier(packageName: string): string {
  if (packageName in dynamicVersionPackages && packageName in localBedframeTarballs) {
    const localSpecifier =
      localBedframeTarballs[packageName as keyof typeof localBedframeTarballs]
    const localTarballPath = localSpecifier.replace(/^file:/, '')

    if (existsSync(localTarballPath)) {
      return localSpecifier
    }

    // Temporary local-test fallback:
    // return publishedBedframeSpecifiers[packageName as keyof typeof publishedBedframeSpecifiers]
    return publishedBedframeSpecifiers[
      packageName as keyof typeof publishedBedframeSpecifiers
    ]
  }

  return 'latest'
}
