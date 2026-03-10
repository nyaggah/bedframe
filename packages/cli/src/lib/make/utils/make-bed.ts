import { basename, dirname } from 'node:path'
import { execa } from 'execa'
import { bold, dim, lightGray, green as lightGreen } from 'kolorist'
import Listr from 'listr'
import { resolveScaffoldSpec } from '../features/scaffold-spec'
import type { PromptsResponse } from '../prompts'
import { bootstrapViteProject } from './bootstrap-vite'
import { runScaffoldCodemods } from './codemod-scaffold'
import { configureScaffold } from './configure-scaffold'
import { installDependencies } from './install-deps'
import { ensureDir } from './utils.fs'
import { writeScaffoldFiles } from './write-scaffold-files'

async function createInitialCommit(projectPath: string): Promise<void> {
  await execa('git', ['add', '-A'], { cwd: projectPath })

  const diffResult = await execa('git', ['diff', '--cached', '--quiet'], {
    cwd: projectPath,
    reject: false,
  })

  if (diffResult.exitCode === 0) {
    return
  }

  await execa(
    'git',
    ['commit', '--no-verify', '-m', 'feat: configure bedframe'],
    {
      cwd: projectPath,
      env: {
        HUSKY: '0',
        LEFTHOOK: '0',
      },
    },
  )
}

async function verifyScaffoldState(projectPath: string): Promise<void> {
  await execa('git', ['add', '-A'], { cwd: projectPath })
}

export async function makeBed(response: PromptsResponse) {
  const { browser, development } = response
  const { name: projectName, path: projectPath } = response.extension.name
  const { installDeps } = development.config
  const { git, packageManager } = development.template.config
  const spec = resolveScaffoldSpec(response)

  if (!projectPath) return

  await ensureDir(dirname(projectPath))

  const tasks = new Listr(
    [
      {
        title: `${dim('>_ ')}${projectName}${dim('/')}`,
        task: () => {},
      },
      {
        title: 'Phase: collect',
        task: () => {},
      },
      {
        title: 'Phase: bootstrap',
        task: () => bootstrapViteProject(response),
      },
      {
        title: 'Phase: install',
        enabled: () => installDeps,
        task: () => installDependencies(response),
      },
      {
        title: 'Phase: configure',
        enabled: () => installDeps,
        task: () => configureScaffold(response),
      },
      {
        title: 'Phase: codemod',
        task: async () => {
          await writeScaffoldFiles(response)
          await runScaffoldCodemods(response)
        },
      },
      {
        title: 'Phase: verify',
        enabled: () => git,
        task: () => verifyScaffoldState(projectPath),
      },
      {
        title: 'Phase: commit',
        enabled: () => git,
        task: () => createInitialCommit(projectPath),
      },
    ],
    { concurrent: false },
  )

  await tasks.run()

  const browserList = browser
    .slice(0, 3)
    .map((browserName: string) => browserName)
    .join(',')
  const pm = packageManager.toLowerCase()
  const pmRun = pm !== 'yarn' ? `${pm} run` : pm

  console.log(`
  ${bold(dim('>_'))}  ${lightGreen('your BED is made! 🚀')}      
      
      created ${lightGreen(projectName)} at ${lightGreen(projectPath)}
      framework/language: ${lightGreen(spec.framework)}/${lightGreen(
        spec.language,
      )}
      
      inside that directory, you can run several commands:

      ${dim('development:')}
        ${pmRun} dev                         ${dim(
          'start dev server for all browsers',
        )}
        ${pmRun} dev ${browser[0]}                  ${dim(
          `start dev server for ${lightGray(browser[0])}`,
        )}
        ${
          browser.length > 1
            ? `${pmRun} dev ${browserList}      ${dim(
                `start dev servers for ${lightGray(browserList)}`,
              )}`
            : browser
        }
        
      ${dim('production:')}
        ${pmRun} build                       ${dim(
          `generate prod builds for all browsers (${lightGray(
            './dist/<browser>',
          )})`,
        )}        
        ${pmRun} build ${lightGray(browser[0])}                ${dim(
          `generate prod build for ${lightGray(browser[0])} (${lightGray(
            `./dist/${lightGray(browser[0])}`,
          )})`,
        )}
        ${
          browser.length > 1
            ? `${pmRun} build ${browserList}    ${dim(
                `generate prod builds for ${lightGray(browserList)}`,
              )}`
            : browser
        }         
        
      ${dim('- - -')} 

      suggested next steps:
        ${dim('1.')} cd ${basename(projectPath)}
        ${
          !installDeps
            ? `${dim('2.')} ${pm} install`
            : `${dim('2.')} ${pmRun} dev ${browser[0]}`
        }
        ${!installDeps ? `${dim('3.')} ${pmRun} dev ${browser[0]}` : ''}
        `)
}
