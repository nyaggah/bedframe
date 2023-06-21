import {
  lightMagenta,
  lightGreen,
  lightCyan,
  lightYellow,
  dim,
  bold,
} from 'kolorist'
import { ManifestV3Export } from '@crxjs/vite-plugin'
import { Browser, BuildTarget } from './types'

/**
 * Given the `Mode` i.e. `Browser` target, return the appropriate `Manifest` to build from
 *
 */
// TO diddly DO: update w/ https://chat.openai.com/c/c99d5aea-7e48-4687-a0f2-e7dbc57f6758
export function getManifest(
  config: {
    mode: unknown
    command?: 'build' | 'serve' // TO diddly DO: definitely type
  },
  targets: BuildTarget[]
): ManifestV3Export {
  /*
  // if no --mode passed in:
  // bedframe expects `mode` to be one of `Browser` from `@bedframe/core`
  // but mode can also be any of `UserConfigExport` from `Vite`
  // const noMode = config.mode === null // noValidBedframeMode i.e. not one of Browser
  - - -
  
  // node_modules/vite/dist/node/index.d.ts
  export declare interface ConfigEnv {
    command: 'build' | 'serve';
    mode: string;

    ssrBuild?: boolean; // <-- experimental /
}
  */
  const _mode = `${(config.mode as string).charAt(0).toUpperCase()}${(
    config.mode as string
  ).slice(1)}`
  const isValidMode = [...Object.values(Browser)].includes(_mode)
  // console.log('{mode, isValidMode}:', { _mode, isValidMode })

  const isCommandDev = config.command === 'serve'
  const isCommandBuild = config.command === 'build'

  const isModeDevelop = isCommandBuild && config.mode === 'develop'
  const isModeProduction = isCommandBuild && config.mode === 'production'

  // console.log('{ isModeDevelop, isModeProduction }:', { isModeDevelop, isModeProduction })

  /*
    TO diddly DO: handle non-bedframe `development/production` modes
    if no mode passed, assume Browser is first in `targets[0].browser`

  $ pnpm dev # no --mode (default)
    isModeDevelop: { command: 'serve', mode: 'development' }
    _mode === 'Development'
  
  $ pnpm dev:all
    { command, mode } : { command: 'serve', mode: 'chrome' }
    { command, mode } : { command: 'serve', mode: 'opera' }
    { command, mode } : { command: 'serve', mode: 'brave' }
    { command, mode } : { command: 'serve', mode: 'edge' }
  
  - - -

  $ pnpm build # no --mode (default)
    isModeProduction: { command: 'build', mode: 'production' }
    _mode === Production
  
  $ pnpm build:all
    { command, mode } : { command: 'build', mode: 'chrome' }
    { command, mode } : { command: 'build', mode: 'opera' }
    { command, mode } : { command: 'build', mode: 'brave' }
    { command, mode } : { command: 'build', mode: 'edge' }
  
  */

  if (targets.length > 0 && (isCommandDev || isCommandBuild) && !isValidMode) {
    const firstTarget = targets[0].browser.toLowerCase()
    config.mode = firstTarget
    console.warn(
      isValidMode
        ? `no or invalid 'mode' provided. assuming ${firstTarget}`
        : ''
    )
  }

  const browser = targets.find((t) => t.browser === config.mode)
  if (!browser) {
    throw new Error(
      `unknown mode: "${
        config.mode
      }". 'mode' is the browser you're building for. should be one of ${Object.values(
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

  🚀 [mode: ${isModeDevelop ? bold('dev') : bold('prod')}] building for ${
      config.mode
    }`)
  }

  // const crx = crx({
  //   manifest: getManifest({ command, mode }, manifests),
  // }),

  return browser.manifest as ManifestV3Export
}
