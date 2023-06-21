import styled, { keyframes } from 'styled-components/macro'

const FlexDiv = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
`

const FlexButton = styled.button`
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
`

const IntroAnimation = keyframes`
  from {
    opacity: 0;
    transform: translateY(.25rem);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`

const BlinkAnimation = keyframes`
  0% {
    opacity: 0;
  }
`

export const Utility = {
  FlexDiv,
  FlexButton,

  IntroAnimation,
  BlinkAnimation,
}
