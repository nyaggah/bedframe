import { Router } from 'react-chrome-extension-router'
import { createTemplate } from '@bedframe/core'
import { TemplateInfo } from '../TemplateInfo'
import { GlobalStyles } from '@/styles'
import { Styled } from './App.Style'

function App(): JSX.Element {
  return (
    <>
      <GlobalStyles />
      <Styled.App>
        <Router>
          <TemplateInfo
            template={createTemplate({
              // name: chrome.runtime.getManifest().name,
              // version: chrome.runtime.getManifest().version,
              // description: chrome.runtime.getManifest().description,
              config: {
                packageManager: 'yarn',
                framework: 'react',
                language: 'typescript',
                style: 'Tailwind',
                lintFormat: true,
                tests: true,
                git: true,
                gitHooks: true,
                commitLint: true,
                changesets: true,
              },
            })}
          />
        </Router>
      </Styled.App>
    </>
  )
}

export default App
