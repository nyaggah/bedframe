import { App } from '@/components/app'
import { Layout } from '@/components/layout'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import 'unfonts.css'
import '@/styles/style.css'

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

createRoot(document.getElementById('root') as HTMLElement).render(
  <StrictMode>
    <Layout>
      <App />
    </Layout>
  </StrictMode>,
)
