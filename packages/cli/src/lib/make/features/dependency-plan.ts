import type prompts from 'prompts'
import { isReactTsScaffold, resolveScaffoldSpec } from './scaffold-spec'

export type DependencyGroup = {
  name: string
  dependencies?: string[]
  devDependencies?: string[]
}

export type DependencyPlan = {
  groups: DependencyGroup[]
  dependencies: string[]
  devDependencies: string[]
}

function dedupe(list: string[]): string[] {
  return [...new Set(list)]
}

function flattenGroups(groups: DependencyGroup[]): DependencyPlan {
  const dependencies = dedupe(
    groups.flatMap((group) => group.dependencies ?? []),
  )
  const devDependencies = dedupe(
    groups.flatMap((group) => group.devDependencies ?? []),
  )

  return {
    groups,
    dependencies,
    devDependencies,
  }
}

export function resolveDependencyGroups(
  response: prompts.Answers<string>,
): DependencyGroup[] {
  const spec = resolveScaffoldSpec(response)

  const { language } = response.development.template.config

  const groups: DependencyGroup[] = [
    {
      name: 'bedframe',
      devDependencies: ['@bedframe/cli', '@bedframe/core'],
    },
    {
      name: 'vite-tooling',
      devDependencies: ['@types/chrome', '@types/node', 'concurrently', 'vite'],
    },
  ]

  if (spec.framework === 'react') {
    groups.push({
      name: 'react-runtime',
      dependencies: ['react', 'react-dom'],
    })
    groups.push({
      name: 'react-tooling',
      devDependencies: ['@types/react', '@types/react-dom', '@vitejs/plugin-react'],
    })
  }

  if (spec.featureFlags.changesets) {
    groups.push({
      name: 'changesets',
      devDependencies: ['@changesets/cli'],
    })
  }

  if (spec.featureFlags.tests) {
    if (isReactTsScaffold(spec)) {
      groups.push({
        name: 'testing-react',
        devDependencies: [
          '@testing-library/jest-dom',
          '@testing-library/react',
          '@testing-library/user-event',
          '@types/jest',
          '@vitest/coverage-istanbul',
          'happy-dom',
          'vitest',
        ],
      })
    } else {
      groups.push({
        name: 'testing-generic',
        devDependencies: ['@vitest/coverage-istanbul', 'happy-dom', 'vitest'],
      })
    }
  }

  if (spec.featureFlags.commitLint) {
    groups.push({
      name: 'commit-lint',
      devDependencies: [
        '@commitlint/cli',
        '@commitlint/config-conventional',
        'commitizen',
        'cz-conventional-changelog',
      ],
    })
  }

  if (spec.featureFlags.lintFormat) {
    groups.push({
      name: 'lint-format',
      devDependencies: ['globals', 'lint-staged', 'oxfmt', 'oxlint'],
    })
  }

  if (spec.featureFlags.gitHooks) {
    groups.push({
      name: 'git-hooks',
      devDependencies: ['lefthook'],
    })
  }

  if (spec.style.isTailwind) {
    groups.push({
      name: 'tailwind-runtime',
      dependencies:
        spec.framework === 'react'
          ? ['clsx', 'react-icons', 'tailwind-merge', 'tailwindcss-animate']
          : [],
    })
    groups.push({
      name: 'tailwind-tooling',
      devDependencies: ['@tailwindcss/postcss', '@tailwindcss/vite', 'postcss', 'tailwindcss'],
    })
  }

  if (String(language).toLowerCase() === 'typescript') {
    groups.push({
      name: 'typescript',
      devDependencies: ['typescript'],
    })
  }

  return groups
}

export function resolveDependencyPlan(
  response: prompts.Answers<string>,
): DependencyPlan {
  return flattenGroups(resolveDependencyGroups(response))
}
