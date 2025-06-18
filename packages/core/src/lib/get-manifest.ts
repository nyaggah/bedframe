import { crx, type ManifestV3Export } from '@crxjs/vite-plugin'
import {
  bold,
  dim,
  lightCyan,
  lightGreen,
  lightMagenta,
  lightYellow,
} from 'kolorist'
import type { PluginOption } from 'vite'
import {
  Browser,
  type BuildConfig,
  type BuildOptions,
  type BuildTarget,
} from './types'

/**
 * Given the {@link Mode} i.e. {@link Browser} target,
 * return the appropriate Manifest (of undelying type)
 * {@link ManifestV3Export} to build from and
 * pass it to {@link crx}
 *
 * @export
 * @param {BuildConfig} { command, mode }
 * @param {BuildTarget[]} targets
 * @return {*}  {@link PluginOption[]}
 */
export function getManifest(
  { command, mode }: BuildConfig,
  targets: BuildTarget[],
  options?: BuildOptions,
): ReturnType<typeof crx> {
  const _mode = `${(mode as string).charAt(0).toUpperCase()}${(
    mode as string
  ).slice(1)}`
  const isValidMode = [...Object.values(Browser)].includes(_mode)
  const isCommandDev = command === 'serve'
  const isCommandBuild = command === 'build'
  const isModeDevelop = (isCommandDev && isValidMode) || mode === 'develop'

  if (targets.length > 0 && (isCommandDev || isCommandBuild) && !isValidMode) {
    const firstTarget = targets[0].browser.toLowerCase()
    mode = firstTarget
    console.warn(
      isValidMode
        ? `no or invalid 'mode' provided. assuming ${firstTarget}`
        : '',
    )
  }

  const browser = targets.find((t) => t.browser === mode)
  if (!browser) {
    throw new Error(
      `unknown mode "${mode}". 'mode' is the browser you're building for. should be one of ${Object.values(
        Browser,
      )
        .join(', ')
        .toLowerCase()}`,
    )
  }

  if (isValidMode) {
    console.log(`${bold(dim('>_'))}
    
  ${lightMagenta('B R O W S E R')}
  ${lightGreen('E X T E N S I O N')}
  ${lightCyan('D E V E L O P M E N T')}
  ${lightYellow('F R A M E W O R K')}

[mode: ${
      isModeDevelop ? bold('dev') : bold('prod')
    }] building for ${mode} 🚀\n`)
  }

  return crx({
    manifest: browser.manifest as ManifestV3Export,
    ...options,
  })
}
