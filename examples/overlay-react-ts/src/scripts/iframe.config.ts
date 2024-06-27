import { frameConfig } from './content'

export interface FrameConfig {
  iframe: Partial<HTMLIFrameElement>
  iframeBg: Partial<HTMLElement>
}

export function createIframe(): HTMLIFrameElement {
  // Create the iframe element
  const Frame = document.createElement('iframe')

  // Assign the iframe a unique id
  // Assert that though we expect Partial<HTMLIFrameElement>
  // we're sure the config.id and config.src will be present
  Frame.id = (frameConfig.iframe as { id: string }).id
  Frame.src = (frameConfig.iframe as { src: string }).src

  // Assign styles
  Frame.style.background = 'hsl(0 0% 14.9%)'
  Frame.style.border = '1px solid transparent'
  Frame.style.display = 'flex'
  Frame.style.alignItems = 'center'
  Frame.style.justifyContent = 'center'
  Frame.style.position = 'fixed'
  Frame.style.top = '50%'
  Frame.style.left = '50%'
  Frame.style.width = '500px'
  Frame.style.minHeight = '600px'
  Frame.style.transform = 'translate(-50%, -50%)'
  Frame.style.zIndex = '1000000120'
  Frame.style.boxSizing = 'border-box'
  Frame.style.borderRadius = '3px'
  Frame.style.overflow = 'hidden'
  Frame.style.boxShadow =
    'rgba(0, 0, 0, 0.075) 0px 1px 1px, rgba(0, 0, 0, 0.075) 0px 2px 2px, rgba(0, 0, 0, 0.075) 0px 4px 4px, rgba(0, 0, 0, 0.075) 0px 8px 8px, rgba(0, 0, 0, 0.075) 0px 16px 16px'

  // Assign attributes
  Frame.allow = ''
  Frame.allowFullscreen = true

  // @ts-expect-error Property 'allowtransparency' does not exist on type 'HTMLIFrameElement'
  Frame.allowtransparency = true

  return Frame
}

export function createIframeBg(): HTMLDivElement {
  // Create the div element
  const FrameBg = document.createElement('div')

  // Assign the iframe a unique id
  // Assert that even though we expect Partial<HTMLIFrameElement>
  // we're sure the config.id will be present
  FrameBg.id = (frameConfig.iframeBg as { id: string }).id

  // Assign styles
  FrameBg.style.display = 'flex'
  FrameBg.style.alignItems = 'center'
  FrameBg.style.justifyContent = 'center'
  FrameBg.style.position = 'fixed'
  FrameBg.style.height = '100vh'
  FrameBg.style.width = '100vw'
  FrameBg.style.top = '0'
  FrameBg.style.left = '0'
  FrameBg.style.zIndex = '1000000119'
  FrameBg.style.boxSizing = 'border-box'
  FrameBg.style.backgroundColor = 'rgba(0, 0, 0, 0.5)'

  return FrameBg
}

export function mountFrame() {
  const Frame = createIframe()
  const FrameBg = createIframeBg()

  // Render the iframe bg (overlay) on the page
  document.body.appendChild(FrameBg)
  // Insert the iframe inside the overlay div
  FrameBg.appendChild(Frame)
}

export function unmountIframe(): void {
  const FrameBgId = (frameConfig.iframeBg as { id: string }).id
  document.getElementById(FrameBgId)?.remove()
}
