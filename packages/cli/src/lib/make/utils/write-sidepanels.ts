import path from 'node:path'
import type prompts from 'prompts'
import { ensureDir, ensureFile, outputFile } from './utils.fs'

const sidePanelWelcomeContent = `
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Layout } from '@/components/Layout'
import { App } from '@/components/app'

const root = createRoot(document.getElementById('root') as HTMLElement);

root.render(
  <StrictMode>
    <Layout>
      <App />
    </Layout>
  </StrictMode>
)

`

const sidePanelMainContent = `
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Layout } from '@/components/Layout'

const root = createRoot(document.getElementById('root') as HTMLElement);

root.render(
  <StrictMode>
    <Layout>
      <div>
        <p>SidePanel: Main</p>
      </div>
    </Layout>
  </StrictMode>
)

`

export function writeSidePanels(response: prompts.Answers<string>): void {
  const { extension } = response
  const rootDir = path.resolve(extension.name.path)
  const pagesPath = path.resolve(path.join(rootDir, 'src', 'pages'))

  const sidePanels = [
    {
      name: 'welcome',
      files: [
        {
          path: path.resolve(path.join(pagesPath, 'sidepanel-welcome.tsx')),
          content: sidePanelWelcomeContent,
          destination: pagesPath,
        },
      ],
    },
    {
      name: 'main',
      files: [
        {
          path: path.resolve(path.join(pagesPath, 'sidepanel-main.tsx')),
          content: sidePanelMainContent,
          destination: pagesPath,
        },
      ],
    },
  ]

  try {
    ensureDir(pagesPath)
      .then(() => {
        sidePanels.map((sidepanel) => {
          sidepanel.files.map((file) => {
            ensureDir(file.destination).then(() => {
              ensureFile(file.path)
                .then(() => outputFile(file.path, file.content))
                .catch((error) => console.error(error))
            })
          })
        })
      })
      .catch(console.error)
  } catch (error) {
    console.error(error)
  }
}
