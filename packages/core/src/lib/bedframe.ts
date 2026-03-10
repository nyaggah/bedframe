import { crx, type ManifestV3Export } from '@crxjs/vite-plugin'
import {
  bold,
  dim,
  lightCyan,
  lightGreen,
  lightMagenta,
  lightYellow,
} from 'kolorist'
import { Browser, type BuildOptions, type BuildTarget, type Manifest } from './types'

function resolveTarget(
  mode: string,
  command: string,
  targets: BuildTarget[],
  skipLog = false,
): { browser: BuildTarget; resolvedMode: string; isModeDevelop: boolean } {
  const _mode = `${mode.charAt(0).toUpperCase()}${mode.slice(1)}`
  const isValidMode = Object.values(Browser).includes(_mode)
  const isCommandDev = command === 'serve'
  const isCommandBuild = command === 'build'
  const isModeDevelop = (isCommandDev && isValidMode) || mode === 'develop'

  let resolvedMode = mode

  if (targets.length > 0 && (isCommandDev || isCommandBuild) && !isValidMode) {
    const firstTarget = targets[0].browser.toLowerCase()
    resolvedMode = firstTarget
    console.warn(
      `[bedframe] No or invalid mode provided. Falling back to "${firstTarget}".`,
    )
  }

  const browser = targets.find((t) => t.browser === resolvedMode)
  if (!browser) {
    throw new Error(
      `[bedframe] Unknown mode "${resolvedMode}". Mode is the browser you're building for. Should be one of ${Object.values(
        Browser,
      )
        .join(', ')
        .toLowerCase()}`,
    )
  }

  if (isValidMode && !skipLog) {
    console.log(`${bold(dim('>_'))}
    
  ${lightMagenta('B R O W S E R')}
  ${lightGreen('E X T E N S I O N')}
  ${lightCyan('D E V E L O P M E N T')}
  ${lightYellow('F R A M E W O R K')}

[mode: ${isModeDevelop ? bold('dev') : bold('prod')}] building for ${resolvedMode} 🚀\n`)
  }

  return { browser, resolvedMode, isModeDevelop }
}

/**
 * Bedframe — the main entrypoint for multi-browser extension builds.
 * Resolves the correct manifest for the current Vite `mode`
 * (i.e. the target browser) and configures `@crxjs/vite-plugin`.
 *
 * Uses CRX's dynamic manifest support — passes a function that
 * receives `{ command, mode }` from Vite's config lifecycle,
 * so the user doesn't need to thread those values manually.
 */
export function bedframe(
  targets: BuildTarget[],
  options?: BuildOptions,
): ReturnType<typeof crx> {
  let logged = false

  return crx({
    manifest: ((env: { command: string; mode: string }) => {
      const { command, mode } = env
      const { browser } = resolveTarget(mode, command, targets, logged)
      logged = true
      return browser.manifest as Manifest
    }) as ManifestV3Export,
    ...options,
  })
}
