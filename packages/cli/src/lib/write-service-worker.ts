import fs from 'fs-extra'
import path from 'node:path'
import prompts from 'prompts'

const onInstalled = (isSidePanel: boolean): string => `
chrome.runtime.onInstalled.addListener((details): void => {
  ${
    isSidePanel
      ? `chrome.sidePanel.setOptions({ path: welcomePanel })
  console.log('[background.ts] > onInstalled > welcomePanel', details)
  `
      : `
  console.log('[background.ts] > onInstalled', details)
  `
  }
})

`

const eventListeners = (isSidePanel: boolean) => onInstalled(isSidePanel)

const sidePanels = `
const welcomePanel = 'src/sidepanels/welcome/index.html'
const mainPanel = 'src/sidepanels/main/index.html'

chrome.tabs.onActivated.addListener(async ({ tabId }) => {
  const { path } = await chrome.sidePanel.getOptions({ tabId })
  if (path === welcomePanel) {
    chrome.sidePanel.setOptions({ path: mainPanel })
    console.log('[background.ts] > onInstalled > mainPanel')
  }
})

chrome.sidePanel
.setPanelBehavior({ openPanelOnActionClick: true })
.catch((error: Error) => console.error(error))

`

const overlayBrowserAction = `
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

const devtoolsOnConnect = `
chrome.runtime.onConnect.addListener((port) => {
  console.log('chrome.runtime.onConnect > port', port)
  if (port.name === 'devtools-page') {
    port.onMessage.addListener((message) => {
      if (message.action === 'sendData') {
        // Handle data sent from the DevTools panel
        console.log('Data received from DevTools panel:', message.data)
      }
    })
  }
})

`

// TO diddly DO: move to @bedframe/core
type ExtensionType = 'popup' | 'overlay' | 'sidepanel' | 'devtools'
type ExtensionPosition = 'center' | 'left' | 'right'

export function writeServiceWorker(response: prompts.Answers<string>) {
  const { extension } = response

  const rootDir = path.resolve(extension.name.path)
  // const pagesPath = path.resolve(path.join(rootDir, 'src', 'pages'))
  // const sidePanelsPath = path.resolve(path.join(rootDir, 'src', 'sidepanels'))

  const serviceWorkerPath = path.resolve(
    path.join(rootDir, 'src', 'scripts', `background.ts`)
  )

  const isPopup = extension.type.name === 'popup' // 'popup' | 'overlay' | 'sidepanel' | 'devtools'
  const isOverlay = extension.type.name === 'overlay'
  const isSidePanel = extension.type.name === 'sidepanel'
  const isDevtools = extension.type.name === 'devtools'

  // if (isOverlay)
  const position: ExtensionPosition = extension.position // 'center' | 'left' | 'right'

  // const hasFirefox = browsers.includes('firefox')

  const fileContent = (_type: ExtensionType): string => {
    const sidePanelContent = isSidePanel ? sidePanels : ``
    const overlayContent = isOverlay ? overlayBrowserAction : ``
    const devtoolsContent = isDevtools ? devtoolsOnConnect : ``
    const content =
      eventListeners(isSidePanel) +
      sidePanelContent +
      overlayContent +
      devtoolsContent
    return content
  }

  fs.ensureFile(serviceWorkerPath)
    .then(() =>
      fs
        .outputFile(serviceWorkerPath, fileContent(extension.type.name) + '\n')
        .catch((error) => console.error(error))
    )
    .catch((error) => console.error(error))
}
