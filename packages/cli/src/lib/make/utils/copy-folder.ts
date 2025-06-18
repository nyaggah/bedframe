import { constants, promises as fs } from 'node:fs'
import { join } from 'node:path'

/**
 * copyFolder(from, to)
 *
 * copies folder from source `from`  to destination `to`
 * ensures the `to` dir exists i.e. will create it if not
 *
 * @export
 * @param {string} from
 * @param {string} to
 * @return {*}  {Promise<void>}
 */
export async function copyFolder(from: string, to: string): Promise<void> {
  try {
    const isDestinationExists = await directoryExists(to)
    if (!isDestinationExists) {
      await fs.mkdir(to, { recursive: true })
    }

    const elements = await fs.readdir(from)
    for (const element of elements) {
      const reg = /^__/
      const dotName = element.replace(reg, '.')
      const elementName = reg.test(element) ? dotName : element

      const sourcePath = join(from, element)
      const destinationPath = join(to, elementName)
      const stats = await fs.lstat(sourcePath)

      if (stats.isFile()) {
        await fs.copyFile(sourcePath, destinationPath)
      } else if (stats.isDirectory()) {
        await copyFolder(sourcePath, destinationPath)
        if (elementName === '.husky') {
          await makeFilesExecutable(destinationPath)
        }
      }
    }
  } catch (error) {
    console.error(error)
  }
}

/**
 *
 * Change file mode to make files in e.g. `.husky` directory executable
 * @param {string} path
 * @return {*}  {Promise<boolean>}
 */
async function directoryExists(path: string): Promise<boolean> {
  try {
    await fs.access(path, constants.R_OK)
    return true
  } catch (_error) {
    return false
  }
}

/**
 *
 *
 * @param {string} directoryPath
 * @return {*}  {Promise<void>}
 */
async function makeFilesExecutable(directoryPath: string): Promise<void> {
  try {
    const files = await fs.readdir(directoryPath)
    for (const file of files) {
      const filePath = join(directoryPath, file)
      await fs.chmod(filePath, 0o755) // Make files executable
    }
  } catch (error) {
    console.error(`Error while making files executable: ${error}`)
  }
}
