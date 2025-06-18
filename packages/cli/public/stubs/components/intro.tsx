export function Intro() {
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

  - - - 
  
  Nice! you have bed head 🚀

  `)

  return (
    <div className="flex flex-col items-center justify-center min-w-[360px] min-h-[400px] w-full h-full bg-background">
      <div className="flex flex-col w-max gap-[1em]">
        <div className="flex flex-col">
          <span className="text-muted-foreground/40 font-extrabold pb-[1em]">
            &gt;<span className="animation-pulse">_</span>
          </span>
          <div className="flex text-[#c792e9]">
            <span>B</span>
            <span>R</span>
            <span>O</span>
            <span>W</span>
            <span>S</span>
            <span>E</span>
            <span>R</span>
          </div>
          <div className="flex text-[#c3e88d]">
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
          <div className="flex text-[#8addff]">
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
          <div className="flex text-[#ffcb6b]">
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
        </div>

        <div className="tracking-[0.5px] leading-[160%]">
          You're officially in
          <br />{' '}
          <span className="text-foreground font-semibold tracking-[3px]">
            BED
          </span>
          . Goodnight!
        </div>
      </div>
    </div>
  )
}
