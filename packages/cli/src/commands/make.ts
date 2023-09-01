import { Command } from 'commander'
import { basename } from 'node:path'
import { cwd } from 'node:process'
import { bedframePrompts, makeBed, promptsIntro } from '../lib'
import { dim } from 'kolorist'

export const makeCommand = new Command('make')
makeCommand
  .description('make your B E D')
  .argument('[name]', 'project name')

  // B R O W S E R
  .option(
    '-b, --browsers <browsers>',
    `specify comma-separated list browsers (${dim('chrome, edge, firefox')})`,
  )

  // E X T E N S I O N
  .option(
    '-v, --version <version>',
    `specify project version (${dim('0.0.1')})`,
  )
  .option('-d, --description <description>', 'specify project description')
  .option(
    '-a, --author <author>',
    `specify project author  (${dim('name, email, url')})`,
  )
  .option('--license <license>', `specify project license (${dim('MIT')})`)
  .option('-p, --private', `specify visibility of project (${dim('true')})`)
  .option('-t, --type <type>', `specify extension type (${dim('popup')})`)
  .option(
    '--position <position>',
    `specify overlay extension position (${dim('center')})`,
  )
  .option(
    '--override <override>',
    `specify page to override (${dim('newtab')})`,
  )
  .option(
    '--options <options>',
    `specify whether to and how render options (${dim('embedded')})`,
  )

  // D E V E L O P M E N T
  .option(
    '-p, --packageManager <packageManager>',
    `Specify package manager to use (${dim('pnpm')})`,
  )
  .option(
    '-f, --framework/lib <framework>',
    `specify framework to use (${dim('react')})`,
  )
  .option(
    '-l, --language <language>',
    `specify language to use (${dim('typescript')})`,
  )
  .option(
    '-s, --style <style>',
    `specify CSS framework to use (${dim('tailwind')})`,
  )
  .option('-o, --lintFormat', `add linting with formatting (${dim('true')})`)
  .option(
    '-t, --tests',
    `add tests (vitest + testing library) (${dim('true')})`,
  )
  .option('-g, --git', `initialize git for source control (${dim('true')})`)
  .option('-h, --gitHooks', `add git hooks (${dim('true')})`)
  .option('-c, --commitLint', `add commit linting (${dim('true')})`)
  .option('-x, --changesets', `add changesets (${dim('true')})`)
  .option('-i, --installDeps', `add & install dependencies (${dim('true')})`)
  .option(
    '-y, --yes',
    `make your BED w/ preconfigured defaults (${dim('false')})`,
  )

  .action((name, options) => {
    if (options) {
      promptsIntro()
    }
    if (name === '.') {
      name = {
        name: basename(cwd()),
        path: cwd(),
      }
      // ^^^ TO diddly DO: don't we already have a formatProjectName func ??
      // use that else... its off to 🍝-ville!
    }
    const projectName = name ? name : undefined
    bedframePrompts(projectName, options).then(async (response) => {
      await makeBed(response).catch(console.error)
    })
  })
