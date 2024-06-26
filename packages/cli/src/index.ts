import { readFileSync } from 'node:fs'
import { Command } from 'commander'
import {
  buildCommand,
  devCommand,
  makeCommand,
  publishCommand,
  versionCommand,
  zipCommand,
} from './commands'
import { promptsIntro } from './lib'

const pkg = JSON.parse(
  readFileSync(new URL('../package.json', import.meta.url), 'utf8'),
)

const program = new Command()
program
  .name(pkg.name)
  .description(pkg.description)
  .version(`${pkg.name}@${pkg.version}`)
  .enablePositionalOptions()
  .passThroughOptions()
  .addHelpText('beforeAll', promptsIntro(pkg.name, pkg.version))

program
  .addCommand(makeCommand)
  .addCommand(versionCommand)
  .addCommand(publishCommand)

  .addCommand(devCommand)
  .addCommand(buildCommand)
  .addCommand(zipCommand)

export async function run() {
  try {
    await program.parseAsync(process.argv)
  } catch (error) {
    console.error(error)
  }
}

run()
