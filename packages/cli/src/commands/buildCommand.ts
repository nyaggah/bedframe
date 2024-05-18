import { Command } from 'commander'
import { getBrowserArray } from '../lib/get-browser-array'
import { executeBuildScript } from './build'

export const buildCommand = new Command('build')
  .command('build')
  .description('generate prod builds for 1 or more browsers concurrently')
  .argument('[browsers]', 'list of browser names')
  .action(async (browser) => {
    const browserArray = getBrowserArray()
    executeBuildScript(!browser ? browserArray : browser)
  })
