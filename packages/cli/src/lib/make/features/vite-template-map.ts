import { resolveScaffoldSpec } from './scaffold-spec'
import type { ScaffoldSpec } from './scaffold-spec'
import type { PromptsResponse } from '../prompts'

const VITE_TEMPLATE_MAP: Record<string, string> = {
  'vanilla:javascript': 'vanilla',
  'vanilla:typescript': 'vanilla-ts',
  'vue:javascript': 'vue',
  'vue:typescript': 'vue-ts',
  'react:javascript': 'react',
  'react:typescript': 'react-ts',
  'preact:javascript': 'preact',
  'preact:typescript': 'preact-ts',
  'lit:javascript': 'lit',
  'lit:typescript': 'lit-ts',
  'svelte:javascript': 'svelte',
  'svelte:typescript': 'svelte-ts',
} as const

function comboKey(spec: Pick<ScaffoldSpec, 'framework' | 'language'>): string {
  return `${spec.framework}:${spec.language}`
}

export function resolveViteTemplate(response: PromptsResponse): string {
  const spec = resolveScaffoldSpec(response)
  const key = comboKey(spec)
  const template = VITE_TEMPLATE_MAP[key]

  if (!template) {
    throw new Error(
      `Unsupported create-vite template mapping for framework/language "${key}"`,
    )
  }

  return template
}

export function isShadcnBootstrapPath(response: PromptsResponse): boolean {
  const spec = resolveScaffoldSpec(response)
  return spec.style.ui.provider === 'shadcn'
}
