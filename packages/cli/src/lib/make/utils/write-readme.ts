import { join, resolve } from 'node:path'
import prompts from 'prompts'
import { ensureFile, outputFile } from './utils.fs'

export function writeReadMe(response: prompts.Answers<string>): void {
  const { name: projectName, path: projectPath } = response.extension.name
  const readMePath = resolve(join(projectPath, 'README.md'))
  const backTicks = '```'
  const fileArch = `## Bedframe (default) project structure

${backTicks}bash
  >_ bedframe-project/
  ├ .git/
  ├ .github/
  │ ├ ○ assets/
  │ │ └ ○ fonts/
  ├ .changeset/
  ├ .husky/
  ├ ○ public/
  │ ├ ○ assets/
  │ │ ├ ○ fonts/
  │ │ └ ○ icons/
  ├ ○ src/
  │ ├ ○ _config/
  │ │ ├ ○ bedframe.config.ts
  │ │ └ ○ tests.config.ts
  │ ├ ○ components/
  │ ├ ○ manifests/
  │ │ ├ ○ chrome.ts
  │ │ ├ ○ brave.ts
  │ │ ├ ○ opera.ts
  │ │ ├ ○ edge.ts
  │ │ ├ ○ firefox.ts
  │ │ └ ○ safari.ts
  │ ├ ○ pages/
  │ │ ├ ○ newtab/
  │ │ └ ○ options/
  │ ├ ○ scripts/
  │ ├ └ ○ background.ts
  │ └ ○ styles/
  ├ .gitignore
  ├ .prettierignore
  ├ ○ package.json
  ├ ○ README.md
  ├ ○ tsconfig.json
  ├ ○ tsconfig.node.json
  └ ○ vite.config.ts  
  ${backTicks}  
  `
  const readMeContent = `
  <div>
  >_<br />
  <br />
  <span style="color:#c792e9">B R O W S E R</span><br />
  <span style="color: #c3e88d">E X T E N S I O N</span><br />
  <span style="color: #8addff">D E V E L O P M E N T</span><br />
  <span style="color: #ffcb6b">F R A M E W O R K</span><br />
</div>

<br />

## ${projectName}

The default Bedframe setup generates a production-ready Popup extension BED setup complete with sensible default configurations for:

- **Required**: base framework configuration (e.g. Vite + React with TypeScript)
- **Recommended**: linting & formating (w/ eslint + prettier w/ lint-staged)
- **Recommended**: source control (w/ git)
  - publish/ release workflows (ci/cd w/ github actions)
  - automated dependency updates (w/ dependapot workflows)
  - conventional commits and git hooks (commitizen + commitlint)
  - changesets (w/ changesets)
    - conventional changelog
- **Optional**: tests (unit testing w/ Vitest)

${fileArch}

  `

  ensureFile(readMePath)
    .then(() =>
      outputFile(readMePath, readMeContent).catch((error) =>
        console.error(error),
      ),
    )
    .catch((error) => console.error(error))
}
