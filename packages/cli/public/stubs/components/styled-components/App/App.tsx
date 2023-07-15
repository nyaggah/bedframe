import { Router } from 'react-chrome-extension-router'
import { GlobalStyles } from '@/styles'
import { Styled } from './App.Style'
import { Intro } from '../Intro'

function App(): JSX.Element {
  return (
    <>
      <GlobalStyles />
      <Styled.App>
        <Router>
          <Intro />
        </Router>
      </Styled.App>
    </>
  )
}

export default App
