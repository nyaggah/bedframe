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
      }
    }
  } catch (error) {
    console.error(error)
  }
}

/**
 *
 *
 * @param {string} path
 * @return {*}  {Promise<boolean>}
 */
async function directoryExists(path: string): Promise<boolean> {
  try {
    await fs.access(path, constants.R_OK)
    return true
  } catch (error) {
    return false
  }
}
