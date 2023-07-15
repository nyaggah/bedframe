import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { SidePanel } from '@/components/SidePanel'
import { App } from '@/components/App'

const root = createRoot(document.getElementById('root') as HTMLElement)

// hmmmmm ????
chrome.action.onClicked.addListener(() => {
  console.log('onclicked...')
  chrome.tabs.create({ url: 'src/pages/devtools/index.html' })
})

// Create Devtools page
chrome.devtools.panels.create(
  'Bedframe (Devtools)',
  'assets/icons/icon-128x128.png',
  'src/pages/devtools/index.html',
  function (panel) {
    console.log('panel', panel)
    // code invoked on panel creation
  }
)

// Create & define sidepanels & elements
chrome.devtools.panels.elements.createSidebarPane(
  'Bedframe (Devtools Sidebar)',
  function (sidepanel) {
    console.log('sidebar', sidepanel)
    sidepanel.setPage('src/pages/devtools/sidepanel.html')
    sidepanel.setHeight('8ex')
    // sidepanel initialization code here
    sidepanel.setObject({ some_data: 'Some data to show' })
  }
)

root.render(
  <StrictMode>
    <SidePanel>
      <App />
    </SidePanel>
    <button id="send-button">Send Data to Background</button>
    <div>devtools</div>
  </StrictMode>
)
