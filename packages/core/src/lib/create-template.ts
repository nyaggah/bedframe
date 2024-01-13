import vitest from 'vitest'
import { AnyCase } from './utils'
import { FontFamily } from './get-fonts'
import { Framework, Language, PackageManager, Style } from './types'
/**
 *
 *
 * @export
 * @interface TemplateConfig
 */
export interface TemplateConfig {
  framework: AnyCase<Framework>
  language: AnyCase<Language>
  packageManager: AnyCase<PackageManager>
  style: {
    framework: AnyCase<Style>
    components?: string | Record<string, any>
    fonts?: FontFamily[]
    theme?: string | Record<string, any>
  }
  lintFormat: Record<string, any> | boolean
  /*
  ^^^ default to @biomejs for lint/format
    "format": "pnpm dlx @biomejs/biome format . --write",
    "lint": "pnpm dlx @biomejs/biome lint .",
    "lint:format": "pnpm dlx @biomejs/biome check --apply ."
    
    optionally, use eslint + prettier
    
  */
  tests: vitest.InlineConfig | boolean // Record<string, any> | boolean
  git: Record<string, any> | boolean
  gitHooks: Record<string, any> | boolean
  commitLint: Record<string, any> | boolean
  changesets: Record<string, any> | boolean
}

/**
 *
 *
 * @export
 * @interface BedframeTemplate
 */
export interface BedframeTemplate {
  name?: string
  version?: string
  description?: string
  config: TemplateConfig
}
/**
 *
 *
 * @param {BedframeTemplate} template
 * @return {*}  {@link BedframeTemplate}
 */
export const createTemplate = (template: BedframeTemplate): BedframeTemplate =>
  template
