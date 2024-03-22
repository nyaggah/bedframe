import type { AnyCase, Browser } from '@bedframe/core'
import { Command } from 'commander'
import fs from 'node:fs'
import { join, resolve } from 'node:path'
import { executeBuildScript } from './build'

export const buildCommand = new Command('build')
  .command('build')
  .description('generate prod builds for 1 or more browsers concurrently')
  .arguments('[browsers]')
  .action(async (browser) => {
    const manifestsDir: string = resolve(
      join(process.cwd(), 'src', 'manifests'),
    )

    console.log('\n=========================\n')
    console.log(`\n===  ${manifestsDir}  ===\n`)
    console.log('\n=========================\n')

    function filterFiles(file: string): boolean {
      return (
        (file.endsWith('.ts') || file.endsWith('.tsx')) &&
        file !== 'base.manifest.ts'
      )
    }

    function extractBrowserName(file: string): string {
      return file.replace('.ts', '')
    }

    function findBrowserArray() {
      try {
        const files: string[] = fs.readdirSync(manifestsDir)
        const browserArray = files.filter(filterFiles).map(extractBrowserName)
        return browserArray as AnyCase<Browser>[]
      } catch (error) {
        console.error('Error occurred while reading directory:', error)
        return []
      }
    }

    const browserArray = findBrowserArray()

    console.log('\n=========================\n')
    console.log(`\n===  ${browserArray}  ===\n`)
    console.log('\n=========================\n')

    !browser ? executeBuildScript(browserArray) : executeBuildScript(browser)
  })
