import path, { join } from 'node:path'
import type { Browser } from '@bedframe/core'
import type { Answers } from 'prompts'
import { ensureDir, ensureWriteFile, outputFile } from './utils.fs'

export function writeBaseManifest(response: Answers<string>): string {
  const {
    override: overridePage,
    options: optionsPage,
    type,
  } = response.extension
  const { name: extensionType } = type

  return `import { type Manifest } from '@bedframe/core'
import pkg from '../../package.json'

export const baseManifest = {
  // Required
  // - - - - - - - - -
  name: pkg.name,
  version: pkg.version,
  manifest_version: 3,

  // Recommended
  // - - - - - - - - -
  description: pkg.description,
  icons: {
    16: 'assets/icons/icon-16x16.png',
    32: 'assets/icons/icon-32x32.png',
    48: 'assets/icons/icon-48x48.png',
    128: 'assets/icons/icon-128x128.png',
  },
  action: {
    default_icon: {
      16: 'assets/icons/icon-16x16.png',
      32: 'assets/icons/icon-32x32.png',
      48: 'assets/icons/icon-48x48.png',
      128: 'assets/icons/icon-128x128.png',
    },
    default_title: pkg.name,
    ${extensionType === 'popup' ? `default_popup: 'pages/main.html',` : ''}
  },

  // Optional
  // - - - - - - - - -
  ${
    response.extension.author.email
      ? `
  author: {
    email: pkg.author.email
  },
  `
      : ''
  }
  background: {
    service_worker: 'scripts/service-worker.ts',
    type: 'module',
  },${
    extensionType === 'sidepanel'
      ? `side_panel: {
    default_path: 'pages/sidepanel-main.html',
  },`
      : ''
  }${
    optionsPage === 'full-page'
      ? `options_page: 'pages/options.html',`
      : optionsPage === 'embedded'
        ? `options_ui: {
    page: 'pages/options.html',
    open_in_tab: false,
  },`
        : ''
  }${
    extensionType === 'devtools' ? `devtools_page: 'pages/devtools.html',` : ''
  }${
    overridePage !== 'none'
      ? `chrome_url_overrides: {
    ${`${overridePage}: 'pages/${overridePage}.html',`}
  },`
      : ''
  }${
    response.extension.type.name === 'overlay'
      ? `content_scripts: [
    {
      js: ['scripts/content.tsx'],
      matches: ['<all_urls>'],
    },
  ],`
      : ''
  }
  web_accessible_resources: [
    {
      resources: ['assets/*', 'pages/*'],
      matches: ['<all_urls>'],
    },
  ],
  commands: {
    _execute_action: {
      suggested_key: {
        default: 'Ctrl+Shift+1',
        mac: 'Ctrl+Shift+1',
        linux: 'Ctrl+Shift+1',
        windows: 'Ctrl+Shift+1',
        chromeos: 'Ctrl+Shift+1',
      },
    },
  },
  permissions: [ 
    'activeTab'${
      response.extension.type.name === 'sidepanel'
        ? `, 
    'sidePanel'`
        : ''
    } 
  ],
} satisfies Manifest

`
}

export function manifestForBrowser(
  response: Answers<string>,
  browser: Browser,
): string {
  const {
    // name: { name: projectName },
    options: optionsPage,
    type,
  } = response.extension
  const { name: extensionType } = type

  const optionsUIorPage =
    optionsPage === 'embedded' ? 'options_ui' : 'options_page'

  const isFirefox = browser.toLowerCase() === 'firefox'
  const isSafari = browser.toLowerCase() === 'safari'

  const firefoxManifest = `import { createManifest } from '@bedframe/core'
import { baseManifest } from './base.manifest'

const { ${optionsPage !== 'none' ? `${optionsUIorPage},` : ''}${
    extensionType === 'sidepanel' ? 'side_panel, ' : ''
  } ...rest } = baseManifest

const updatedFirefoxManifest = {
  ...rest,
  background: {
    scripts: [baseManifest.background.service_worker],
  },${
    extensionType === 'sidepanel'
      ? `sidebar_action: {
    default_icon: baseManifest.action.default_icon,
    default_title: baseManifest.name,
    default_panel: side_panel.default_path,
  },`
      : ''
  }
  browser_specific_settings: {
    gecko: {
      id: baseManifest.author.email,
      // ^^^ https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/manifest.json/browser_specific_settings#id
    },
  },${
    optionsPage === 'full-page' || optionsPage === 'embedded'
      ? `options_ui: {
        page: ${
          optionsPage === 'full-page' ? 'options_page' : 'options_ui.page'
        },
      },`
      : ''
  }
}

export const firefox = createManifest(updatedFirefoxManifest, 'firefox')

`

  const safariManifest = `import { createManifest } from '@bedframe/core'
import { baseManifest } from './base.manifest'

const updatedSafariManifest = {
  ...baseManifest,
  browser_specific_settings: {
    safari: {
      strict_min_version: '15.4',
      strict_max_version: '*',
    },
    // ^^^ https://developer.apple.com/documentation/safariservices/safari_web_extensions/optimizing_your_web_extension_for_safari#3743239
    //     https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/manifest.json/browser_specific_settings#safari_properties
  },
}

export const safari = createManifest(updatedSafariManifest, 'safari')

`

  const browserManifest = `import { createManifest } from '@bedframe/core'
import { baseManifest } from './base.manifest'

export const ${browser.toLowerCase()} = createManifest(baseManifest,'${browser.toLowerCase()}')

`

  if (isFirefox) {
    return firefoxManifest
  }
  if (isSafari) {
    return safariManifest
  }

  return browserManifest
}

export async function writeManifests(response: Answers<string>): Promise<void> {
  const { browser: browsers, extension } = response
  const manifestDir = path.resolve(extension.name.path, 'src', 'manifests')
  const manifestBasePath = path.join(manifestDir, 'base.manifest.ts')

  try {
    const promises = browsers.map(async (browser: Browser) => {
      const manifestPath = path.join(manifestDir, `${browser.toLowerCase()}.ts`)
      ensureDir(join(manifestDir))
        .then(() => {
          ensureWriteFile(manifestBasePath)
            .then(() =>
              outputFile(manifestBasePath, `${writeBaseManifest(response)}\n`),
            )
            .catch(console.error)

          ensureWriteFile(manifestPath)
            .then(() =>
              outputFile(
                manifestPath,
                `${manifestForBrowser(response, browser)}\n`,
              ),
            )
            .catch(console.error)
        })
        .catch(console.error)
    })
    await Promise.all(promises)
  } catch (error) {
    console.error(error)
  }
}
