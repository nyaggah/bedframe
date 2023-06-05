import { Command } from 'commander'
import { cwd } from 'node:process'
import { basename } from 'node:path'
import { promptsIntro, bedframePrompts, makeBed } from './lib'

promptsIntro()
const make = new Command()
make
  // Name, desc,
  .command('make')
  .argument('[name]')
  .usage(`[name] [options]`)
  .description('make your B E D')
  .allowExcessArguments(false)
  // .enablePositionalOptions(true)
  // .passThroughOptions(true)
  // Options
  .option('-v, --version <version>', 'Specify project version', '0.0.1')
  .option(
    '-b, --browsers <browsers>',
    'Specify comma-separated list of target browsers',
    'Chrome'
  )
  .option(
    '-p, --packageManager <packageManager>',
    'Specify package manager to use',
    'Yarn'
  )
  .option('-f, --framework <framework>', 'Specify framework to use', 'React')
  .option('-l, --language <language>', 'Specify language to use', 'TypeScript')
  .option('-s, --style <style>', 'Specify CSS framework to use', 'Tailwind')
  .option('-o, --lintFormat', 'Add linting with formatting', true)
  .option('-g, --git', 'Initialize git source control', true)
  .option('-h, --gitHooks', 'Add git hooks', true)
  .option('-t, --tests', 'Add tests (Vitest + Testing Library)', true)
  .option('-c, --commitLint', 'Add commit linting', true)
  .option('-x, --changesets', 'Add changesets', true)
  .option('-i, --installDeps', 'Add & install dependencies', true)
  .option('-y, --yes', 'Set up Bedframe preconfigured defaults', false)
  .action((name, options) => {
    if (name === '.') {
      name = {
        name: basename(cwd()),
        path: cwd(),
      }
    }
    if (
      !name ||
      !options.name ||
      !options.version ||
      !options.browsers ||
      !options.packageManager ||
      !options.framework ||
      !options.language ||
      !options.style
    ) {
      const _name = name ? name : undefined
      bedframePrompts(_name).then(async (response) => {
        await makeBed(response).catch(console.error)
      })
    }
  })

export async function run(): Promise<void> {
  try {
    await make.parseAsync(process.argv)
  } catch (error) {
    console.error(error)
  }
}

run()
