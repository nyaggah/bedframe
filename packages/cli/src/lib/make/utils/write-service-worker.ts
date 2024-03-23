import path from 'node:path'
import type { ExtensionType } from '@bedframe/core'
import type prompts from 'prompts'
import { ensureDir, ensureFile, outputFile } from './utils.fs'

/**
 * construct code block for onInstalled
 * e.g. sidePanel-specific code
 *
 * @param {boolean} isSidePanel
 * @return {*}  {string}
 */
const onInstalled = (isSidePanel: boolean): string => `
chrome.runtime.onInstalled.addListener((details): void => {
  ${
    isSidePanel
      ? `chrome.sidePanel.setOptions({ path: sidePanel.welcome })
  console.log('[service-worker.ts] > onInstalled > welcomePanel', details)`
      : `console.log('[service-worker.ts] > onInstalled', details)`
  }
})

`

const eventListeners = (isSidePanel: boolean) => onInstalled(isSidePanel)

const browserAction = `
chrome.action.onClicked.addListener((tab: chrome.tabs.Tab): void => {
  chrome.tabs.sendMessage(
    tab.id ?? 0,
    {
      type: 'browser-action',
      action: 'open-or-close-extension',
    },
    (response) => {
      console.log('chrome.action.onClicked.addListener > response:', response)
    },
  )
})

`

const sidePanels = `const sidePanel = {
  welcome: chrome.runtime.getURL('pages/sidepanel-welcome.html'),
  main: chrome.runtime.getURL('pages/sidepanel-main.html'),
}

chrome.sidePanel
.setPanelBehavior({ openPanelOnActionClick: true })
.catch((error: Error) => console.error(error))

chrome.tabs.onActivated.addListener(async ({ tabId }) => {
  const { path } = await chrome.sidePanel.getOptions({ tabId })
  if (path === sidePanel.welcome) {
    chrome.sidePanel.setOptions({ path: sidePanel.main })
  }
})

${browserAction}
`
/**
 * write the service workder (background) scripts based on
 * prompt responses. will include base configs for
 * popup, overlay, sidepanel, and devtools type extensions
 *
 *
 * @export
 * @param {prompts.Answers<string>} response
 */
export function writeServiceWorker(response: prompts.Answers<string>) {
  const { extension } = response
  const rootDir = path.resolve(extension.name.path)
  const serviceWorkerPath = path.resolve(
    path.join(rootDir, 'src', 'scripts', 'service-worker.ts'),
  )
  const isPopup = extension.type.name === 'popup'
  const isOverlay = extension.type.name === 'overlay'
  const isSidePanel = extension.type.name === 'sidepanel'
  // const isDevtools = extension.type.name === 'devtools'
  // const hasFirefox = browsers.includes('firefox')

  const fileContent = (_type: ExtensionType): string => {
    const sidePanelContent = isSidePanel ? sidePanels : ''
    const overlayContent = isPopup || isOverlay ? browserAction : ''

    const content =
      eventListeners(isSidePanel) + sidePanelContent + overlayContent

    return content
  }

  const scriptsDir = path.join(rootDir, 'src', 'scripts')
  ensureDir(scriptsDir).then(() => {
    ensureFile(serviceWorkerPath)
      .then(() =>
        outputFile(
          serviceWorkerPath,
          `${fileContent(extension.type.name)}\n`,
        ).catch((error) => console.error(error)),
      )
      .catch((error) => console.error(error))
  })
}
