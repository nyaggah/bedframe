import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from '@/components/App/App'
import { Iframe } from '@/components/Iframe/Iframe'

const name = chrome.runtime.getManifest().name ?? 'bedframe'
export const extension = {
  name,
  rootElementId: `__${name}__extension-root__`,
  rootStylesheetId: `__${name}__extension-root-stylesheet__`,
}

export function toggle(): void {
  document.getElementById(extension.rootElementId) === null
    ? setTimeout(function () {
        createAndMount()
      })
    : setTimeout(function () {
        removeRootAndStyles()
      })
}

export function removeRootAndStyles(
  root: string = extension.rootElementId,
  rootStylesheet: string = extension.rootStylesheetId
): void {
  document.getElementById(root)?.remove()
  document.getElementById(rootStylesheet)?.remove()
}

export function createAndMountRootStyles(
  rootId: string = extension.rootElementId
): void {
  if (document.getElementById(extension.rootStylesheetId) === null) {
    const rootStyleTextContent = `
      #${rootId} {
        display: flex;
        align-items: center;
        justify-content: center;
        position: fixed;
        height: 100vh;
        width: 100vw;
        top: 0;
        left: 0;
        z-index: 1000000120;
        box-sizing: border-box;
        background-color: rgba(0,0,0,50%);
      }
    `
    // The Overlay div
    // We'll position the iframe w/ our content inside this guy
    const rootStyle = document.createElement('style')
    rootStyle.id = extension.rootStylesheetId
    rootStyle.textContent = rootStyleTextContent
    document.head.append(rootStyle)
  }
}

export function createAndMountRoot(): void {
  if (document.getElementById(extension.rootElementId) === null) {
    const root = document.createElement('div')
    root.id = extension.rootElementId
    document.body.append(root)

    createRoot(root).render(
      <StrictMode>
        <Iframe>
          <App />
        </Iframe>
      </StrictMode>
    )
  }
}

// =================APP===================
export function createAndMount(): void {
  setTimeout(function () {
    createAndMountRoot()
  })
  createAndMountRootStyles()
}

// =============MESSAGE PASSING===========
export type MessageResponse = (response?: any) => void

const messagesFromReactAppListener = (
  message: any,
  _sender: chrome.runtime.MessageSender, // currently unused. rename to `sender` to user
  response: MessageResponse
): void => {
  if (message.action === 'toggle') {
    toggle()
    response()
  }
}

;(function init(): void {
  chrome.runtime.onMessage.addListener(messagesFromReactAppListener)
})()
