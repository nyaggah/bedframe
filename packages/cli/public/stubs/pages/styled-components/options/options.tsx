import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Layout } from '@/components/Layout'
import 'unfonts.css'
import { GlobalStyles } from '@/styles'

const root = createRoot(document.getElementById('root') as HTMLElement)

root.render(
  <StrictMode>
    <Layout>
      <div>
        <p>Extension Options</p>
      </div>
    </Layout>
    <GlobalStyles />
  </StrictMode>,
)
