import fs from 'fs/promises'

/**
 * ensure a directory exists before attempting to create content
 *
 * @export
 * @param {string} dirPath
 * @return {*}  {Promise<void>}
 */
export async function ensureDir(dirPath: string): Promise<void> {
  try {
    await fs.mkdir(dirPath, { recursive: true })
  } catch (error) {
    console.error(error)
  }
}

/**
 * create file with content given filePath
 *
 * @export
 * @param {string} filePath
 * @param {string} fileContent
 * @return {*}  {Promise<void>}
 */

export async function outputFile(
  filePath: string,
  fileContent: string,
): Promise<void> {
  try {
    console.log({ filePath, fileContent })
    await writeFile(filePath, fileContent + '\n')
  } catch (error) {
    console.error(error)
  }
}

/**
 * write file content given data
 *
 * @export
 * @param {string} filePath
 * @param {string} data
 * @return {*}  {Promise<void>}
 */
export async function writeFile(filePath: string, data: string): Promise<void> {
  try {
    await fs.writeFile(filePath, data + '\n')
  } catch (error) {
    console.error(error)
  }
}

/**
 * ensure file exists i.e. create if not
 *
 * @export
 * @param {string} filePath
 * @return {*}  {Promise<void>}
 */
export async function ensureFile(filePath: string): Promise<void> {
  try {
    await fs.writeFile(filePath, '')
  } catch (error) {
    console.error(error)
  }
}
