import fs from 'fs-extra'
import path from 'node:path'
import prompts from 'prompts'

const onInstalled = (isSidePanel: boolean): string => `
/**
 *  Fired when the extension is first installed,
 *  when the extension is updated to a new version,
 *  and when Chrome is updated to a new version
 *  */
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

const onConnect = `
/**
 *  Fired when a connection is made from either
 *  an extension process or a content script  */
chrome.runtime.onConnect.addListener(function (port): void {
  console.log('[background.ts] > onConnect', port)
})

`

const onStartup = `
/**
 *  Fired when a profile that has this extension installed first starts up.
 *  This event is not fired when an incognito profile is started,
 *  even if this extension is operating in 'split' incognito mode */
chrome.runtime.onStartup.addListener(function (): void {
  console.log('[background.ts] > onStartup')
})

`

const onSuspend = `
/**
 *  Sent to the event page just before it is unloaded.
 *  This gives the extension opportunity to do some clean up.
 *  Note that since the page is unloading,
 *  any asynchronous operations started while handling this event
 *  are not guaranteed to complete.
 *  If more activity for the event page occurs before it gets
 *  unloaded the onSuspendCanceled event will
 *  be sent and the page won't be unloaded  */
chrome.runtime.onSuspend.addListener(function (): void {
  console.log('[background.ts] > onSuspend')
})

`

const eventListeners = (isSidePanel: boolean) =>
  onInstalled(isSidePanel) + onConnect + onStartup + onSuspend

const sidePanels = `
const welcomePanel = 'src/sidepanels/welcome/index.html'
const mainPanel = 'src/sidepanels/main/index.html'

/**
 *  Fires when the active tab in a window changes. 
 *  Note that the tab's URL may not be set at the time this event fired, 
 *  but you can listen to onUpdated events so as to be notified when a URL is set.
 *  */
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

const overlayBrowserAction = `/**
*  Fired when an action icon is clicked.
*  This event will not fire if the action has a popup */
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

const devtoolsOnConnect = `// Listen for connections from the DevTools panel
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
