import fs from 'fs-extra'
// import { AnyCase, Browser } from "@bedframe/core";
import path from 'node:path'
import prompts from 'prompts'

const onInstalled = `
/**
 *  Fired when the extension is first installed,
 *  when the extension is updated to a new version,
 *  and when Chrome is updated to a new version
 *  */
chrome.runtime.onInstalled.addListener((details): void => {
  console.log('[background.ts] > onInstalled', details)
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

const eventListeners = onInstalled + onConnect + onStartup + onSuspend

const sidePanels = `
const welcomePanel = 'sidepanels/welcome.html'
const mainPanel = 'sidepanels/main.html'

/**
 *  Fired when the extension is first installed,
 *  when the extension is updated to a new version,
 *  and when Chrome is updated to a new version
 *  */
chrome.runtime.onInstalled.addListener(() => {
  chrome.sidePanel.setOptions({ path: welcomePanel })
  console.log('[background.ts] > onInstalled > welcomePanel')
})

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

  const fileContent = (type: ExtensionType): string => {
    console.log('type', type)

    const sidePanelContent = isSidePanel ? sidePanels : ''
    const content = eventListeners + sidePanelContent
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

// SIDEPANEL(s)
// - multiple
