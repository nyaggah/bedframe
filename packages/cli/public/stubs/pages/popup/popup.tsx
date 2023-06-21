import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { SidePanel } from '@/components/SidePanel'
import { App } from '@/components/App'

const root = createRoot(document.getElementById('root') as HTMLElement)

root.render(
  <StrictMode>
    <SidePanel>
      <App />
    </SidePanel>
  </StrictMode>
)
