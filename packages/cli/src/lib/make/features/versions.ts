import { readFileSync } from 'node:fs'
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

const dynamicVersionPackages = new Set(['@bedframe/cli', '@bedframe/core'])

const publishedBedframeSpecifiers = {
  '@bedframe/cli': `^${resolveCurrentCliVersion()}`,
  '@bedframe/core': `^${resolveCurrentCoreVersion()}`,
} as const

export function packageSpecifier(packageName: string): string {
  if (dynamicVersionPackages.has(packageName)) {
    // Local tarball resolution is intentionally disabled for scaffold portability.
    // Always resolve Bedframe packages by published semver range.
    return publishedBedframeSpecifiers[
      packageName as keyof typeof publishedBedframeSpecifiers
    ]
  }

  return 'latest'
}
