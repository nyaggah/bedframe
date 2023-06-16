export default function background(): void {
  /**
   *  Fired when the extension is first installed,
   *  when the extension is updated to a new version,
   *  and when Chrome is updated to a new version */
  chrome.runtime.onInstalled.addListener((details): void => {
    console.log('[background.ts] onInstalled', details)
  })

  /**
   *  Fired when a connection is made from either
   *  an extension process or a content script  */
  chrome.runtime.onConnect.addListener(function (port): void {
    console.log('[background.ts] onConnect', port)
  })

  /**
   *  Fired when a profile that has this extension installed first starts up.
   *  This event is not fired when an incognito profile is started,
   *  even if this extension is operating in 'split' incognito mode */
  chrome.runtime.onStartup.addListener(function (): void {
    console.log('[background.ts] onStartup')
  })

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
    console.log('[background.ts] onSuspend')
  })

  /**
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
}

background()
