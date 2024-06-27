import { Layout } from '@/components/layout'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import 'unfonts.css'
import '@/styles/style.css'

const root = createRoot(document.getElementById('root') as HTMLElement)

root.render(
  <StrictMode>
    <Layout>
      <div>
        <p>New Tab Override Page</p>
      </div>
    </Layout>
  </StrictMode>,
)
