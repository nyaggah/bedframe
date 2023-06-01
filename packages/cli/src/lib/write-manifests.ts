import fs from 'fs-extra'
import path from 'node:path'
import { Answers } from 'prompts'
import { Browser } from '@bedframe/core'

const sidePanel = `export const sidePanel = {
  side_panel: {
    default_path: 'src/pages/sidepanel.html',
  },
}`

export function sharedManifest(response: Answers<string>): string {
  return `
import {
  ManifestAction,
  ManifestBackground,
  ManifestCommands,
  ManifestContentScripts,
  ManifestPermissions,
  ManifestWebAccessibleResources,
  createManifestIcons,
  createManifestSharedFields,
} from '@bedframe/core'
import pkg from '../../package.json'

export const icons = createManifestIcons({
  16: 'icons/icon-16x16.png',
  32: 'icons/icon-32x32.png',
  48: 'icons/icon-48x48.png',
  128: 'icons/icon-128x128.png',
})

export const action: ManifestAction = {
  default_icon: icons,
}

export const background: ManifestBackground = {
  service_worker: 'src/scripts/background.ts',
  type: 'module',
}

${response.extension.type.name === 'sidepanel' ? sidePanel : ''}

export const contentScripts: ManifestContentScripts = [
  {
    js: ['src/scripts/content.tsx'],
    matches: ['<all_urls>'],
  },
]

export const webAccessibleResources: ManifestWebAccessibleResources = [
  {
    resources: [icons['128']],
    matches: ['<all_urls>'],
  },
]

export const commands: ManifestCommands = {
  _execute_action: {
    suggested_key: {
      default: 'Ctrl+Shift+1',
      mac: 'Ctrl+Shift+1',
      linux: 'Ctrl+Shift+1',
      windows: 'Ctrl+Shift+1',
      chromeos: 'Ctrl+Shift+1',
    },
  },
}

${
  response.extension.type.name === 'sidepanel'
    ? `// @ts-expect-error Type '"sidePanel"' is not assignable to type 'ManifestPermissions`
    : ''
}
export const permissions: ManifestPermissions = [ 'activeTab' ${
    response.extension.type.name === 'sidepanel' ? `, 'sidePanel'` : ''
  } ]


// SHARED FIELDS
export const shared = createManifestSharedFields({
  // Required
  name: pkg.name,
  version: pkg.version,
  manifest_version: 3,

  // Recommended
  // default_locale: 'en',
  description: pkg.description,
  icons,

  // Optional
  ${response.extension.author.email ? `author: pkg.author.email,` : ''}
  commands,
  permissions,
})

export default {
  icons,
  action,
  background,
  ${response.extension.type.name === 'sidepanel' ? `sidePanel,` : ''}
  contentScripts,
  webAccessibleResources,
  commands,
  shared,
}

`
}

// export function manifestForBrowser(browser: Browser): string {
export function manifestForBrowser(
  response: Answers<string>,
  browser: Browser
): string {
  return `
import { createManifest } from '@bedframe/core'
import config from './config'

export const ${browser.toLowerCase()} = createManifest(
  {
    ...config.shared,
    action: config.action,
    background: config.background,
    ${
      response.extension.type.name === 'sidepanel'
        ? 'side_panel: config.sidePanel,'
        : ''
    }
    content_scripts: config.contentScripts,
    web_accessible_resources: config.webAccessibleResources,
  },
  '${browser.toLowerCase()}'
)

`
}

export function manifestIndexFile(browsers: Browser[]): string | string[] {
  if (browsers.length > 1) {
    return browsers
      .map((browser) => {
        return (
          `export { ${browser.toLowerCase()} } from './${browser.toLowerCase()}'` +
          '\n'
        )
      })
      .toString()
      .replace(/,/g, '')
  }

  return `export { ${browsers[0].toLowerCase()} } from './${browsers[0].toLowerCase()}'`
}

export async function writeManifests(response: Answers<string>): Promise<void> {
  const { name, browser: browsers } = response
  const manifestDir = path.resolve(name.path, 'src', 'manifest')
  const sharedManifestPath = path.join(manifestDir, 'config.ts')
  const manifestIndexPath = path.join(manifestDir, 'index.ts')

  try {
    // await fs.ensureFile(manifestIndexPath)
    const promises = browsers.map(async (browser: Browser) => {
      const manifestPath = path.join(manifestDir, `${browser.toLowerCase()}.ts`)
      await Promise.all([
        fs.outputFile(manifestIndexPath, `${manifestIndexFile(browsers)}\n`),
        fs.outputFile(sharedManifestPath, `${sharedManifest(response)}\n`),
        fs.outputFile(
          manifestPath,
          `${manifestForBrowser(response, browser)}\n`
        ),
      ])
    })
    await Promise.all(promises)
  } catch (error) {
    console.error(error)
  }
}

export function _writeManifests(response: Answers<string>): void {
  const { name, browser: browsers } = response
  const manifestDir = path.resolve(path.join(name.path, 'src', 'manifest'))
  const sharedManifestPath = path.join(manifestDir, 'config.ts')
  // const manifestIndexPath = path.join(manifestDir, 'index.ts')

  // fs.ensureFile(manifestIndexPath)
  fs.ensureFile(manifestDir)
    .then(() => {
      for (const browser of browsers) {
        const manifestPath = path.join(
          manifestDir,
          `${browser.toLowerCase()}.ts`
        )
        // fs.writeFile(manifestIndexPath, manifestIndexFile(browsers) + '\n')
        fs.writeFile(sharedManifestPath, sharedManifest(response) + '\n')
        fs.writeFile(manifestPath, manifestForBrowser(response, browser) + '\n')
      }
    })
    .catch((error) => console.error(error))
}

/*

// background.ts / service worker
// ----------------------------
// https://github.com/GoogleChrome/chrome-extensions-samples/blob/main/functional-samples/cookbook.sidepanel-multiple/service-worker.js

const welcomePage = 'sidepanels/welcome-sp.html';
const mainPage = 'sidepanels/main-sp.html';

chrome.runtime.onInstalled.addListener(() => {
  chrome.sidePanel.setOptions({ path: welcomePage });
});

chrome.tabs.onActivated.addListener(async ({ tabId }) => {
  const { path } = await chrome.sidePanel.getOptions({ tabId });
  if (path === welcomePage) {
    chrome.sidePanel.setOptions({ path: mainPage });
  }
});
// ----------------------------

// manifest.json
// https://github.com/GoogleChrome/chrome-extensions-samples/blob/main/functional-samples/cookbook.sidepanel-multiple/manifest.json

{
  "manifest_version": 3,
  "name": "Multiple side panels",
  "version": "1.0",
  "description": "Displays welcome side panel on installation, then shows the main panel",
  "background": {
    "service_worker": "service-worker.js"
  },
  "icons": {
    "16": "images/icon-16.png",
    "48": "images/icon-48.png",
    "128": "images/icon-128.png"
  },
  "permissions": ["sidePanel"]
}
*/
