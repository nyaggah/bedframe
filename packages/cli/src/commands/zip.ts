import { AnyCase, Browser } from '@bedframe/core'
import { Command } from 'commander'
import { execa } from 'execa'
import { dim, lightGreen, lightMagenta } from 'kolorist'
// import { execSync } from 'node:child_process'
import fs from 'node:fs'
import path, { join, resolve } from 'node:path'
import { cwd } from 'node:process'

// const browserList = ['chrome', 'brave', 'opera', 'edge', 'firefox', 'safari']
// ^^^ TO diddly DO: pull this from bedframe.config > browser

/**
 * drop into the dist dir for the browser you want to zip
 * and generate the zip in the dist
 *
 * @param {*} browser
 * @param {*} options
 */
function executeZipCommand(browser: any, options: any): void {
  console.log({ browser, options })

  const sourceDir = options.outDir
    ? options.outDir
    : resolve(join(process.cwd(), 'dist', browser.toLowerCase()))

  const zipName = options.name
    ? options.name
    : `${process.env.npm_package_name}@${
        process.env.npm_package_version
      }-${browser.toLowerCase()}.zip`

  const distDir = options.distDir
    ? options.distDir
    : resolve(join(process.cwd(), 'dist'))

  const zipPath = join(distDir, zipName)

  const command = `cd ${sourceDir} && zip -r ../${zipName} ./`

  execa(command, { shell: true, stdio: 'inherit' })
    .then(() => {
      console.log(
        `successfully zipped ${lightMagenta(
          sourceDir,
        )} directory to ${lightGreen(zipPath)}`,
      )
    })
    .catch((error) => {
      console.error('an error occurred while running commands:', error)
    })
}

export const zipCommand = new Command('zip')
zipCommand
  .description('zip browser dist directories')
  .argument('[browsers]', 'list of browser names')
  .option(
    '-s, --sourceDir <sourceDir>',
    'dist dir to create archive from (e.g. -s ./dist/<browser>)',
  )
  .option(
    '-d, --distDir <distDir>',
    'directory to generate the zip into (default: ./dist)',
  )
  .option('-n, --name <name>', 'what to name the zip file (including .zip)')
  .action(async (browsers: any, options: any) => {
    console.log({ browsers })
    try {
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
          console.error(`manifests array not found in the file
${dim(`looking in src/manifests/index.ts for an array like this:
  const manifests = [chrome, brave, opera, edge, firefox, safari]
`)}`)
          // TO diddly DO: include helpful message... solutions
          // e.g. do you have file in expected location? etc.
          return
        }

        if (!browsers) {
          const manifestsArrayText = data
            .substring(searchIndex.start, searchIndex.end + 1)
            .toLowerCase()

          const allBrowsers = manifestsArrayText
            .slice(1, -1)
            .split(', ') as AnyCase<Browser>[]

          allBrowsers.map((browser: AnyCase<Browser>) => {
            const browserName = browser.trim().toLowerCase()
            executeZipCommand(browserName, options)
          })
        }

        if (browsers && !Array.isArray(browsers) && browsers.length > 1) {
          // if e.g. command is `bedframe build safari,edge,firefox`
          // then 'browser' will be 'safari,edge,firefox' as Browser[]
          browsers = browsers
            .split(',')
            .map((browser: AnyCase<Browser>) => browser.trim().toLowerCase())
          browsers.map((browser: AnyCase<Browser>) => {
            const browserName = browser.trim().toLowerCase()
            executeZipCommand(browserName, options)
          })
        }
      })
    } catch (error) {
      console.error('error occurred while zipping the dist:', error)
      process.exit(1)
    }
  })