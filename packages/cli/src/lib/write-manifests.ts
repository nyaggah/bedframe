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
        ? `default_popup: 'src/pages/popup/index.html',`
        : ''
    }
  },

  // Optional
  // - - - - - - - - -
  ${response.extension.author.email ? `author: pkg.author.email,` : ''}
  background: {
    service_worker: 'src/scripts/background.ts',
    type: 'module',
  },
  ${
    extensionType === 'sidepanel'
      ? `side_panel: {
    default_path: 'src/sidepanels/welcome/index.html',
  },`
      : ''
  }
  ${
    optionsPage === 'full-page'
      ? `options_page: 'src/pages/options/index.html',`
      : `options_ui: {
    page: 'src/pages/options/index.html',
    open_in_tab: false,
  },`
  }
  ${
    extensionType === 'devtools'
      ? `devtools_page: 'src/pages/devtools/index.html',`
      : ''
  }  
  ${
    overridePage !== 'none'
      ? `chrome_url_overrides: {
    ${`${overridePage}: 'src/pages/${overridePage}/index.html',`}
  },`
      : ''
  }    
  ${
    response.extension.type.name === 'overlay'
      ? `content_scripts: [
    {
      js: ['src/scripts/content.tsx'],
      matches: ['<all_urls>'],
    },
  ],`
      : ''
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
        : ''
    } 
  ],
})

`
}

export function manifestForBrowser(browser: Browser): string {
  return `import { createManifest } from '@bedframe/core'
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
  const manifestBasePath = path.join(manifestDir, 'base.manifest.ts')
  const manifestIndexPath = path.join(manifestDir, 'index.ts')

  try {
    const promises = browsers.map(async (browser: Browser) => {
      const manifestPath = path.join(manifestDir, `${browser.toLowerCase()}.ts`)
      await Promise.all([
        fs.outputFile(manifestIndexPath, `${manifestIndexFile(browsers)}\n`),
        fs.outputFile(manifestBasePath, `${writeBaseManifest(response)}\n`),
        fs.outputFile(manifestPath, `${manifestForBrowser(browser)}\n`),
      ])
    })
    await Promise.all(promises)
  } catch (error) {
    console.error(error)
  }
}
