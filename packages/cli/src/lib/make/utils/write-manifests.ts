import fs from 'fs-extra'
import path from 'node:path'
import { Answers } from 'prompts'
import { Browser } from '@bedframe/core'

export function writeBaseManifest(response: Answers<string>): string {
  const {
    override: overridePage,
    options: optionsPage,
    type,
  } = response.extension
  const { name: extensionType } = type

  return `import { createManifestBase } from '@bedframe/core'
import pkg from '../../package.json'

export default createManifestBase({
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
    ${
      extensionType === 'popup'
        ? `default_popup: 'pages/popup/index.html',`
        : ''
    }
  },

  // Optional
  // - - - - - - - - -
  ${response.extension.author.email ? `author: pkg.author.email,` : ``}
  background: {
    service_worker: 'scripts/background.ts',
    type: 'module',
  },
  ${
    extensionType === 'sidepanel'
      ? `side_panel: {
    default_path: 'sidepanels/welcome/index.html',
  },`
      : ``
  }
  ${
    optionsPage === 'full-page'
      ? `options_page: 'pages/options/index.html',`
      : optionsPage === 'embedded'
      ? `options_ui: {
    page: 'pages/options/index.html',
    open_in_tab: false,
  },`
      : ``
  }
  ${
    extensionType === 'devtools'
      ? `devtools_page: 'pages/devtools/index.html',`
      : ``
  }  
  ${
    overridePage !== 'none'
      ? `chrome_url_overrides: {
    ${`${overridePage}: 'pages/${overridePage}/index.html',`}
  },`
      : ``
  }    
  ${
    response.extension.type.name === 'overlay'
      ? `content_scripts: [
    {
      js: ['scripts/content.tsx'],
      matches: ['<all_urls>'],
    },
  ],`
      : ``
  }
  web_accessible_resources: [
    {
      resources: ['assets/icons/*.png', 'assets/fonts/inter/*.ttf'],
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
        : ``
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
    optionsPage === 'embedded' ? `options_ui` : `options_page`
  const firefoxManifest = `import { createManifest } from '@bedframe/core'
import baseManifest from './base.manifest'

let { permissions } = baseManifest
const { ${optionsUIorPage}${
    extensionType === 'sidepanel' ? `, side_panel` : ''
  }, ...rest } = baseManifest
  
${
  extensionType === 'sidepanel'
    ? `side_panel = {
  default_icon: baseManifest.action.default_icon,
  default_title: baseManifest.name,
  default_panel: baseManifest.side_panel.default_path,
}`
    : ''
}
${
  optionsPage === 'full-page' || optionsPage === 'embedded'
    ? `const optionsUI = {
  page: ${optionsPage === 'full-page' ? `options_page` : 'options_ui.page'},
}`
    : ''
}
permissions = ['activeTab', 'scripting'] // <--- update as necessary

export const firefox = createManifest(
  {
    ...rest,
    ${extensionType === 'sidepanel' ? `sidebar_action: side_panel,` : ''}
    browser_specific_settings: {
      gecko: {
        id: 'bedframe-${projectName
          .trim()
          .replace(/\s+/g, '-')
          .toLowerCase()}', // <--- update as necessary
      },
    },
    ${
      optionsPage === 'full-page' || optionsPage === 'embedded'
        ? `options_ui: optionsUI,`
        : ''
    }
    permissions: permissions,
  },
  'firefox',
)

/*
  N O T E :

  Sidebar Action:
    - https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/manifest.json/sidebar_action
    - https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/user_interface/Sidebars#specifying_sidebars
  Browser Specific Settings
    - https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/manifest.json/browser_specific_settings#examples
    - https://extensionworkshop.com/documentation/develop/extensions-and-the-add-on-id/#when-do-you-need-an-add-on-id
*/
`
  const isFirefox = browser.toLowerCase() === 'firefox'
  return isFirefox
    ? firefoxManifest
    : `import { createManifest } from '@bedframe/core'
import baseManifest from './base.manifest'

export const ${browser.toLowerCase()} = createManifest(
  {
    ...baseManifest,
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
          `import { ${browser.toLowerCase()} } from './${browser.toLowerCase()}'`,
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
  const manifestBasePath = path.join(manifestDir, 'base.manifest.ts')
  const manifestIndexPath = path.join(manifestDir, 'index.ts')

  try {
    const promises = browsers.map(async (browser: Browser) => {
      const manifestPath = path.join(manifestDir, `${browser.toLowerCase()}.ts`)
      await Promise.all([
        fs.outputFile(manifestIndexPath, `${manifestIndexFile(browsers)}\n`),
        fs.outputFile(manifestBasePath, `${writeBaseManifest(response)}\n`),
        fs.outputFile(
          manifestPath,
          `${manifestForBrowser(response, browser)}\n`,
        ),
      ])
    })
    await Promise.all(promises)
  } catch (error) {
    console.error(error)
  }
}
