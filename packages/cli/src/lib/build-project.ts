import { projectInstall, install } from 'pkg-install'
import { ExecaReturnValue, execa } from 'execa'
import { createSpinner } from 'nanospinner'
import { dim, green } from 'kolorist'
import fs from 'fs-extra'
import Listr from 'listr'
import url from 'node:url'
import { cwd } from 'node:process'
import path, { basename } from 'node:path'
import { writeManifests } from './write-manifests'
import { writePackageJson } from './write-package-json'
import { writeViteConfig } from './write-vite-config'
import { PromptsResponse } from './prompts'
import { copyFolder } from './copy-folder'

export async function makeBed(response: PromptsResponse) {
  // update response for all the cool kids who like to initialize with a .
  // TO diddly DO: there's an issue w/ parent dir being recreated
  // inside projectDir (prolly due to all this `ensureDir` bidnez)

  response = {
    ...response,
    name: {
      name: basename(cwd()),
      path: cwd(),
    },
  }

  const projectDir = response.name.name
  const projectPath = response.name.path

  // if (response.name) {
  if (projectPath) {
    fs.ensureDir(projectPath)
      .then(async () => {
        console.log(
          dim(`successfully created project at ${green(projectDir)})`)
        )
        // return
        // await execa('cd', [projectDir])
        await execa('cd', [projectPath])
          .then((data) =>
            console.log(
              'fs.ensureDir(projectDir).then... [are we inside projectDir?] {data, projectDir}',
              { data, projectDir }
            )
          )
          .catch(console.error)
      })
      .then(async () => {
        await execa('cd', [`${projectPath}`])
          .then(() => {
            console.log('cwd()', cwd())
          })
          .then(() => writePackageJson(response))
          .catch(console.error)

        await Promise.all([writeManifests(response), writeViteConfig(response)])
          .then(async () => {
            const __dirname = path.dirname(url.fileURLToPath(import.meta.url))
            const stubsPath = path.resolve(path.join(__dirname, 'stubs'))

            const stubs = {
              base: path.join(stubsPath, 'base'),
              public: path.join(stubsPath, 'public'),
              tsconfig: path.join(stubsPath, 'tsconfig'),
              style: {
                styledComponents: path.join(
                  stubsPath,
                  'style',
                  'styled-components'
                ),
                tailwind: path.join(stubsPath, 'style', 'tailwind'),
              },
              scripts: path.join(stubsPath, 'scripts'),
              lintFormat: path.join(stubsPath, 'lint-format'),
              gitHooks: path.join(stubsPath, 'git-hooks'),
              tests: path.join(stubsPath, 'tests'),
              changesets: path.join(stubsPath, 'changesets'),
              vscode: path.join(stubsPath, 'vscode'),
              components:
                response.development.template.config.style ===
                'Styled Components'
                  ? path.join(stubsPath, 'components', 'styled-components')
                  : path.join(stubsPath, 'components', 'tailwind'),
            }

            const destination = {
              root: path.resolve(response.name.path),
            }
            await Promise.all([
              copyFolder(stubs.base, destination.root),
              copyFolder(stubs.public, path.join(destination.root, 'public')),
              copyFolder(
                stubs.components,
                path.join(destination.root, 'src', 'components')
              ),
              copyFolder(
                stubs.scripts,
                path.join(destination.root, 'src', 'scripts')
              ),

              // TS Config
              response.development.template.config.language === 'TypeScript'
                ? copyFolder(stubs.tsconfig, destination.root)
                : Promise.resolve(),
              // Tailwind CSS
              response.development.template.config.style === 'Tailwind'
                ? copyFolder(stubs.style.tailwind, destination.root)
                : Promise.resolve(),
              // Styled Components
              response.development.template.config.style === 'Styled Components'
                ? copyFolder(
                    stubs.style.styledComponents,
                    path.join(destination.root, 'src')
                  )
                : Promise.resolve(),

              // TO diddly DO: operation `fat package` yo!
              // prettier ignore might need to be the only file transferred here...
              // Lint & Format
              response.development.template.config.lintFormat ||
              response.language === 'TypeScript'
                ? copyFolder(stubs.lintFormat, destination.root)
                : Promise.resolve(),
              // Unit Tests
              response.development.template.config.tests
                ? copyFolder(stubs.tests, destination.root)
                : Promise.resolve(),
              // Git Hooks w/ Husky
              response.development.template.config.gitHooks
                ? copyFolder(stubs.gitHooks, destination.root)
                : Promise.resolve(),
              // Changesets
              response.development.template.config.changesets
                ? copyFolder(stubs.changesets, destination.root)
                : Promise.resolve(),
            ])
          })
          .then(async () => {
            await installDependencies(response)
              .then(() => {
                console.log('installing dependencies....')
              })
              .then(() => {
                if (response.development.template.config.git) {
                  initializeGitProject(response.name.name).catch((error) =>
                    console.error(error)
                  )
                }
              })
              .catch((error) => console.error(error))
          })
          .catch((error) => console.error(error))
      })
  }
}

export async function initializeGitProject(projectName: string, cwd?: string) {
  const tasks = new Listr([
    {
      title: 'Initializing git repository',
      task: async (ctx, task): Promise<ExecaReturnValue<string>> => {
        const proc = execa('git', ['init'], { cwd })
        proc.stdout?.pipe(process.stdout)
        const spinner = createSpinner('Initializing git repository').start()
        await proc
        spinner.success()
        return proc
      },
    },
    {
      title: 'Adding files to git',
      task: async (ctx, task): Promise<ExecaReturnValue<string>> => {
        const proc = execa('git', ['add', '.'], { cwd })
        proc.stdout?.pipe(process.stdout)
        const spinner = createSpinner('Adding files to git').start()
        await proc
        spinner.success()
        return proc
      },
    },
    {
      title: 'Committing changes',
      task: async (ctx, task): Promise<ExecaReturnValue<string>> => {
        const proc = execa(
          'git',
          [
            'commit',
            '-am',
            `feat(${projectName}): initial commit. configure BEDframe`,
          ],
          { cwd }
        )
        proc.stdout?.pipe(process.stdout)
        const spinner = createSpinner('Committing changes').start()
        await proc
        spinner.success()
        return proc
      },
    },
  ])

  await tasks.run()
}

export async function installDependencies(response: PromptsResponse) {
  const { packageManager } = response.development.template.config

  const { stdout } = await projectInstall({
    prefer: packageManager.toLowerCase(),
    cwd: response.name.path,
  })

  const packages = stdout.match(/Installing .+/g)
  if (!packages) {
    console.log('No packages to install.')
    return
  }

  const tasks = packages.map((pkg: any) => ({
    title: pkg,
    task: () =>
      new Promise<void>((resolve, reject) => {
        const spinner = createSpinner(`Installing ${pkg}`)
        spinner.start()

        install(pkg.split(' ')[1])
          .then(() => {
            spinner.success({ text: 'Success!🚀' })
            resolve()
          })
          .catch((error) => {
            spinner.error({ text: 'Failed! 😢' })
            reject(error)
          })
      }),
  }))

  try {
    await new Listr(tasks).run()
    console.log('Packages installed successfully!')
  } catch (error) {
    console.error('Error installing packages:', error)
  }
}
