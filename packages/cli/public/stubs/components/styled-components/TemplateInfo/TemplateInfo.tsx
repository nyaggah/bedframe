import { type BedframeTemplate } from '@bedframe/core'

export interface TemplateInfoProps {
  className?: string
  template?: BedframeTemplate
}

export function isObj(
  value: Record<string, any> | boolean | undefined
): boolean {
  return value === Object(value)
}

export function TemplateInfo(): JSX.Element {
  const bedHead = {
    name: chrome.runtime.getManifest().name,
    version: chrome.runtime.getManifest().version,
    description: chrome.runtime.getManifest().description,
    icon: chrome.runtime.getManifest().action.default_icon[128],
  }

  console.log('Nice! you have bed head 🚀', bedHead)
  return (
    <div>
      <div>
        &gr;_
        <br />
        <br />
        B R O W S E R<br />
        E X T E N S I O N<br />
        D E V E L O P M E N T<br />
        F R A M E W O R K<br />
      </div>

      <div style={{ color: '#808080', letterSpacing: '0.5px' }}>
        You're officially in BED. Goodnight!
      </div>
    </div>
  )
}
