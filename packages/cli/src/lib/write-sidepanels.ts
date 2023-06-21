import fs from 'fs-extra'
import path from 'node:path'
import prompts from 'prompts'

const sidePanelWelcomeContent = `
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { SidePanel } from '@/components/SidePanel'
import { App } from '@/components/App'

const root = createRoot(document.getElementById('root') as HTMLElement);

root.render(
  <StrictMode>
    <SidePanel>
      <App />
    </SidePanel>
  </StrictMode>
)

`
const sidePanelMainContent = `
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { SidePanel } from '@/components/SidePanel'
// import { App } from '@/components/App'

const root = createRoot(document.getElementById('root') as HTMLElement);

root.render(
  <StrictMode>
    <SidePanel>
      {/* <App /> */}
      <div>
        <p>SidePanel: Main</p>
      </div>
    </SidePanel>
  </StrictMode>
)

`

export function writeSidePanels(response: prompts.Answers<string>): void {
  const { extension } = response

  const rootDir = path.resolve(extension.name.path)

  const sidePanelsPath = path.resolve(path.join(rootDir, 'src', 'sidepanels'))

  const sidePanels = [
    {
      name: 'welcome',
      path: path.resolve(path.join(sidePanelsPath, 'welcome.html')),
      content: sidePanelWelcomeContent,
    },
    {
      name: 'main',
      path: path.resolve(path.join(sidePanelsPath, 'welcome.html')),
      content: sidePanelMainContent,
    },
  ]

  try {
    fs.ensureDir(sidePanelsPath).catch(console.error)
    sidePanels.map((sidepanel) => {
      fs.ensureFile(sidepanel.path)
        .then(() =>
          fs
            .outputFile(sidepanel.path, sidepanel.content + '\n')
            .catch((error) => console.error(error))
        )
        .catch((error) => console.error(error))
    })
  } catch (error) {
    console.error(error)
  }
}
