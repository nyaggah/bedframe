import { FontFamily } from './get-fonts'
import { Framework, Language, PackageManager, Style } from './types'
import { AnyCase } from './utils'
/**
 *
 *
 * @export
 * @interface TemplateConfig
 */
export interface TemplateConfig {
  framework: Lowercase<Framework> | Capitalize<Framework>
  language: Lowercase<Language> | Capitalize<Language>
  packageManager: AnyCase<PackageManager>
  style: {
    framework: AnyCase<Style>
    components?: string | Record<string, any>
    fonts?: FontFamily[]
    theme?: string | Record<string, any>
  }
  lintFormat: Record<string, any> | boolean
  tests: Record<string, any> | boolean // | VitestInlineConfig
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
const createTemplate = (template: BedframeTemplate): BedframeTemplate =>
  template
