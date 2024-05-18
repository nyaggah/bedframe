import { Layout } from '@/components/layout'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

const root = createRoot(document.getElementById('root') as HTMLElement)

root.render(
  <StrictMode>
    <Layout>
      <div>
        <p>SidePanel: Main</p>
      </div>
    </Layout>
  </StrictMode>,
)
