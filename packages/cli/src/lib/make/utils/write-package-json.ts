import path from 'node:path'
import prompts from 'prompts'
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
    tailwind: style === 'Tailwind',
  }

  const pm = packageManager.toLowerCase()
  const pmRun = pm === 'npm' ? `${pm} run` : pm

  const packageJson = `{
  "name": "${projectName}",
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
    ${commitLint ? `"commit": "lint-staged && cz",` : ''}
    "zip": "bedframe zip",
    "codemod": "bedframe codemod",
    ${
      browsers.includes('safari')
        ? `"convert:safari": "xcrun safari-web-extension-converter dist/safari --project-location . --no-open --app-name $npm_package_name@$npm_package_version-safari-web-extension"`
        : ''
    }${browsers.includes('safari') && gitHooks ? ',' : ''} 
    ${gitHooks ? `"postinstall": "husky install"` : ''}
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-chrome-extension-router": "^1.4.0",
    "react-dom": "^18.2.0",
    "react-frame-component": "^5.2.6",
    ${
      isStyle.tailwind
        ? `"@radix-ui/react-dropdown-menu": "^2.0.5",
    "@radix-ui/react-icons": "^1.3.0",
    "@radix-ui/react-menubar": "^1.0.3",
    "@radix-ui/react-navigation-menu": "^1.1.3",
    "@radix-ui/react-slot": "^1.0.2",
    "@radix-ui/react-tabs": "^1.0.4",
    "class-variance-authority": "^0.7.0",
    "clsx": "^2.0.0",
    "lucide-react": "^0.271.0",
    "react-icons": "^4.10.1",
    "tailwind-merge": "^1.14.0",
    "tailwindcss-animate": "^1.0.7"`
        : ''
    }
  },
  "devDependencies": {
    "@bedframe/cli": "^0.0.74",
    "@bedframe/core": "^0.0.39",
    ${
      changesets
        ? `"@changesets/cli": "^2.26.2",
    "@commitlint/cli": "^17.7.1",
    "@commitlint/config-conventional": "^17.7.0",`
        : ''
    }
    ${
      hasTests
        ? `"@testing-library/jest-dom": "^6.1.2",
    "@testing-library/react": "^14.0.0",
    "@testing-library/user-event": "^14.4.3",
    "@types/jest": "^29.5.4",
    "happy-dom": "^12.9.1",
    "vitest": "^0.34.3",
    "@vitest/coverage-istanbul": "^0.34.3",`
        : ''
    }
    "@types/node": "^20.8.7",
    "@types/chrome": "^0.0.248",
    "@types/react": "^18.2.21",
    "@types/react-dom": "^18.2.7",
    "@types/react-frame-component": "^4.1.3",
    "@vitejs/plugin-react": "^4.0.4",
    "concurrently": "^8.2.1",
    ${
      commitLint
        ? `"commitizen": "^4.3.0",
    "cz-conventional-changelog": "^3.3.0",`
        : ''
    }
    ${
      lintFormat
        ? `"@typescript-eslint/eslint-plugin": "^6.5.0",
    "eslint": "^8.48.0",
    "eslint-config-prettier": "^9.0.0",
    "eslint-plugin-import": "^2.28.1",
    "eslint-plugin-n": "^16.0.2",
    "eslint-plugin-promise": "^6.1.1",
    "eslint-plugin-react": "^7.33.2",
    "eslint-plugin-react-hooks": "^4.6.0",
    "eslint-plugin-react-refresh": "^0.4.3",
    "lint-staged": "^14.0.1",
    "prettier": "^3.0.3",`
        : ''
    }
    ${gitHooks ? `"husky": "^8.0.3",` : ''}
    ${
      isStyle.tailwind
        ? `"autoprefixer": "^10.4.15",
    "postcss": "^8.4.31",
    "tailwindcss": "^3.3.3",`
        : ''
    }  
    ${language.toLowerCase() === 'typescript' ? `"typescript": "^5.2.2",` : ''}
    "unplugin-fonts": "^1.0.3",
    "vite": "^4.5.0"
  },
  ${
    lintFormat
      ? `"eslintConfig": {
    "globals": {
      "JSX": true
    },
    "env": {
      "browser": true,
      "es2020": true,
      "webextensions": true
    },
    "extends": [
      "eslint:recommended",
      "plugin:@typescript-eslint/recommended",
      "plugin:react-hooks/recommended",
      "prettier"
    ],
    "settings": {
      "react": {
        "version": "detect"
      }
    },
    "parser": "@typescript-eslint/parser",
    "parserOptions": {
      "ecmaVersion": "latest",
      "sourceType": "module",
      "project": [
        "tsconfig.json",
        "tsconfig.node.json"
      ]
    },
    "plugins": [
      "react-refresh"
    ],
    "rules": {
      "react-refresh/only-export-components": "warn",
      "react/react-in-jsx-scope": "off",
      "space-before-function-paren": "off"
    },
    "ignorePatterns": [
      "dist",
      "node_modules"${
        hasTests
          ? `,
      "coverage"`
          : ''
      }
    ]
  },
  "lint-staged": {
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
  }${lintFormat && commitLint ? ',' : ''}
  ${
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
  }${commitLint && gitHooks ? ',' : ''}
  ${
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
  writeFile(destinationPackageJson, packageJson + '\n').catch(console.error)
}
