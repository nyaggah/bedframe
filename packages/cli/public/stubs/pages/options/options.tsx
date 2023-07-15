import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { SidePanel } from '@/components/SidePanel'

const root = createRoot(document.getElementById('root') as HTMLElement)

root.render(
  <StrictMode>
    <SidePanel>
      <div>
        <p>Extension Options</p>
      </div>
    </SidePanel>
  </StrictMode>
)
