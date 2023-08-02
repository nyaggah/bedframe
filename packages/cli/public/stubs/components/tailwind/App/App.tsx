import { Router } from 'react-chrome-extension-router'
import { Intro } from '../Intro'
import '@/styles/style.css'

export function App(): JSX.Element {
  return (
    <div className="flex items-center justify-center w-full h-full rounded-xl">
      <Router>
        <Intro />
      </Router>
    </div>
  )
}
