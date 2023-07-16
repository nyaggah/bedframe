import { ReactNode } from 'react'
import { Styled } from './Layout.Style'

export interface LayoutProps {
  className?: string
  children?: ReactNode
}

export function Layout({ className, children }: LayoutProps): JSX.Element {
  return <Styled.Layout className={className}>{children}</Styled.Layout>
}
