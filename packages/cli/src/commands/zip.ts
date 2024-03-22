import type { AnyCase, Browser } from '@bedframe/core'
import { Command } from 'commander'
import { execa } from 'execa'
import { dim, lightCyan, lightGreen, lightMagenta, lightYellow } from 'kolorist'
import { readFileSync } from 'node:fs'
import { basename, join, resolve } from 'node:path'
import { cwd } from 'node:process'
import { getBrowserArray } from '../lib/get-browser-array'

/**
 * drop into the dist dir for the browser you want to zip
 * and generate the zip in the dist
 *
 * @param {*} browser
 * @param {*} options
 */
function executeZipCommand(browser: any, options: any): void {
  const pkg = JSON.parse(readFileSync(join(cwd(), 'package.json'), 'utf8'))

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
      console.log(`• successfully zipped ${lightGreen(basename(sourceDir))} 🚀
└ • browser: ${dim('./dist/')}${lightMagenta(
        `${process.env.PACKAGE_NAME ?? pkg?.name}`,
      )}
  • archive: ${dim('./dist/')}${lightYellow(`${basename(zipPath)}`)}
  • version: ${lightCyan(`${process.env.PACKAGE_VERSION ?? pkg?.version}`)}
  • date/time: ${lightCyan(new Date().toLocaleString().replace(',', ''))}
        `)
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
  .action(async (browsers, options) => {
    if (!browsers) {
      const browserArray = getBrowserArray()
      browserArray.map((browser: AnyCase<Browser>) => {
        const browserName = browser.trim().toLowerCase()
        executeZipCommand(browserName, options)
      })
    } else {
      browsers
        .split(',')
        .map((browser: AnyCase<Browser>) => browser.trim().toLowerCase())
        .map((browser: AnyCase<Browser>) => {
          const browserName = browser.trim().toLowerCase()
          executeZipCommand(browserName, options)
        })
    }
  })
