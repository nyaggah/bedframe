import { Router } from 'react-chrome-extension-router'
import { TemplateInfo } from '../TemplateInfo'
import { GlobalStyles } from '@/styles'
import { Styled } from './App.Style'

function App(): JSX.Element {
  return (
    <>
      <GlobalStyles />
      <Styled.App>
        <Router>
          <TemplateInfo />
        </Router>
      </Styled.App>
    </>
  )
}

export default App
