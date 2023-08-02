import { ReactNode } from 'react'

export interface LayoutProps {
  children?: ReactNode
}

export function Layout({ children }: LayoutProps): JSX.Element {
  return (
    <div className="flex items-center justify-center flex-col h-full w-full">
      {children}
    </div>
  )
}
