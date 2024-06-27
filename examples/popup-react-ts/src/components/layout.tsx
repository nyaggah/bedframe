import type { ReactNode } from 'react'

export interface LayoutProps {
  children?: ReactNode
}

export function Layout({ children }: LayoutProps): JSX.Element {
  return (
    <div className="flex items-center justify-center flex-col min-w-[360px] min-h-[400px] h-full w-full">
      {children}
    </div>
  )
}
