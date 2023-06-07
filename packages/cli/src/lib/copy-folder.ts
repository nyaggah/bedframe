import fs from 'fs-extra'
import { dim, green } from 'kolorist'
import path from 'node:path'
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
  fs.ensureDir(to)
    // .then(async () => console.log(dim(`successfully created ${green(to)})`)))
    .catch((error) => console.error(error))

  for (const element of fs.readdirSync(from)) {
    const reg = /^__/
    const dotName = element.replace(reg, '.')
    const elementName = reg.test(element) ? dotName : element
    // eslint-disable  no-await-in-loop
    if ((await fs.lstat(path.join(from, element))).isFile()) {
      fs.copy(path.join(from, element), path.join(to, elementName))
    } else {
      copyFolder(path.join(from, element), path.join(to, elementName))
    }
  }
}
