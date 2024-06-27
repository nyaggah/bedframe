chrome.runtime.onInstalled.addListener((details): void => {
  chrome.sidePanel.setOptions({ path: sidePanel.welcome })
  console.log('[service-worker.ts] > onInstalled > welcomePanel', details)
})

const sidePanel = {
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
