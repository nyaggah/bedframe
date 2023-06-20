import fs from 'fs-extra'
import path from 'node:path'
import { Answers } from 'prompts'
import { Browser } from '@bedframe/core'

export function sharedManifest(response: Answers<string>): string {
  const {
    override: overridePage,
    options: optionsPage,
    type,
  } = response.extension
  const { name: extensionType } = type

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
  16: 'assets/icons/icon-16x16.png',
  32: 'assets/icons/icon-32x32.png',
  48: 'assets/icons/icon-48x48.png',
  128: 'assets/icons/icon-128x128.png',
})

export const action: ManifestAction = {
  default_icon: icons,
  default_title: pkg.name,
  ${
    extensionType === 'popup'
      ? `default_popup: 'src/pages/popup/index.html',`
      : ''
  }
}

export const background: ManifestBackground = {
  service_worker: 'src/scripts/background.ts',
  type: 'module',
}

export const devtoolsPage = 'src/pages/devtools/index.html'
${
  optionsPage === 'full-page'
    ? `export const optionsPage = 'src/pages/options/index.html'`
    : `export const optionsUI = {
  page: 'src/pages/options/index.html',
  open_in_tab: false,
}`
}

${
  extensionType === 'sidepanel'
    ? `export const sidePanel = {
  default_path: 'src/sidepanels/welcome/index.html',
}`
    : ''
}

${
  overridePage !== 'none'
    ? `export const chromeUrlOverrides = {
  ${`${overridePage}: 'src/pages/${overridePage}/index.html',`}
}`
    : ''
}

export const contentScripts: ManifestContentScripts = [
  {
    js: ['src/scripts/content.tsx'],
    matches: ['<all_urls>'],
  },
]

export const webAccessibleResources: ManifestWebAccessibleResources = [
  {
    resources: [
      'assets/icons/*.png',
      'assets/fonts/inter/Inter-Bold.ttf',
      'assets/fonts/inter/Inter-ExtraBold.ttf',
      'assets/fonts/inter/Inter-Regular.ttf',
      'assets/fonts/inter/Inter-SemiBold.ttf',
    ],
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

export const permissions: ManifestPermissions = [ 
  'activeTab' ${
    response.extension.type.name === 'sidepanel'
      ? `, 
    // @ts-expect-error Type '"sidePanel"' is not assignable to type 'ManifestPermissions2
    'sidePanel'`
      : ''
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
  ${optionsPage === 'full-page' ? `optionsPage,` : `optionsUI,`}
  devtoolsPage,
  background,
  ${response.extension.type.name === 'sidepanel' ? `sidePanel,` : ''}
  ${overridePage !== 'none' ? `chromeUrlOverrides,` : ``}  
  contentScripts,
  webAccessibleResources,
  commands,
  shared,
}

`
}

export function manifestForBrowser(
  response: Answers<string>,
  browser: Browser
): string {
  const {
    override: overridePage,
    type,
    options: optionsPage, // 'full-page' | 'embedded'
  } = response.extension
  const { name: extensionType } = type

  const optionsUI = `options_ui: {
    page: 'pages/options/index.html',
    open_in_tab: false,
  }`

  return `
import { createManifest } from '@bedframe/core'
import config from './config'

export const ${browser.toLowerCase()} = createManifest(
  {
    ...config.shared,
    action: config.action,
    background: config.background,
    ${
      optionsPage === 'full-page'
        ? `options_page: config.optionsPage,`
        : `options_ui: config.optionsUI,`
    }
    ${extensionType === 'devtools' ? `devtools_page: config.devtoolsPage,` : ``}
    ${extensionType === 'sidepanel' ? 'side_panel: config.sidePanel,' : ``}
    ${
      overridePage !== 'none'
        ? `chrome_url_overrides: config.chromeUrlOverrides,`
        : ``
    }
    web_accessible_resources: config.webAccessibleResources,
  },
  '${browser.toLowerCase()}'
)

`
}

export function manifestIndexFile(browsers: Browser[]): string | string[] {
  if (browsers.length > 1) {
    const manifestImports = browsers
      .map(
        (browser) =>
          `import { ${browser.toLowerCase()} } from './${browser.toLowerCase()}'`
      )
      .toString()
      .replace(/,/g, '\n')

    const manifestExports = `
export const manifests = [
  ${browsers}
]`
    return `${manifestImports}\n${manifestExports}`
  }

  return `
  import { ${browsers[0].toLowerCase()} } from './${browsers[0].toLowerCase()}'
  export const manifests = [ ${browsers[0].toLowerCase()} ]
  `
}

export async function writeManifests(response: Answers<string>): Promise<void> {
  const { browser: browsers, extension } = response
  const manifestDir = path.resolve(extension.name.path, 'src', 'manifests')
  const sharedManifestPath = path.join(manifestDir, 'config.ts')
  const manifestIndexPath = path.join(manifestDir, 'index.ts')

  try {
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
