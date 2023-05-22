import { type ReactNode, useContext } from 'react'
import { FrameContext } from 'react-frame-component'
import { StyleSheetManager } from 'styled-components/macro'
import { Styled } from './Iframe.Style'

export interface IframeProps {
  children?: ReactNode
}

export function IframeContentStyles(props: IframeProps): JSX.Element {
  const { document } = useContext(FrameContext)

  return (
    <StyleSheetManager target={document?.head}>
      <>{props.children}</>
    </StyleSheetManager>
  )
}

export function Iframe(props: IframeProps): JSX.Element {
  const { children, ...rest } = props

  return (
    <Styled.Iframe {...rest}>
      <IframeContentStyles>{children}</IframeContentStyles>
    </Styled.Iframe>
  )
}

export default Iframe

Iframe.displayName = 'Iframe'
