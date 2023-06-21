import { /* program,*/ Command } from 'commander'
import { cwd } from 'node:process'
import { basename } from 'node:path'
import { promptsIntro, bedframePrompts, makeBed } from './lib'
import { readFileSync } from 'node:fs'
import {
  bold,
  dim,
  lightCyan,
  lightGreen,
  lightMagenta,
  lightYellow,
} from 'kolorist'

const pkg = JSON.parse(
  readFileSync(new URL('../package.json', import.meta.url), 'utf8')
)

// let standalone = false
// const bedframe = new Command()
// const progOrCommand = standalone ? program : bedframe

let showIntro = true

// program
const bedframe = new Command()
bedframe
  .name(pkg.name)
  .description(pkg.description)
  .version(`v${pkg.version}`)

  .addHelpText(
    'beforeAll',
    `
  ${bold(dim('>_'))}
  
    ${bold(lightMagenta('B '))}${lightMagenta('R O W S E R')} 
    ${lightGreen('E X T E N S I O N')} 
    ${lightCyan('D E V E L O P M E N T')}
    ${lightYellow('F R A M E W O R K')}
  `
  )

  // Command: Make
  .enablePositionalOptions(true)
  .command('make')
  .description('make your B E D')

  // Name, desc,
  .argument('[name]', 'project name')
  // .usage(`[name] [options]`)
  // .allowExcessArguments(false)
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
    if (options) {
      showIntro = false
    }
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

export async function run() {
  try {
    if (showIntro) {
      promptsIntro()
    }
    await bedframe.parseAsync(process.argv)
  } catch (error) {
    console.error(error)
  }
}

export { promptsIntro, bedframePrompts, makeBed }

run()
