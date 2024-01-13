import { join, resolve } from 'node:path'
import { Answers } from 'prompts'
import { ensureDir, ensureFile, outputFile } from './utils.fs'

type EnvironmentVariables = {
  chrome: ChromeEnvironment
  firefox: FirefoxEnvironment
  edge: EdgeEnvironment
}

type ChromeEnvironment = {
  extensionId: string
  clientId: string
  clientSecret: string
  refreshToken: string
  key: string
  secret: string
}

type FirefoxEnvironment = {
  key: string
  secret: string
}

type EdgeEnvironment = {
  productId: string
  clientId: string
  clientSecret: string
}

export function writeMVPworkflow(response: Answers<string>) {
  const { name: projectName, path: projectPath } = response.extension.name
  const { development, browser: browsers } = response
  const {
    packageManager,
    tests: hasTests,
    lintFormat,
    // gitHooks,
    // changesets,
  } = development.template.config

  const pm = packageManager.toLowerCase()
  const pmRun = pm === 'npm' || pm === 'pnpm' ? `${pm} run` : pm

  const workflowPath = resolve(
    join(projectPath, '.github', 'workflows', 'mvp.yml'),
  )

  const publishVar: EnvironmentVariables = {
    chrome: {
      extensionId: 'EXTENSION_ID',
      clientId: 'CLIENT_ID',
      clientSecret: 'CLIENT_SECRET',
      refreshToken: 'REFRESH_TOKEN',
      key: 'WEB_EXT_API_KEY',
      secret: 'WEB_EXT_API_SECRET',
    },
    firefox: {
      key: 'WEB_EXT_API_KEY',
      secret: 'WEB_EXT_API_SECRET',
    },
    edge: {
      productId: 'EDGE_PRODUCT_ID',
      clientId: 'EDGE_CLIENT_ID',
      clientSecret: 'EDGE_CLIENT_SECRET',
    },
  }

  const file = {
    path: workflowPath,
    content: `name: M V P - make, version & publish ${projectName}

on:
  push:
    branches:
      - main
  workflow_dispatch: # This line adds manual triggering from the GitHub UI

concurrency: \$\{{ github.workflow }\}-\$\{{ github.ref }\}

jobs:
  make_version_publish:
    name: Make, Version & Publish
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      ${
        pm === 'pnpm'
          ? `- run: npm install pnpm -g
      - run: pnpm install`
          : `- run: npm ci`
      }
      
      - name: '[ M A K E ] : Build ${projectName} - all browsers'
        id: buildProject
        # this expects you to have a package.json script called: "build"
        run: ${pmRun} build
${
  lintFormat
    ? ` 
      - name: 'Format & Lint - Run Prettier + ESLint'
        id: lintFormat
        # this expects you to have a package.json script called "lint:format"
        run: ${pmRun} lint:format`
    : ''
}  
${
  hasTests
    ? ` 
      - name: 'Unit Test - run unit test suite'
        id: unitTest
        # this expects you to have a package.json script called "test"
        run: ${pmRun} test`
    : ''
}
      - name: 'Codemod - Perform some spaghetti 🤌 🤌 🤌'
        # todo: polyfill namespaces and browser-specific apis 
        # e.g. 'browser.runtime' and 'chrome.runtime', etc
        #
        # for now, perform some after-build code mods. not ideal, but...
        # https://youtu.be/RlwlV4hcBac?t=21
        # - - -
        # bedframe builds for MV3 and while Firefox, et al support MV3 there
        # is some divergence... this performs after-build codemods on manifest
        # and feature code which ideally should happen during vite/crx dev and build processes...
        # but... until then... spaghetti-ville!
        id: codeMod
        # this expects you to have a package.json script called "codemod"
        run: ${pmRun} codemod firefox

      - name: '[ V E R S I O N ] : Create or Update Release Pull Request - Version Changes'
        id: changesets
        uses: changesets/action@v1
        with:
          # this expects you to have a package.json script called "version" that will internally trigger \`changeset version\`.
          version: ${pmRun} version
        env:
          GITHUB_TOKEN: \$\{{ secrets.GITHUB_TOKEN }\}

      - name: 'Get current version info from package.json'
        if: steps.changesets.outputs.hasChangesets == 'false'
        id: package
        run: |
          echo "::set-output name=PACKAGE_NAME::$(jq -r .name package.json)"
          echo "::set-output name=PACKAGE_VERSION::$(jq -r .version package.json)"
        working-directory: \$\{{ github.workspace }\}

      - name: 'Check if a git release already exists for current version'
        if: steps.changesets.outputs.hasChangesets == 'false'
        id: checkRelease
        run: |
          TAG_NAME=\$\{{ steps.package.outputs.PACKAGE_NAME }\}@\$\{{ steps.package.outputs.PACKAGE_VERSION }\}
          if gh release view $TAG_NAME &>/dev/null; then
            echo "Release $TAG_NAME already exists."
            echo "RELEASE_EXISTS=true" >> $GITHUB_ENV
          else
            echo "RELEASE_EXISTS=false" >> $GITHUB_ENV
          fi

      - name: 'Create Release Archive(s) - zip 🫰 it 🫰 up 🫰 !'
        id: zip
        if: steps.changesets.outputs.hasChangesets == 'false'
        # this expects you to have a package.json script called "zip"
        run: ${pmRun} zip

      - name: 'Create a git release w/ notes & release archive(s)'
        id: gitRelease
        if: steps.changesets.outputs.hasChangesets == 'false' && env.RELEASE_EXISTS != 'true'
        run: ${pmRun} release
        env:
          GITHUB_TOKEN: \$\{{ secrets.GITHUB_TOKEN }\}
          PACKAGE_NAME: \$\{{ steps.package.outputs.PACKAGE_NAME }\}
          PACKAGE_VERSION: \$\{{ steps.package.outputs.PACKAGE_VERSION }\}

      - name: '[ P U B L I S H ] : Chrome - upload to Chrome Web Store'
        id: publishChrome
        if: steps.changesets.outputs.hasChangesets == 'false'
        # this expects you to have a package.json script called "publish"
        run: ${pmRun} publish chrome
        env:
          ${publishVar.chrome.extensionId}: \$\{{ secrets.${
            publishVar.chrome.extensionId
          } }\}
          ${publishVar.chrome.clientId}: \$\{{ secrets.${
            publishVar.chrome.clientId
          } }\}
          ${publishVar.chrome.clientSecret}: \$\{{ secrets.${
            publishVar.chrome.clientSecret
          } }\}
          ${publishVar.chrome.refreshToken}: \$\{{ secrets.${
            publishVar.chrome.refreshToken
          } }\}
          PACKAGE_NAME: \$\{{ steps.package.outputs.PACKAGE_NAME }\}
          PACKAGE_VERSION: \$\{{ steps.package.outputs.PACKAGE_VERSION }\}

      - name: 'Firefox - upload to AMO'
        id: publishFirefox
        if: steps.changesets.outputs.hasChangesets == 'false'
        # this expects you to have a package.json script called "publish"
        run: ${pmRun} publish firefox
        env:
          ${publishVar.firefox.key}: \$\{{ secrets.${publishVar.firefox.key} }\}
          ${publishVar.firefox.secret}: \$\{{ secrets.${
            publishVar.firefox.secret
          } }\}
          PACKAGE_NAME: \$\{{ steps.package.outputs.PACKAGE_NAME }\}
          PACKAGE_VERSION: \$\{{ steps.package.outputs.PACKAGE_VERSION }\}

      - name: 'MS Edge - upload to MS Edge Add-ons'
        id: publishEdge
        if: steps.changesets.outputs.hasChangesets == 'false'
        # this expects you to have a package.json script called "publish"
        run: ${pmRun} publish edge
        env:
          ${publishVar.edge.productId}: \$\{{ secrets.${
            publishVar.edge.productId
          } }\}
          ${publishVar.edge.clientId}: \$\{{ secrets.${
            publishVar.edge.clientId
          } }\}
          ${publishVar.edge.clientSecret}: \$\{{ secrets.${
            publishVar.edge.clientSecret
          } }\}
          PACKAGE_NAME: \$\{{ steps.package.outputs.PACKAGE_NAME }\}
          PACKAGE_VERSION: \$\{{ steps.package.outputs.PACKAGE_VERSION }\}
  `,
  }

  ensureDir(join(projectPath, '.github', 'workflows'))
    .then(() => {
      ensureFile(file.path).then(() => outputFile(file.path, file.content))
    })
    .catch((error) => console.error(error))
}
