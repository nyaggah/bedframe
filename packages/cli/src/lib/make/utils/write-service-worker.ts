import { ExtensionType } from '@bedframe/core'
import path from 'node:path'
import prompts from 'prompts'
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
  console.log('[background.ts] > onInstalled > welcomePanel', details)`
      : `console.log('[background.ts] > onInstalled', details)`
  }
})

`

const eventListeners = (isSidePanel: boolean) => onInstalled(isSidePanel)

const browserAction = `
chrome.action.onClicked.addListener(function (tab: chrome.tabs.Tab): void {
 chrome.tabs.sendMessage(
   tab.id ?? 0,
   {
     type: 'browser-action',
     action: 'toggle',
   },
   (response) => {
     console.log('chrome.action.onClicked.addListener > response:', response)
   }
 )
})

`

const sidePanels = `const sidePanel = {
  welcome: chrome.runtime.getURL('sidepanels/welcome/index.html'),
  main: chrome.runtime.getURL('sidepanels/main/index.html'),
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
    path.join(rootDir, 'src', 'scripts', `background.ts`),
  )
  const isPopup = extension.type.name === 'popup'
  const isOverlay = extension.type.name === 'overlay'
  const isSidePanel = extension.type.name === 'sidepanel'
  // const isDevtools = extension.type.name === 'devtools'
  // const position: PositionType = extension.position // 'center' | 'left' | 'right'
  // const hasFirefox = browsers.includes('firefox')

  const fileContent = (_type: ExtensionType): string => {
    const sidePanelContent = isSidePanel ? sidePanels : ``
    const overlayContent = isPopup || isOverlay ? browserAction : ``

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
          fileContent(extension.type.name) + '\n',
        ).catch((error) => console.error(error)),
      )
      .catch((error) => console.error(error))
  })
}
