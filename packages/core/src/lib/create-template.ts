import type { FontFamily } from './get-fonts'
import type { Framework, Language, PackageManager, Style } from './types'
import type { AnyCase } from './utils'

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
  style: Partial<{
    framework: AnyCase<Style>
    components?: string | Record<string, any>
    fonts: FontFamily[]
    theme?: string | Record<string, any>
  }>
  lintFormat?: Record<string, any> | boolean
  tests?: any
  git?: Record<string, any> | boolean
  gitHooks?: Record<string, any> | boolean
  commitLint?: Record<string, any> | boolean
  changesets?: Record<string, any> | boolean
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
