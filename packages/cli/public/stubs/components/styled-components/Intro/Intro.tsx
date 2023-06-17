import { Styled } from './Intro.Style'

export function Intro(): JSX.Element {
  const bedHead = {
    name: chrome.runtime.getManifest().name,
    version: chrome.runtime.getManifest().version,
    description: chrome.runtime.getManifest().description,
    icon: chrome.runtime.getManifest().action.default_icon[128],
  }

  console.log(`
  >_

  B R O W S E R
  E X T E N S I O N
  D E V E L O P M E N T
  F R A M E W O R K

  name: ${bedHead.name}
  version: ${bedHead.version}
  description: ${bedHead.description}

  `)
  // console.log('Nice! you have bed head 🚀', bedHead)
  return (
    <Styled.Intro>
      <Styled.Closure>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="1em"
          height="1em"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path d="M18 6L6 18"></path>
          <path d="M6 6L18 18"></path>
        </svg>
      </Styled.Closure>
      <Styled.Masthead>
        <Styled.LogoType>
          <span className="caret">
            &gt;<span className="caret-blinker">_</span>
          </span>
          <div className="logotype-word b">
            <span>B</span>
            <span>R</span>
            <span>O</span>
            <span>W</span>
            <span>S</span>
            <span>E</span>
            <span>R</span>
          </div>
          <div className="logotype-word e">
            <span>E</span>
            <span>X</span>
            <span>T</span>
            <span>E</span>
            <span>N</span>
            <span>S</span>
            <span>I</span>
            <span>O</span>
            <span>N</span>
          </div>
          <div className="logotype-word d">
            <span>D</span>
            <span>E</span>
            <span>V</span>
            <span>E</span>
            <span>L</span>
            <span>O</span>
            <span>P</span>
            <span>M</span>
            <span>E</span>
            <span>N</span>
            <span>T</span>
          </div>
          <div className="logotype-word frame">
            {' '}
            <span>F</span>
            <span>R</span>
            <span>A</span>
            <span>M</span>
            <span>E</span>
            <span>W</span>
            <span>O</span>
            <span>R</span>
            <span>K</span>
          </div>
        </Styled.LogoType>

        <Styled.IntroText>
          You're officially in
          <br /> <span className="bed">BED</span>. Goodnight!
        </Styled.IntroText>
      </Styled.Masthead>
    </Styled.Intro>
  )
}
