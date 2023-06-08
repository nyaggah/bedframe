// import fs,from 'fs-extra'
import { dim, green, yellow } from 'kolorist'
import { promises as fs, constants } from 'fs'
import path, { join } from 'node:path'
import { basename } from 'path'
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
      // console.log(`Successfully created ${to}`)
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
        // console.log(
        //   `Copied ${yellow(basename(from))} template file to ${green(to)}`
        // )
      } else if (stats.isDirectory()) {
        await copyFolder(sourcePath, destinationPath)
        // console.log(
        //   `Copied ${yellow(basename(from))} template folder to ${green(to)}`
        // )
      }
    }
  } catch (error) {
    console.error(error)
  }
}

async function directoryExists(path: string): Promise<boolean> {
  try {
    await fs.access(path, constants.R_OK)
    return true
  } catch (error) {
    return false
  }
}

// export async function copyFolder(from: string, to: string): Promise<void> {
//   fs.ensureDir(to)
//     .then(async () => console.log(dim(`successfully created ${green(to)})\n`)))
//     .catch((error) => console.error(error))

//   for (const element of fs.readdirSync(from)) {
//     const reg = /^__/
//     const dotName = element.replace(reg, '.')
//     const elementName = reg.test(element) ? dotName : element
//     // eslint-disable  no-await-in-loop
//     if ((await fs.lstat(path.join(from, element))).isFile()) {
//       fs.copy(path.join(from, element), path.join(to, elementName))
//       console.log('copied template file to' + to)
//     } else {
//       copyFolder(path.join(from, element), path.join(to, elementName))
//       console.log('copied template FOLDER to' + to)
//     }
//   }
// }
