import { AnyCase, Browser } from '@bedframe/core'
import { Command } from 'commander'
import { execa } from 'execa'
import { dim, lightGreen, magenta } from 'kolorist'
import fs from 'node:fs'
import { join } from 'node:path'
import { cwd } from 'node:process'

/**
 * executes command to start vite development server for 1, more or all browsers
 * the command will start all processes concurrently but group the output sequentially
 *
 * @param {AnyCase<Browser>[]} [browsers=[]]
 * @return {*}  {Promise<void>}
 */
async function executeDevScript(
  browsers: AnyCase<Browser>[] = [], // maybe default to `getBrowserList() ?? allBrowsers` here ??
): Promise<void> {
  const browserColors = ['magenta', 'green', 'cyan', 'yellow', 'red', 'blue']
  // TO diddly DO: ^^^ we have color/ browser helper functions in @bedframe/core... use that

  const colorMap: Record<string, string> = {}
  browsers.map((browserName, index) => {
    colorMap[browserName] = browserColors[index % browserColors.length]
  })

  const colors = browsers.map((browser) => colorMap[browser])
  const names = browsers.join(',')

  const command =
    browsers.length === 1
      ? `vite --mode ${browsers[0].toLowerCase()}`
      : `concurrently --group --names \"${names}\" -c \"${colors.join(
          ',',
        )}\" ${browsers
          .sort((a, b) => a.localeCompare(b))
          .map((name) => `\"vite --mode ${name}\"`)
          .join('')}`

  console.log(dim('command [dev]:'), lightGreen(command) + '\n')
  if (browsers.length > 1) {
    console.log(
      dim(`
N O T E :

bedframe dev -
  this command is slightly buggy when concurrently starting multiple vite dev servers.
  fixing soon... https://www.youtube.com/watch?v=kSLbb1WxcOQ 
  you will see output for the first of your comma,separate,list,of,browsers.
  it still works-ish but the output is a bit deceiving (W I P)
  - - - 
  soln: open different terminals: pnpm dev chrome | pnpm dev firefox | etc...
  \n`),
    )
  }
  const browsersLength = browsers.length - 1
  console.log(`${lightGreen(
    `${magenta(browsers.length)} ${
      browsers.length > 1 ? 'BEDs' : 'BED'
    } starting vite dev server! 🚀`,
  )}
${dim('└')} dist${dim('/')}${browsers
    .map(
      (browser, i) => `
  ${dim(`${browsersLength === i ? '└' : '├'}`)} ${browser}${dim('/')}`,
    )
    .join('')}
`)

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

export const devCommand = new Command('dev')
  .command('dev')
  .description('start Vite dev server for one or more browsers concurrently')
  .arguments('[browsers]')
  .action(async (browser) => {
    const manifestsIndex = join(cwd(), 'src', 'manifests', 'index.ts')
    fs.readFile(manifestsIndex, 'utf-8', (err, data) => {
      if (err) {
        console.error('error reading the file:', err)
        return
      }

      const searchIndex = {
        start: data.indexOf('['),
        end: data.indexOf(']'),
      }
      // ^^ search for this ---> [chrome, brave, opera, edge, firefox, safari]

      if (
        searchIndex.start === -1 ||
        searchIndex.end === -1 ||
        searchIndex.end <= searchIndex.start
      ) {
        console.error('manifests array not found in the file.')
        // TO diddly DO: include helpful message... solutions
        // e.g. do you have file in expected location? etc.
        return
      }

      if (browser && !Array.isArray(browser) && browser.length > 1) {
        // if e.g. command is `bedframe dev safari,edge,firefox`
        // then 'browser' will be 'safari,edge,firefox' as Browser[]
        browser = browser
          .split(',')
          .map((browser: AnyCase<Browser>) => browser.trim().toLowerCase())
      }

      const manifestsArrayText = data
        .substring(searchIndex.start, searchIndex.end + 1)
        .toLowerCase()

      const _array = manifestsArrayText
        .trim()
        .slice(1, -1)
        .split(',') as AnyCase<Browser>[]

      const browserArray = _array.map((browser: AnyCase<Browser>) =>
        browser.trim().toLowerCase(),
      ) as AnyCase<Browser>[]

      !browser ? executeDevScript(browserArray) : executeDevScript(browser)
    })
  })
