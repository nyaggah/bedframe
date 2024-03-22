import type { AnyCase, Browser } from '@bedframe/core'
import fs from 'node:fs'
import { join, resolve } from 'node:path'

export function getBrowserArray(): AnyCase<Browser>[] {
  const manifestsDir: string = resolve(join(process.cwd(), 'src', 'manifests'))

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

  return browserArray
}
