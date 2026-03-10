import path from 'node:path'
import type { Answers } from 'prompts'
import { ensureDir, outputFile } from './utils.fs'
/**
 * create the `tsconfig.ts` & `tsconfig.node.json` based on prompt responses
 *
 * @export
 * @param {Answers<string>} response
 */
export async function writeTsConfig(
  response: Answers<string>,
): Promise<void> {
  const { style, tests } = response.development.template.config
  const { name } = response.extension
  const isTailWind = style.toLowerCase() === 'tailwind'

  const tsConfigApp = `{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "types": ["@bedframe/core"${tests ? `, "jest"` : ''}, "@types/chrome"],
    "module": "ESNext",
    "skipLibCheck": true,

    /* Bundler mode */
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "moduleDetection": "force",
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
  "exclude": ["src/manifests", "src/_config/bedframe.config.ts"]
}

`

  const tsConfig = `{
  "files": [],
  "references": [
    { "path": "./tsconfig.app.json" },
    { "path": "./tsconfig.node.json" }
  ],
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
`

  const tsConfigNode = `{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["ES2023"],
    "module": "ESNext",
    "skipLibCheck": true,

    /* Bundler mode */
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "isolatedModules": true,
    "moduleDetection": "force",
    "noEmit": true,

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

  const rootDir = path.resolve(name.path)
  await ensureDir(rootDir)
  await Promise.all([
    outputFile(path.join(rootDir, 'tsconfig.json'), tsConfig),
    outputFile(path.join(rootDir, 'tsconfig.app.json'), tsConfigApp),
    outputFile(path.join(rootDir, 'tsconfig.node.json'), tsConfigNode),
  ])
}
