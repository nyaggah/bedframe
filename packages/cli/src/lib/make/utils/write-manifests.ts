import type { Browser } from '@bedframe/core'
import path, { join } from 'node:path'
import type { Answers } from 'prompts'
import { ensureDir, ensureFile, outputFile } from './utils.fs'

export function writeBaseManifest(response: Answers<string>): string {
  const {
    override: overridePage,
    options: optionsPage,
    type,
  } = response.extension
  const { name: extensionType } = type

  return `import { type Manifest, createManifestBase } from '@bedframe/core'
import pkg from '../../package.json'

export const baseManifest: Manifest = createManifestBase({
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
  ${response.extension.author.email ? 'author: pkg.author.email,' : ''}
  background: {
    service_worker: 'scripts/service-worker.ts',
    type: 'module',
  },
  ${
    extensionType === 'sidepanel'
      ? `side_panel: {
    default_path: 'pages/sidepanel-main.html',
  },`
      : ''
  }
  ${
    optionsPage === 'full-page'
      ? `options_page: 'pages/options.html',`
      : optionsPage === 'embedded'
        ? `options_ui: {
    page: 'pages/options.html',
    open_in_tab: false,
  },`
        : ''
  }
  ${
    extensionType === 'devtools' ? `devtools_page: 'pages/devtools.html',` : ''
  }  
  ${
    overridePage !== 'none'
      ? `chrome_url_overrides: {
    ${`${overridePage}: 'pages/${overridePage}.html',`}
  },`
      : ''
  }    
  ${
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
})

`
}

export function manifestForBrowser(
  response: Answers<string>,
  browser: Browser,
): string {
  const {
    name: { name: projectName },
    options: optionsPage,
    type,
  } = response.extension
  const { name: extensionType } = type

  const optionsUIorPage =
    optionsPage === 'embedded' ? 'options_ui' : 'options_page'
  const firefoxManifest = `import { type Manifest, createManifest } from '@bedframe/core'
import { baseManifest } from './base.manifest'

const { ${optionsUIorPage}${
    extensionType === 'sidepanel' ? ', side_panel' : ''
  }, ...rest } = baseManifest
  
${
  extensionType === 'sidepanel'
    ? `const sidePanel = {
  default_icon: baseManifest.action.default_icon,
  default_title: baseManifest.name,
  default_panel: side_panel.default_path,
}`
    : ''
}
${
  optionsPage === 'full-page' || optionsPage === 'embedded'
    ? `const optionsUI = {
  page: ${optionsPage === 'full-page' ? 'options_page' : 'options_ui.page'},
}`
    : ''
}

const updatedFirefoxManifest = {
    ...rest,
    ${extensionType === 'sidepanel' ? 'sidebar_action: sidePanel,' : ''}
    browser_specific_settings: {
      gecko: {
        id: 'me@${projectName.trim().replace(/\s+/g, '-').toLowerCase()}.com',
      },
    },
    ${
      optionsPage === 'full-page' || optionsPage === 'embedded'
        ? 'options_ui: optionsUI,'
        : ''
    }
  } as Manifest

export const firefox = createManifest(updatedFirefoxManifest, 'firefox')

`
  const isFirefox = browser.toLowerCase() === 'firefox'
  return isFirefox
    ? firefoxManifest
    : `import { createManifest } from '@bedframe/core'
import { baseManifest } from './base.manifest'

export const ${browser.toLowerCase()} = createManifest(baseManifest,'${browser.toLowerCase()}')

`
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
          ensureFile(manifestBasePath)
            .then(() =>
              outputFile(manifestBasePath, `${writeBaseManifest(response)}\n`),
            )
            .catch((error) => console.error(error))

          ensureFile(manifestPath)
            .then(() =>
              outputFile(
                manifestPath,
                `${manifestForBrowser(response, browser)}\n`,
              ),
            )
            .catch((error) => console.error(error))
        })
        .catch((error) => console.error(error))
    })
    await Promise.all(promises)
  } catch (error) {
    console.error(error)
  }
}
