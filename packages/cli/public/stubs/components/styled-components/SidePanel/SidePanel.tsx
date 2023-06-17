import { ReactNode } from 'react'
import { Styled } from './SidePanel.Style'

export interface SidePanelProps {
  children?: ReactNode
}

export function SidePanel({ children }: SidePanelProps): JSX.Element {
  return <Styled.SidePanel>{children}</Styled.SidePanel>
}
