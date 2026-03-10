import type { ReactNode } from 'react'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Layout } from '@/components/layout'
import { ThemeProvider } from '@/components/theme-provider'
import '@/index.css'

export function mountPage(content: ReactNode) {
  const root = createRoot(document.getElementById('root') as HTMLElement)

  root.render(
    <StrictMode>
      <ThemeProvider>
        <Layout>{content}</Layout>
      </ThemeProvider>
    </StrictMode>,
  )
}
