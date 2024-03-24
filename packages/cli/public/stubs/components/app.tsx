import { Intro } from '@/components/intro'
import '@/styles/style.css'

export function App(): JSX.Element {
  return (
    <div className="flex items-center justify-center w-full h-full rounded-xl">
      <Intro />
    </div>
  )
}
