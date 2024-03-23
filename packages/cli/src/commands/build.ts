import type { AnyCase, Browser } from '@bedframe/core'
import { Command } from 'commander'
import { execa } from 'execa'
import { dim, lightGreen, magenta } from 'kolorist'
import { getBrowserArray } from '../lib/get-browser-array'

/**
 * executes command to start vite production build process for 1, more or all browsers
 * the command will start all processes concurrently but group the output sequentially
 *
 * @param {AnyCase<Browser>[]} [browsers=[]]
 * @return {*}  {Promise<void>}
 */
export async function executeBuildScript(
  browsers: AnyCase<Browser>[],
): Promise<void> {
  const browserColors = ['magenta', 'green', 'cyan', 'yellow', 'red', 'blue']
  const colorMap: Record<string, string> = {}

  browsers.map((browserName, index) => {
    colorMap[browserName] = browserColors[index % browserColors.length]
  })

  const colors = browsers.map((browser) => colorMap[browser])
  const names = browsers.join(',')

  const command =
    browsers.length === 1
      ? `vite build --mode ${browsers[0].toLowerCase()} `
      : `concurrently --group --names \"${names}\" -c \"${colors.join(
          ',',
        )}\" ${browsers
          .sort((a, b) => a.localeCompare(b))
          .map((name) => `\"vite build --mode ${name}\"`)
          .join(' ')}`

  console.log(dim('command [prod]:'), `${lightGreen(command)}\n`)

  execa(command, { shell: true, stdio: 'inherit' })
    .then(() => {
      const browsersLength = browsers.length - 1
      console.log(`
${lightGreen(
  `${magenta(browsers.length)} ${
    browsers.length > 1 ? 'BEDs' : 'BED'
  } made! 🚀`,
)}
${dim('└')} dist${dim('/')}${browsers
        .sort((a, b) => a.localeCompare(b))
        .map(
          (browser, i) => `
  ${dim(`${browsersLength === i ? '└' : '├'}`)} ${browser}${dim('/')}`,
        )
        .join('')}
  `)
    })
    .catch((error) => {
      console.error('an error occurred while running commands:', error)
    })
}

export const buildCommand = new Command('build')
  .command('build')
  .description('generate prod builds for 1 or more browsers concurrently')
  .arguments('[browsers]')
  .action(async (browser) => {
    const browserArray = getBrowserArray()
    let cliBrowsers: AnyCase<Browser>[] = []
    if (!browser) {
      cliBrowsers = browserArray
    } else {
      cliBrowsers = Array.isArray(browser) ? browser : browser.split(',')
    }

    browser ? executeBuildScript(cliBrowsers) : executeBuildScript(browserArray)
  })
