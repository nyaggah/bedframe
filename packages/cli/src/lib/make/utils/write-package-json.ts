import path from 'node:path'
import type prompts from 'prompts'
import { writeFile } from './utils.fs'

/**
 * Write the composed package.json (from `createPackageJsonFrom` method)
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
    "react": "^18.3.1",
    "react-dom": "^18.3.1"${
      isStyle.tailwind
        ? `,
    "clsx": "^2.1.0",
    "react-icons": "^5.0.1",
    "tailwind-merge": "^2.2.2",
    "tailwindcss-animate": "^1.0.7"`
        : ''
    }
  },
  "devDependencies": {
    "@bedframe/cli": "0.0.87",
    "@bedframe/core": "0.0.44",
${
  changesets
    ? `"@changesets/cli": "^2.27.1",
    "@commitlint/cli": "^19.2.1",
    "@commitlint/config-conventional": "^19.1.0",`
    : ''
}${
    hasTests
      ? `\n"@testing-library/jest-dom": "^6.4.2",
    "@testing-library/react": "^14.2.2",
    "@testing-library/user-event": "^14.5.2",
    "@types/jest": "^29.5.12",
    "happy-dom": "^14.3.6",
    "vitest": "^1.4.0",
    "@vitest/coverage-istanbul": "^1.4.0",`
      : ''
  }
    "@types/node": "^20.11.30",
    "@types/chrome": "^0.0.277",
    "@types/react": "^18.3.10",
    "@types/react-dom": "^18.3.0",
    "@vitejs/plugin-react": "^4.3.2",
    "concurrently": "^8.2.1",${
      commitLint
        ? `"commitizen": "^4.3.0",
    "cz-conventional-changelog": "^3.3.0",`
        : ''
    }${
      lintFormat
        ? `\n"@typescript-eslint/eslint-plugin": "^7.3.1",
    "@typescript-eslint/parser": "^8.8.1",
    "eslint": "^9.11.1",
    "eslint-config-prettier": "^9.1.0",
    "eslint-plugin-import": "^2.29.1",
    "eslint-plugin-n": "^16.6.2",
    "eslint-plugin-promise": "^6.1.1",
    "eslint-plugin-react": "^7.34.1",
    "eslint-plugin-react-hooks": "^5.1.0-rc.0",
    "eslint-plugin-react-refresh": "^0.4.12",
    "globals": "^15.9.0",
    "typescript-eslint": "^8.7.0",
    "lint-staged": "^15.2.2",
    "prettier": "^3.0.3",`
        : ''
    }
    ${gitHooks ? `"husky": "^9.0.11",` : ''}
    ${
      isStyle.tailwind
        ? `"autoprefixer": "^10.4.19",
    "postcss": "^8.4.38",
    "tailwindcss": "^3.4.1",`
        : ''
    }
    ${language.toLowerCase() === 'typescript' ? `"typescript": "^5.5.3",` : ''}
    "unplugin-fonts": "^1.1.1",
    "vite": "^5.4.8"
  }
  ${lintFormat ? ',' : ''}
  ${
    lintFormat
      ? `"lint-staged": {
    "*.{css,html,json,js}": [
      "prettier --write ."
    ],
    "*{js,jsx,ts,tsx}": "eslint . --fix"
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
