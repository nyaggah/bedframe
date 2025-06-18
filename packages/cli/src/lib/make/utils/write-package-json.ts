import path from 'node:path'
import type prompts from 'prompts'
import { writeFile } from './utils.fs'

/**
 * Write the composed package.json from prompt responses
 * to the project's root
 *
 * @export
 * @param {prompts.Answers<string>} response
 */
export function writePackageJson(response: prompts.Answers<string>): void {
  const { browser: browsers } = response
  const { manifest, author, license, isPrivate } = response.extension
  const projectName = manifest[0].manifest.name
  const projectAuthor = author
  const projectVersion = manifest[0].manifest.version
  const projectDescription = manifest[0].manifest.description

  const {
    // framework,
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

  const isStyle = {
    tailwind: style.toLowerCase() === 'tailwind',
  }

  const pm = packageManager.toLowerCase()
  const pmRun = pm !== 'yarn' ? `${pm} run` : pm

  const gitHooksPrepare =
    pm === 'yarn'
      ? `"postinstall": "husky || true"`
      : `"prepare": "husky || true"`

  const packageJson = `{
  "name": "${parameterizeString(projectName)}",
  "version": "${projectVersion}",
  "description": "${projectDescription}",
  ${
    projectAuthor
      ? `"author": {
    "name": "${projectAuthor.name}",
    "email": "${projectAuthor.email}",
    "url": "${projectAuthor.url}"
  },`
      : ''
  }
  "license": "${license}",
  "private": ${isPrivate},
  "type": "module",
  "scripts": {
    "dev": "bedframe dev",
    "build": "tsc && bedframe build",
    ${changesets ? `"version": "bedframe version",` : ''}
    ${
      git
        ? `"release": "gh release create $npm_package_name@$npm_package_version ./dist/*.zip --generate-notes",`
        : ''
    }
    "publish": "bedframe publish -b",
    ${
      lintFormat
        ? `"format": "prettier --write .",
    "lint": "eslint . --report-unused-disable-directives --max-warnings 0",
    "lint:format": "${pmRun} format && ${pmRun} lint",`
        : ''
    }
    ${hasTests ? `"test": "vitest run --coverage",` : ''}
    ${commitLint ? `"commit": "${lintFormat ? 'lint-staged && ' : ''}cz",` : ''}"zip": "bedframe zip",
    ${
      browsers.includes('safari')
        ? `"convert:safari": "xcrun safari-web-extension-converter dist/safari --project-location . --app-name $npm_package_name-safari"`
        : ''
    }${browsers.includes('safari') && gitHooks ? ',' : ''} 
    ${gitHooks ? gitHooksPrepare : ''}
  },
  "dependencies": {
    "react": "^19.1.0",
    "react-dom": "^19.1.0"${
      isStyle.tailwind
        ? `,
    "clsx": "^2.1.0",
    "react-icons": "^5.0.1",
    "tailwind-merge": "^3.3.1",
    "tailwindcss-animate": "^1.0.7"`
        : ''
    }
  },
  "devDependencies": {
    "@bedframe/cli": "^0.0.92",
    "@bedframe/core": "^0.0.46",
${
  changesets
    ? `"@changesets/cli": "^2.27.1",
    "@commitlint/cli": "^19.2.1",
    "@commitlint/config-conventional": "^19.1.0",`
    : ''
}${
  hasTests
    ? `\n"@testing-library/jest-dom": "^6.4.2",
    "@testing-library/react": "^16.3.0",
    "@testing-library/user-event": "^14.5.2",
    "@types/jest": "^30.0.0",
    "happy-dom": "^18.0.1",
    "vitest": "^3.2.4",
    "@vitest/coverage-istanbul": "^3.2.4",`
    : ''
}
    "@types/node": "^24.0.3",
    "@types/chrome": "^0.0.326",
    "@types/react": "^19.1.8",
    "@types/react-dom": "^19.1.6",
    "@vitejs/plugin-react": "^4.3.2",
    "concurrently": "^9.1.2",${
      commitLint
        ? `"commitizen": "^4.3.0",
    "cz-conventional-changelog": "^3.3.0",`
        : ''
    }${
      lintFormat
        ? `\n"@typescript-eslint/eslint-plugin": "^8.15.0",
    "@typescript-eslint/parser": "^8.15.0",
    "eslint": "^9.15.0",
    "eslint-config-prettier": "^10.1.5",
    "eslint-plugin-import": "^2.29.1",
    "eslint-plugin-n": "^17.20.0",
    "eslint-plugin-promise": "^7.2.1",
    "eslint-plugin-react": "^7.34.1",
    "eslint-plugin-react-hooks": "^5.1.0-rc.0",
    "eslint-plugin-react-refresh": "^0.4.14",
    "globals": "^16.2.0",
    "typescript-eslint": "^8.15.0",
    "lint-staged": "^16.1.2",
    "prettier": "^3.0.3",`
        : ''
    }
    ${gitHooks ? `"husky": "^9.0.11",` : ''}
    ${
      isStyle.tailwind
        ? `"@tailwindcss/vite": "^4.1.10",
    "@tailwindcss/postcss": "^4.1.10",
    "postcss": "^8.4.38",
    "tailwindcss": "^4.1.10",`
        : ''
    }
    ${language.toLowerCase() === 'typescript' ? `"typescript": "^5.5.3",` : ''}
    "unplugin-fonts": "^1.1.1",
    "vite": "^6.2.0"
  }
  ${lintFormat ? ',' : ''}
  ${
    lintFormat
      ? `"lint-staged": {
    "*.{css,html,json,js}": [
      "prettier --write ."
    ],
    "*.{js,jsx,ts,tsx}": "eslint . --fix"
  },
  "prettier": {
    "tabWidth": 2,
    "semi": false,
    "singleQuote": true
  }`
      : ''
  }${commitLint ? ',' : ''}${
    commitLint
      ? `"commitlint": {
    "extends": [
      "@commitlint/config-conventional"
    ]
  },
  "config": {
    "commitizen": {
      "path": "./node_modules/cz-conventional-changelog"
    }
  }`
      : ''
  }${gitHooks ? ',' : ''}${
    gitHooks
      ? `"husky": {
    "hooks": {
      "commit-msg": "commitlint --edit",
      "pre-commit": "${pmRun} lint-staged",
      "prepare-commit-msg": "exec < /dev/tty && node_modules/.bin/cz --hook || true"
    }
  }`
      : ''
  }
}
`

  const destinationRoot = path.resolve(response.extension.name.path)
  const destinationPackageJson = path.join(destinationRoot, 'package.json')
  writeFile(destinationPackageJson, `${packageJson}\n`).catch(console.error)
}

export const parameterizeString = (string: string, separator = '-') => {
  return string.toLowerCase().replace(/[^A-Z0-9]/gi, separator)
}
