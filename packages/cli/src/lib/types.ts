import {
  AnyCase,
  Browser,
  Framework,
  Language,
  PackageManager,
  Style,
} from '@bedframe/core'

export type PromptsResponse = Record<string, any>

//   {
//   name: any // Record<'name' | 'path', any>
//   version: string
//   browsers: AnyCase<Browser>[]
//   packageManager: AnyCase<PackageManager>
//   framework: AnyCase<Framework>
//   language: AnyCase<Language>
//   style: AnyCase<Style>
//   lintFormat: Record<string, any> | boolean
//   gitHooks: Record<string, any> | boolean
//   tests: Record<string, any> | boolean
//   commitLint: Record<string, any> | boolean
//   changesets: Record<string, any> | boolean
//   installDeps: boolean
// }
