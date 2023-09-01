import { Command } from 'commander'
import path from 'node:path'
import { cwd } from 'node:process'
import { modifyFeaturesForFirefox, modifyManifestForFirefox } from '../lib'
import { dim } from 'kolorist'

// try for ./src/_config/bedframe.config.ts
// get manifest > browser(s)... use default all
export const codeModCommand = new Command('codemod')
  .argument('<browser>', 'browser name')
  .description(
    'perform after-build manifest and features code mods (🍝) by browser',
  )
  .option('--manifest', 'perform manifest.json codemods', true)
  .option('--features', 'perform in-code features codemods', true)
  .action(async (browser: string, options: any) => {
    if (
      !browser ||
      !['chrome', 'brave', 'opera', 'edge', 'firefox', 'safari'].includes(
        browser,
      )
    ) {
      console.error(
        "Please provide a valid browser argument: 'chrome' | 'brave' | 'opera' | 'edge' | 'firefox' | 'safari'",
      )
      process.exit(1)
    }

    const distDir = path.join(cwd(), 'dist', browser)

    if (options.manifest) {
      if (browser === 'firefox') {
        modifyManifestForFirefox(distDir, browser)
      } else if (browser === 'chrome') {
        // modifyManifestForChrome(distDir, browser)
        console.log(dim('no codemods for chrome'))
      } else if (browser === 'brave') {
        // modifyManifestForBrave(distDir, browser)
        console.log(dim('no codemods  for brave'))
      } else if (browser === 'opera') {
        // modifyManifestForOpera(distDir, browser)
        console.log(dim('no codemods  for opera'))
      } else if (browser === 'edge') {
        // modifyManifestForEdge(distDir, browser)
        console.log(dim('no codemods  for edge'))
      } else if (browser === 'safari') {
        // modifyManifestForSafari(distDir, browser)
        console.log(dim('no codemods for safari'))
      } else {
        console.error(`unsupported browser: ${browser}`)
        process.exit(1)
      }
      // TO diddly DO: un-spaghetti-fy this my boi!
    }

    if (options.features) {
      if (browser === 'firefox') {
        modifyFeaturesForFirefox(distDir, browser)
      } else if (browser === 'chrome') {
        // modifyFeaturesForChrome(distDir, browser)
      } else if (browser === 'brave') {
        // modifyFeaturesForBrave(distDir, browser)
      } else if (browser === 'opera') {
        // modifyFeaturesForOpera(distDir, browser)
      } else if (browser === 'edge') {
        // modifyFeaturesForEdge(distDir, browser)
      } else if (browser === 'safari') {
        // modifyFeaturesForSafari(distDir, browser)
      } else {
        console.error(`unsupported browser: ${browser}`)
        process.exit(1)
      }
    }
  })
/*
interface CodeMod {
  browser: AnyCase<Browser> | AnyCase<Browser>[]
  options: {
    distDir: string
    manifest boolean
    features: boolean
  }
}
codeMod(browser, options)

*/
