import { App } from '@/components/app'
import { mountPage } from '@/components/page-root'

chrome.devtools.panels.create(
  'Bedframe (Panel)',
  'assets/icons/icon-128x128.png',
  'pages/devtools.html',
)

chrome.devtools.panels.elements.createSidebarPane(
  'Bedframe (Side Panel)',
  (panel) => {
    panel.setPage('pages/devtools-panel.html')
    panel.setHeight('8ex')
    panel.setObject({
      data: 'Some data to show',
    })
  },
)

mountPage(<App />)
