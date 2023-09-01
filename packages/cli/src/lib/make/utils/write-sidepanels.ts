import path from 'node:path'
import prompts from 'prompts'
import { ensureDir, ensureFile, outputFile } from './utils.fs'

const sidePanelWelcomeContent = `
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Layout } from '@/components/Layout'
import { App } from '@/components/App'

const root = createRoot(document.getElementById('root') as HTMLElement);

root.render(
  <StrictMode>
    <Layout>
      <App />
    </Layout>
  </StrictMode>
)

`
const sidePanelWelcomeHtmlContent = `
<!DOCTYPE html>
<html>
  <head>
    <title>Sidepanel: Welcome</title>
    <style>
      #root {
        height: 100%;
      }
    </style>
  </head>

  <body>
    <div id="root"></div>
    <script type="module" src="./welcome.tsx"></script>
  </body>
</html>

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

const sidePanelMainHtmlContent = `
<!DOCTYPE html>
<html>
  <head>
    <title>Sidepanel: Main</title>
    <style>
      #root {
        height: 100%;
      }
    </style>
  </head>

  <body>
    <div id="root"></div>
    <script type="module" src="./main.tsx"></script>
  </body>
</html>

`

export function writeSidePanels(response: prompts.Answers<string>): void {
  const { extension } = response

  const rootDir = path.resolve(extension.name.path)

  const sidePanelsPath = path.resolve(path.join(rootDir, 'src', 'sidepanels'))
  const sidePanelsMainPath = path.resolve(path.join(sidePanelsPath, 'main'))
  const sidePanelsWelcomePath = path.resolve(
    path.join(sidePanelsPath, 'welcome'),
  )

  const sidePanels = [
    {
      name: 'welcome',
      files: [
        {
          path: path.resolve(path.join(sidePanelsWelcomePath, 'welcome.tsx')),
          content: sidePanelWelcomeContent,
          destination: sidePanelsWelcomePath,
        },
        {
          path: path.resolve(path.join(sidePanelsWelcomePath, 'index.html')),
          content: sidePanelWelcomeHtmlContent,
          destination: sidePanelsWelcomePath,
        },
      ],
    },
    {
      name: 'main',
      files: [
        {
          path: path.resolve(path.join(sidePanelsMainPath, 'main.tsx')),
          content: sidePanelMainContent,
          destination: sidePanelsMainPath,
        },
        {
          path: path.resolve(path.join(sidePanelsMainPath, 'index.html')),
          content: sidePanelMainHtmlContent,
          destination: sidePanelsMainPath,
        },
      ],
    },
  ]

  try {
    ensureDir(sidePanelsPath)
      .then(() => {
        sidePanels.map((sidepanel) => {
          sidepanel.files.map((file) => {
            ensureDir(file.destination).then(() => {
              ensureFile(file.path)
                .then(() => {
                  // TO diddly DO: do we need ensureFile or ensureDir
                  // if we use outputFile ?? will create dir if not exists!
                  outputFile(file.path, file.content)
                })
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
