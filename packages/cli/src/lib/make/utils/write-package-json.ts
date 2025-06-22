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
    "lint": "oxlint --fix .",
    "fix": "${pmRun} format && ${pmRun} lint",`
        : ''
    }
    ${hasTests ? `"test": "vitest run --coverage",` : ''}
    ${commitLint ? `"commit": "${lintFormat ? 'lint-staged && ' : ''}cz",` : ''}"zip": "bedframe zip",
    ${
      browsers.includes('safari')
        ? `"convert:safari": "xcrun safari-web-extension-converter dist/safari --project-location . --app-name $npm_package_name-safari"`
        : ''
    }
  },
  "dependencies": {
    "react": "^19.1.0",
    "react-dom": "^19.1.0"${
      isStyle.tailwind
        ? `,
    "clsx": "^2.1.1",
    "react-icons": "^5.5.0",
    "tailwind-merge": "^3.3.1",
    "tailwindcss-animate": "^1.0.7"`
        : ''
    }
  },
  "devDependencies": {
    "@bedframe/cli": "^0.0.93",
    "@bedframe/core": "^0.0.46",
${
  changesets
    ? `"@changesets/cli": "^2.29.5",
    "@commitlint/cli": "^19.8.1",
    "@commitlint/config-conventional": "^19.8.1",`
    : ''
}${
    hasTests
      ? `\n"@testing-library/jest-dom": "^6.6.3",
    "@testing-library/react": "^16.3.0",
    "@testing-library/user-event": "^14.6.1",
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
    "@vitejs/plugin-react": "^4.5.2",
    "concurrently": "^9.2.0",${
      commitLint
        ? `"commitizen": "^4.3.1",
    "cz-conventional-changelog": "^3.3.0",`
        : ''
    }${
      lintFormat
        ? `\n"oxlint": "^1.2.0",
    "globals": "^16.2.0",
    "lint-staged": "^16.1.2",
    "prettier": "^3.5.3",
    "prettier-plugin-tailwindcss": "^0.6.13",`
        : ''
    }
    ${gitHooks ? `"lefthook": "^1.11.14",` : ''}
    ${
      isStyle.tailwind
        ? `"@tailwindcss/vite": "^4.1.10",
    "@tailwindcss/postcss": "^4.1.10",
    "postcss": "^8.5.6",
    "tailwindcss": "^4.1.10",`
        : ''
    }
    ${language.toLowerCase() === 'typescript' ? `"typescript": "^5.8.3",` : ''}
    "unplugin-fonts": "^1.3.1",
    "vite": "^6.3.5"
  }
  ${lintFormat ? ',' : ''}
  ${
    lintFormat
      ? `"lint-staged": {
    "*.{js,jsx,ts,tsx}": [
      "oxlint --fix"
    ],
    "*.{css,html,json}": "prettier --write"
  },
  "prettier": {
    "tabWidth": 2,
    "semi": false,
    "singleQuote": true,
    "tailwindFunctions": [
      "clsx"
    ],
    "plugins": [
      "prettier-plugin-tailwindcss"
    ]
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
