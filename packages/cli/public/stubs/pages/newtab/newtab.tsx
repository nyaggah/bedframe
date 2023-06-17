import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { SidePanel } from '@/components/SidePanel'
import { GlobalStyles } from '@/styles'

const root = createRoot(document.getElementById('root') as HTMLElement)

root.render(
  <StrictMode>
    <SidePanel>
      <div>
        <p>New Tab Override Page</p>
      </div>
    </SidePanel>
    <GlobalStyles />
  </StrictMode>
)
