import { basename } from 'node:path'
import { cwd } from 'node:process'
import { Command } from 'commander'
import { dim } from 'kolorist'
import { bedframePrompts, makeBed, promptsIntro } from '../lib'

export const makeCommand = new Command('make')
makeCommand
  .description('make your B E D')
  .argument('[name]', 'project name')

  // B R O W S E R
  .option(
    '-b, --browsers <browsers>',
    `comma-separated list browsers (${dim('chrome, edge, firefox, etc')})`,
  )

  // E X T E N S I O N
  .option('-v, --version <version>', `project version (${dim('0.0.1')})`)
  .option('-d, --description <description>', 'project description')
  .option(
    '-a, --author <author>',
    `project author  (${dim('name, email, url')})`,
  )
  .option('--license <license>', `project license (${dim('MIT')})`)
  .option('-r, --private', `visibility of project (${dim('true')})`)
  .option('-t, --type <type>', `extension type (${dim('popup')})`)
  .option('--override <override>', `page to override (${dim('newtab')})`)
  .option(
    '--options <options>',
    `whether to and how render options (${dim('embedded')})`,
  )

  // D E V E L O P M E N T
  .option(
    '-p, --packageManager <packageManager>',
    `package manager to use (${dim('pnpm')})`,
  )
  .option('-f, --framework <framework>', `framework to use (${dim('react')})`)
  .option('-l, --language <language>', `language to use (${dim('typescript')})`)
  .option('-s, --style <style>', `css framework to use (${dim('tailwind')})`)
  .option('-o, --lintFormat', `add linting with formatting (${dim('true')})`)
  .option(
    '-e, --tests',
    `add tests (vitest + testing library) (${dim('true')})`,
  )
  .option('-g, --git', `initialize git for source control (${dim('true')})`)
  .option('-h, --gitHooks', `use git hooks (${dim('true')})`)
  .option('-c, --commitLint', `use commit linting (${dim('true')})`)
  .option('-x, --changesets', `use changesets (${dim('true')})`)
  .option('-i, --installDeps', `install dependencies (${dim('true')})`)
  .option(
    '-y, --yes',
    `make your BED w/ preconfigured defaults (${dim('false')})`,
  )

  .action((name, options) => {
    let updatedName = name
    if (options) {
      promptsIntro()
    }
    if (name === '.') {
      updatedName = {
        name: basename(cwd()),
        path: cwd(),
      }
    }
    const projectName = updatedName ? updatedName : undefined
    bedframePrompts(projectName, options).then(async (response) => {
      await makeBed(response).catch(console.error)
    })
  })
