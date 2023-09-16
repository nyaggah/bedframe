import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Layout } from '@/components/Layout'
import { App } from '@/components/App'
import 'unfonts.css'
import { GlobalStyles } from '@/styles'

const root = createRoot(document.getElementById('root') as HTMLElement)

root.render(
  <StrictMode>
    <Layout>
      <App />
    </Layout>
    <GlobalStyles />
  </StrictMode>,
)
