import {
  lightMagenta,
  lightGreen,
  lightCyan,
  lightYellow,
  dim,
  bold,
} from 'kolorist'
import { ManifestV3Export, crx } from '@crxjs/vite-plugin'
import { Browser, BuildConfig, BuildTarget } from './types'
import { PluginOption } from 'vite'

/**
 * Given the `Mode` i.e. `Browser` target, return the appropriate `Manifest` to build from
 * and pass it to {@link crx`}
 */
export function getManifest(
  { command, mode }: BuildConfig,
  targets: BuildTarget[]
): PluginOption[] {
  const _mode = `${(mode as string).charAt(0).toUpperCase()}${(
    mode as string
  ).slice(1)}`
  const isValidMode = [...Object.values(Browser)].includes(_mode)
  const isCommandDev = command === 'serve'
  const isCommandBuild = command === 'build'
  const isModeDevelop = isCommandBuild && mode === 'develop'
  // const isModeProduction = isCommandBuild && mode === 'production'

  if (targets.length > 0 && (isCommandDev || isCommandBuild) && !isValidMode) {
    const firstTarget = targets[0].browser.toLowerCase()
    mode = firstTarget
    console.warn(
      isValidMode
        ? `no or invalid 'mode' provided. assuming ${firstTarget}`
        : ''
    )
  }

  const browser = targets.find((t) => t.browser === mode)
  if (!browser) {
    throw new Error(
      `unknown mode: "${mode}". 'mode' is the browser you're building for. should be one of ${Object.values(
        Browser
      )
        .join(', ')
        .toLowerCase()}`
    )
  }

  if (isValidMode) {
    console.log(`
    ${bold(dim('>_'))}
      
      ${lightMagenta('B R O W S E R')}
      ${lightGreen('E X T E N S I O N')}
      ${lightCyan('D E V E L O P M E N T')}
      ${lightYellow('F R A M E W O R K')}

    🚀 [mode: ${
      isModeDevelop ? bold('dev') : bold('prod')
    }] building for ${mode}`)
  }

  return crx({
    manifest: browser.manifest as ManifestV3Export,
  })
}
