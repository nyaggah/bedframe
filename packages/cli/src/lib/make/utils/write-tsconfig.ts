import path from 'node:path'
import type { Answers } from 'prompts'
import { ensureDir, outputFile } from './utils.fs'
/**
 * create the `tsconfig.ts` & `tsconfig.node.json` based on prompt responses
 *
 * @export
 * @param {Answers<string>} response
 */
export function writeTsConfig(response: Answers<string>): void {
  const { style, tests } = response.development.template.config
  const { name } = response.extension
  const isTailWind = style.toLowerCase() === 'tailwind'

  const tsConfig = `{
  "compilerOptions": {
    "target": "ESNext",
    "lib": ["DOM", "DOM.Iterable", "ESNext"],
    "types": ["@bedframe/core"${tests ? `, "jest"` : ''}],
    "module": "ESNext",
    "skipLibCheck": true,

    /* Bundler mode */
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",

    /* Linting */
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,

    /* Path aliases */
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["src"],
  "exclude": ["src/manifests", "src/_config/bedframe.config.ts"],
  "references": [{ "path": "./tsconfig.node.json" }]
}

`

  const tsConfigNode = `{
  "compilerOptions": {
    "composite": true,
    "skipLibCheck": true,
    "module": "ESNext",
    "moduleResolution": "bundler",
    "allowSyntheticDefaultImports": true,
    "jsx": "react-jsx",

    /* Path aliases */
    "paths": {
      "@/*": ["./src/*"]
    }    
  },
  "include": [
    "src/manifests",
    "package.json",
    "vite.config.ts",
    ${isTailWind ? `"tailwind.config.js",` : ''}
    "src/_config/bedframe.config.ts",
    ${isTailWind ? `"postcss.config.js"` : ''}
  ]
}

`

  try {
    const rootDir = path.resolve(name.path)
    ensureDir(rootDir).catch(console.error)
    outputFile(path.join(rootDir, 'tsconfig.json'), tsConfig).catch((error) =>
      console.error(error),
    )
    outputFile(path.join(rootDir, 'tsconfig.node.json'), tsConfigNode).catch(
      (error) => console.error(error),
    )
  } catch (error) {
    console.error(error)
  }
}
