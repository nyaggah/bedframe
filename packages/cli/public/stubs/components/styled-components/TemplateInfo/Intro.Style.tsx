import styled, { keyframes } from 'styled-components/macro'

const BlinkAnimation = keyframes`
  0% {
    opacity: 0;
  }
`

const Intro = styled.div`
  background-color: #181a1d;
  background-image: radial-gradient(#ffffff12 1px, transparent 0);
  background-size: 30px 30px;
  background-position: -20px -22px;
  color: #b6b8bd;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1em;
  height: 100%;
  width: 100%;
  position: relative;
`

const LogoType = styled.div`
  display: flex;
  flex-direction: column;
  .logotype-word {
    display: flex;
    > span {
      min-width: 15px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
  .caret {
    color: #fff;
    font-weight: 800;
    padding-bottom: 1em;
  }
  .caret-blinker {
    animation: ${BlinkAnimation} 1.5s steps(2) infinite;
  }
  .b {
    color: #c792e9;
  }
  .e {
    color: #c3e88d;
  }
  .d {
    color: #8addff;
  }
  .frame {
    color: #ffcb6b;
  }
`

const Closure = styled.div`
  position: absolute;
  top: 15px;
  right: 15px;
  font-size: 1.5em;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: #ffffff0a;
  height: 28px;
  width: 28px;
  cursor: pointer;
`

const Masthead = styled.div`
  display: flex;
  flex-direction: column;
  width: max-content;
  gap: 1em;
`
const IntroText = styled.div`
  letter-spacing: 0.5px;
  line-height: 160%;

  .bed {
    color: #fff;
    letter-spacing: 3px;
  }
`

export const Styled = {
  Intro,
  LogoType,
  Closure,
  Masthead,
  IntroText,
}
