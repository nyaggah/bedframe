import type {
  Browser,
  BrowserEnum,
  Framework,
  Language,
  Manifest,
  PackageManager,
  Style,
} from './types'
import { AnyCase } from './utils'
import { BedframeTemplate } from './create-template'

export type Extension = {
  manifest: OneOrMoreManifests
}

export type OneOrMoreManifests =
  | Manifest
  | {
      [key in
        | keyof typeof BrowserEnum
        | keyof typeof BrowserEnum as Lowercase<key>]?: Manifest
    }

export type Development = {
  template: BedframeTemplate
}

/**
 * createBedframe()
 * @param bedframe config object
 */
export interface Bedframe {
  browser: AnyCase<Browser>[]
  extension: Extension
  development: Development
}
/**
 * Generate BEDframe object
 *
 * ```
 * type Bedframe = {
 *  browser: AnyCase<Browser>[]
 *  extension: Extension
 *  development: Development
 * }
 * ```
 *
 * @param {Bedframe} bedframe
 * @return {*}  {Bedframe}
 */
export const createBedframe = (bedframe: Bedframe): Bedframe => {
  return bedframe
}

enum Pages {
  DEV_TOOLS = 'devtools',
  NEW_TAB = 'new tab',
  OPTIONS = 'options',
}

type BrowserConfig = {
  name: Browser
  config?: {
    minimumVersion?: string | undefined
  }
}

type Project = {
  id: string // uuid
  name: string
  version: string
  summary: string
}

type bedframeConfig = {
  browser: BrowserConfig[]
  extension: {
    manifest: {
      name: string
      version: string
      // manifest_version: 2 | 3,
    }
    display: {
      as: 'popup' | 'overlay' | 'sidebar' | 'devtools' // <--- type this!
      position: ''
    }
    pages: {
      // Pages
      options: {
        display: 'full page' | 'embedded'
      }
      devTools: {
        page: {
          panel: ''
          sidebar: ''
        }
      }
    }
  }
  development: {
    project: Project
    template: {
      config: {
        framework: Framework
        language: Language
        packageManager: PackageManager
        style: Style
        lintFormat: boolean
        tests: boolean
        // git: boolean | { repo, branch }
        git: {
          repo: string
          branch: string
        }
        // gitHooks: boolean | { hook: boolean }
        gitHooks: {
          // initial suggested
          preCommit: boolean // run first, before you even type in a commit message. It’s used to inspect the snapshot that’s about to be committed, to see if you’ve forgotten something, to make sure tests run, or to examine whatever you need to inspect in the code
          prepareCommitMsg: boolean // hook is run before the commit message editor is fired up but after the default message is created. It lets you edit the default message before the commit author sees it.
          commitMsg: boolean
          // add more as needed
          postCommit: boolean //
        }
        commitLint: boolean
        changesets: boolean
      }
    }
  }
}

type ProjectListing = Project & {
  description: string
}
