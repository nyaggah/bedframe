import path from 'node:path'
import type { Answers } from 'prompts'
import { writeFile } from './utils.fs'

export function writeEslintConfig(response: Answers<string>): void {
  const { browser: browsers } = response
  const { manifest } = response.extension
  const projectName = manifest[0].manifest.name

  const { tests: hasTests } = response.development.template.config

  const eslintConfig = `import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'

export default tseslint.config(
  {
    ignores: [
      "dist",
      ${browsers.includes('safari') && `"${projectName}-safari",`}
      "node_modules"${
        hasTests
          ? `,
      "coverage"`
          : ''
      }
    ],
  },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
    },
  },
)
`

  const destinationRoot = path.resolve(response.extension.name.path)
  const destinationEslintConfig = path.join(destinationRoot, 'eslint.config.js')
  writeFile(destinationEslintConfig, `${eslintConfig}\n`).catch(console.error)
}
