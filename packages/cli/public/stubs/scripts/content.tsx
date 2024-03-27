import { AppMessagesListener } from '@/messages/AppMessagesListener'
import { type FrameConfig, mountFrame, unmountIframe } from './iframe.config'

export const frameConfig: FrameConfig = {
  iframe: {
    id: `__${chrome.runtime.getManifest().name.replace(/[^A-Z0-9]/gi, '_')}__frame__`,
    src: chrome.runtime.getURL('pages/main.html'),
  },
  iframeBg: {
    id: `__${chrome.runtime.getManifest().name.replace(/[^A-Z0-9]/gi, '_')}__overlay__`,
  },
}

export function mountOrUnmountIframe(): void {
  const FrameId = (frameConfig.iframe as { id: string }).id
  document.getElementById(FrameId) === null ? mountFrame() : unmountIframe()
}

export function openOrCloseExtension(): void {
  mountOrUnmountIframe()
}

// start listening for messages from (React) App
chrome.runtime.onMessage.addListener(AppMessagesListener)

// start listening for messages from iframe
// https://developer.mozilla.org/en-US/docs/Web/API/Window/message_event
window.addEventListener('message', (event) => {
  if (event.data.action === 'open-or-close-extension') {
    openOrCloseExtension()
  }
})
