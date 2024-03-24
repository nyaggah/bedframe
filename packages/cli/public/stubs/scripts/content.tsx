import { AppMessagesListener } from '@/messages/AppMessagesListener'
import { type FrameConfig, mountFrame, unmountIframe } from './iframe.config'

export const frameConfig: FrameConfig = {
  iframe: {
    id: `__${chrome.runtime.getManifest().name.replace(/[^A-Z0-9]/gi, '_')}__extension-root__`,
    src: chrome.runtime.getURL('pages/main.html'),
  },
  iframeBg: {
    id: `__${chrome.runtime.getManifest().name.replace(/[^A-Z0-9]/gi, '_')}__extension-overlay__`,
  },
}

/**
 * If the iframe doesn't exist (find by id), mount it,
 * otherwise, find it and remove it from the page
 */
export function mountOrUnmountIframe(): void {
  const FrameId = (frameConfig.iframe as { id: string }).id
  document.getElementById(FrameId) === null ? mountFrame() : unmountIframe()
}

export function openOrCloseExtension(): void {
  mountOrUnmountIframe()
}

// start listening for messages from (React) App
chrome.runtime.onMessage.addListener(AppMessagesListener)

// start listening for messages from iframe to parent/current page
// we load the `main` page in the iframe so we'll have
// a different origin. use js messaging! 🎉
window.addEventListener('message', (event) => {
  if (event.data.action === 'open-or-close-extension') {
    openOrCloseExtension()
  }
})
