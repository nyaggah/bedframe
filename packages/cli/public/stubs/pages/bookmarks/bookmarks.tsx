import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Layout } from '@/components/Layout'
import { GlobalStyles } from '@/styles'

const root = createRoot(document.getElementById('root') as HTMLElement)

root.render(
  <StrictMode>
    <Layout>
      <div>
        <p>Bookmarks Override Page</p>
      </div>
    </Layout>
    <GlobalStyles />
  </StrictMode>
)
