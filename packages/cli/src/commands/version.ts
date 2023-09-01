import { Command } from 'commander'
import { execa } from 'execa'
import { lightGreen, lightRed } from 'kolorist'

export const versionCommand = new Command('version')
  .command('version')
  .description(
    'create or update git release of current version (changeset version)',
  )
  .option('--ignore <package>', 'skip a package from being published')
  .option('--snapshot', 'create a snapshot release for testing')
  .action(async (options) => {
    try {
      const versionCmd = 'changeset'
      const versionArgs = ['version']

      if (options.ignore) {
        versionArgs.push('--ignore', options.ignore)
      }

      if (options.snapshot) {
        versionArgs.push('--snapshot')
      }

      const childProcess = await execa(versionCmd, versionArgs)

      if (childProcess.stdout.length > 0) {
        console.log(lightGreen(childProcess.stdout))
      } else if (childProcess.stderr.length > 0) {
        console.error(lightRed(childProcess.stderr))
      }
    } catch (error) {
      console.error('Failed to create version:', error)
    }
  })

/*
From the docs: https://github.com/changesets/changesets/blob/main/docs/command-line-options.md  

version
changeset version
This is one of two commands responsible for releasing packages. The version command takes changesets that have been made and updates versions and dependencies of packages, as well as writing changelogs. It is responsible for all file changes to versions before publishing to npm.

We recommend making sure changes made from this command are merged back into the base branch before you run publish.

Version has two options, ignore and snapshot:

changeset version --ignore PACKAGE_NAME
This command is used to allow you to skip packages from being published. This allows you to run partial publishes of the repository. Using ignore has some safety rails:

If the package is mentioned in a changeset that also includes a package that is not ignored, publishing will fail.
If the package requires one of its dependencies to be updated as part of a publish.
These restrictions exist to ensure your repository or published code does not end up in a broken state. For additional information on the intricacies of publishing, check out our guide on problems publishing in monorepos.

changeset version --snapshot
Snapshot is used for a special kind of publishing for testing - it creates temporary versions with a tag, instead of updating versions from the current semver ranges. You should not use this without reading the documentation on snapshot releases  
  */
