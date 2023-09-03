import { Manifest } from '@bedframe/core'
import { dim, lightGreen, lightRed } from 'kolorist'
import fs from 'node:fs'
import path from 'node:path'

export function modifyManifestForFirefox(
  browserSpecificDistDir: string,
  browser: string,
): void {
  try {
    const manifestJson = path.join(browserSpecificDistDir, 'manifest.json')
    const manifestContent: Manifest | Record<string, any> = JSON.parse(
      fs.readFileSync(manifestJson, 'utf-8'),
    )

    console.log('\n- - - - - - - - - \n')
    console.log(`C O D E M O D : ${browser} manifest\n`)
    console.log(
      dim(`todo: polyfill namespaces and browser-specific apis 
e.g. 'browser.runtime' and 'chrome.runtime', etc
perform some after-build code mods. not ideal, but...
https://youtu.be/RlwlV4hcBac?t=21
- - -
bedframe builds for MV3 and while Firefox, et al support MV3 there
is some divergence... this performs after-build codemods on manifest
and feature code but ideally this should happen within the vite/crx dev/build process...
but... until then... spaghetti-ville!\n`),
    )

    // Modify the "background" section
    if (manifestContent.background) {
      if (manifestContent.background.service_worker) {
        const oldBackground = {
          background: manifestContent.background,
        }
        const newBackground = {
          background: {
            scripts: [manifestContent.background.service_worker],
          },
        }

        console.log(
          lightRed(`- from:\n${JSON.stringify(oldBackground, null, 2)}\n`),
        )
        console.log(
          lightGreen(`+ to:\n${JSON.stringify(newBackground, null, 2)}\n`),
        )

        manifestContent.background.scripts = [
          manifestContent.background.service_worker,
        ]
        delete manifestContent.background.service_worker
        delete manifestContent.background.type
      }
    }

    // More modifications specific to Firefox...

    fs.writeFileSync(manifestJson, JSON.stringify(manifestContent, null, 2))
    console.log(
      `${path.basename(
        browserSpecificDistDir,
      )} manifest modified successfully... 🍝 🚀\n`,
    )
  } catch (error) {
    console.error('Error modifying manifest for Firefox:', error)
  }
}

export function modifyFeaturesForFirefox(
  browserSpecificDistDir: string,
  browser: string,
): void {
  try {
    const sourceDirectory = browserSpecificDistDir ?? process.cwd()
    const searchString = 'chrome.sidePanel.setOptions'
    const replaceString = 'browser.sidebarAction.setPanel'

    console.log('\n- - - - - - - - - \n')
    console.log(`C O D E M O D : ${browser} features\n`)

    replaceInDirectory(sourceDirectory, searchString, replaceString)

    console.log('features code modified successfully...🍝 🚀')
  } catch (error) {
    console.error('error modifying code features for Firefox:', error)
  }
}

export function replaceInDirectory(
  directoryPath: string,
  searchString: string,
  replaceString: string,
): void {
  const files = fs.readdirSync(directoryPath)

  for (const fileName of files) {
    const filePath = path.join(directoryPath, fileName)

    if (fs.statSync(filePath).isDirectory()) {
      replaceInDirectory(filePath, searchString, replaceString)
    } else if (path.extname(fileName) === '.js') {
      replaceInFile(filePath, searchString, replaceString)
    }
  }
}

export function replaceInFile(
  filePath: string,
  searchString: string,
  replaceString: string,
): void {
  const fileContent = fs.readFileSync(filePath, 'utf-8')
  const updatedContent = fileContent.replace(
    new RegExp(searchString, 'g'),
    replaceString,
  )

  if (updatedContent !== fileContent) {
    fs.writeFileSync(filePath, updatedContent, 'utf-8')
    console.log(`
file: ${path.basename(filePath)}
  ${lightRed(`- from: ${searchString}`)}
  ${lightGreen(`+ to:   ${replaceString}`)}

  `)
  }
}
