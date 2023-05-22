import { PromptType, Falsy, PrevCaller } from 'prompts'

export type BrowserPrompts = {
  browsers: string
}

export type ExtensionPrompts = {
  name: string
  version: string
  description?: string
  author?: string
  license?: string
  private?: boolean
  override?: string
  options?: string
  pages?: string
  type: string
  sidebar?: string
  none?: string
  position?: string
  // type?: string
  // type?: PromptType | Falsy | PrevCaller<T, PromptType | Falsy>
}

export type DevelopmentPrompts = {
  packageManager: string
  framework: string
  language: string
  style: string
  lintFormat: string
  tests: string
  git: string
  gitHooks: string
  commitLint: string
  changesets: string
  installDeps: string
}

export type PromptsResponse = Record<string, any>
