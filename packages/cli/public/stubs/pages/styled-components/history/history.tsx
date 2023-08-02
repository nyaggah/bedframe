import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { GlobalStyles } from '@/styles'
import { Layout } from '@/components/Layout'

const root = createRoot(document.getElementById('root') as HTMLElement)

root.render(
  <StrictMode>
    <Layout>
      <div>
        <p>History Override Page</p>
      </div>
    </Layout>
    <GlobalStyles />
  </StrictMode>
)
