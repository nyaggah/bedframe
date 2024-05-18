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
  yes?: boolean
}

// biome-ignore lint:  @typescript-eslint/no-explicit-any
export type PromptsResponse = Record<string, any>
