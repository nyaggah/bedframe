import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { SidePanel } from '@/components/SidePanel'

const root = createRoot(document.getElementById('root') as HTMLElement)

root.render(
  <StrictMode>
    <SidePanel>
      {/* <App /> */}
      <div>
        <p>Options Page (full page)</p>
      </div>
    </SidePanel>
  </StrictMode>
)
