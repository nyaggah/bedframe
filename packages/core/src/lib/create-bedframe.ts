import { BedframeTemplate } from './create-template'
import type { Browser, BuildTarget } from './types'
import { AnyCase } from './utils'

export type ExtensionType = 'popup' | 'overlay' | 'sidepanel' | 'devtools'
export type OverrideType = 'none' | 'newtab' | 'history' | 'bookmarks'
export type PositionType = 'center' | 'left' | 'right'
export type OptionsType = 'full-page' | 'embedded'

export type Extension = {
  type: ExtensionType
  overrides: OverrideType
  position?: PositionType
  options: OptionsType
  manifest: BuildTarget[]
  pages?: string | string[] | { [entryAlias: string]: string }
  // ^^^ type from rollup input: >> export type InputOption = string | string[] | { [entryAlias: string]: string };
}

export type Development = {
  template: BedframeTemplate
}

export interface Bedframe {
  browser: AnyCase<Browser>[]
  extension: Extension
  development: Development
}
/**
 * Generate Bedframe object
 * @param {Bedframe} bedframe
 * @return {*}  {Bedframe}
 */
export const createBedframe = (bedframe: Bedframe): Bedframe => {
  return bedframe
}
