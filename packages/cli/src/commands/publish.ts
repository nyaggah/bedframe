import childProcess from 'node:child_process'
import fs from 'node:fs'
import { basename, join, resolve } from 'node:path'
import { cwd } from 'node:process'
import { Command } from 'commander'
import {
  lightCyan,
  lightGreen,
  lightMagenta,
  lightRed,
  lightYellow,
} from 'kolorist'
import fetch from 'node-fetch'

type ChromeUploadConfig = {
  extensionId: string
  clientId: string
  clientSecret: string
  refreshToken: string
}

type FirefoxUploadConfig = {
  apiKey: string
  apiSecret: string
}

type EdgeUploadConfig = {
  productId: string
  clientId: string
  apiKey: string
}

interface SubmissionResponse {
  id: string
}

/**
 * Upload to Chrome Web Store
 *
 * for the time being this function uses
 * chrome-webstore-upload package
 *
 * @param {ChromeUploadConfig} config `{ extensionId, clientId, clientSecrete, refreshToken }`
 * @param {string} source
 *
 * @example
 * ```bash
 *  npx chrome-webstore-upload upload \
 *  --source ${zipPath} \
 *  --extension-id ${config.extensionId} \
 *  --client-id ${config.clientId} \
 *  --client-secret ${config.clientSecret} \
 *  --refresh-token ${config.refreshToken}
 * ```
 *
 */
function uploadToChrome(config: ChromeUploadConfig, source: string) {
  const zipName = source
    ? source
    : `${process.env.PACKAGE_NAME ?? process.env.npm_package_name}@${
        process.env.PACKAGE_VERSION ?? process.env.npm_package_version
      }
  -chrome.zip`
  const zipPath = resolve(join(cwd(), 'dist', zipName))

  if (fs.existsSync(zipPath)) {
    const uploadCmd = `npx chrome-webstore-upload-cli@3 upload \
      --source ${zipPath} \
      --extension-id ${config.extensionId} \
      --client-id ${config.clientId} \
      --client-secret ${config.clientSecret} \
      --refresh-token ${config.refreshToken}`

    childProcess.execSync(uploadCmd, { stdio: 'inherit' })
  } else {
    console.error(`zip file not found at path: ${zipPath}`)
    process.exit()
  }
}

/**
 * Upload to AMO Firefox/ Mozilla Add-Ons
 *
 * there's an upstream issue with this api. while the upload
 * will usually succeed, the approval might time out.
 * this func will time out the api after `30_000ms` and error messages should
 * hopefully be useful... check your email for approval confirmation later.
 * or check AMO Dashboard to see if it succeeded 👍
 *
 * @param {FirefoxUploadConfig} config
 *
 * @example
 *
 *```bash
 * npx web-ext sign \
 *   --source-dir ${sourceDir} \ # resolve(join(cwd(), 'dist', 'firefox'))
 *   --artifacts-dir ${artifactsDir} \ # resolve(join(cwd(), 'dist'))
 *   --api-key ${config.apiKey} \
 *   --api-secret ${config.apiSecret} \
 *   --channel unlisted \
 *   --timeout 30000  \
 *   --use-submission-api
 * ```
 *
 */
function uploadToFirefox(config: FirefoxUploadConfig) {
  const sourceDir = resolve(join(cwd(), 'dist', 'firefox'))
  const artifactsDir = resolve(join(cwd(), 'dist'))

  const zipName = `${process.env.PACKAGE_NAME}@${process.env.PACKAGE_VERSION}-firefox.zip`
  const zipPath = resolve(artifactsDir, zipName)

  console.log(`
• ${lightMagenta('F I R E F O X :')}
└ • name: ${lightGreen(`${process.env.PACKAGE_NAME}`)}
  • version: ${lightCyan(`${process.env.PACKAGE_VERSION}`)}
  • zip: ${lightYellow(`${basename(zipPath)}`)}
  • date/time: ${new Date().toLocaleString().replace(',', '')}
`)

  const signCmd = `npx web-ext sign \
    --source-dir ${sourceDir} \
    --artifacts-dir ${artifactsDir} \
    --api-key ${config.apiKey} \
    --api-secret ${config.apiSecret} \
    --channel unlisted \
    --timeout 30000`

  try {
    const output = childProcess.execSync(signCmd, { stdio: 'pipe' }).toString()
    console.log({ output })
    if (output.includes('WebExtError: Approval: timeout')) {
      console.log(
        lightYellow(
          'API has timed out. the extension might still be under review...',
        ),
      )
    } else {
      console.log('uploaded successfully.')
    }
  } catch (error) {
    console.log(
      lightYellow(
        'note: this API will usually succeed uploading your extension but the automatic approval/signing will usually timeout and you will see an error. check for an email from Mozilla Add-ons for confirmation.',
      ),
    )
    console.error(
      lightYellow('error uploading to Firefox:'),
      lightRed(`${error}`),
    )
  }
}

/**
 * Upload to MS Edge Add-Ons
 *
 * Updated for API v1.1 (January 2025)
 * Uses API key authentication instead of access tokens
 *
 * Requirements:
 * - Extension must already be created in MS Partner Center Edge Dashboard
 * - API credentials must be generated in Partner Center (opt-in to new experience)
 * - API keys expire every 72 days and need regeneration
 *
 * Note:
 * Currently can only update extension already created
 * in the MS Partner Center Edge Dashboard. So create a project
 * in the dashboard first, then this workflow should work.
 *
 * @param {EdgeUploadConfig} config - productId, clientId, and apiKey
 * @param {string} source - zip file name
 */
async function uploadToEdge(config: EdgeUploadConfig, source: string) {
  try {
    const zipName = source
      ? source
      : `${process.env.PACKAGE_NAME ?? process.env.npm_package_name}@${
          process.env.PACKAGE_VERSION ?? process.env.npm_package_version
        }-edge.zip`
    const zipPath = resolve(join(cwd(), 'dist', zipName))

    console.log(`• ${lightMagenta('E D G E:')}`)
    console.log(
      `└ • name: ${lightGreen(process.env.PACKAGE_NAME || 'Unknown')}`,
    )
    console.log(
      `  • version: ${lightCyan(process.env.PACKAGE_VERSION || 'Unknown')}`,
    )
    console.log(`  • zip: ${lightYellow(basename(zipPath))}`)
    console.log(
      `  • date/time: ${new Date().toLocaleString().replace(',', '')}`,
    )

    if (!fs.existsSync(zipPath)) {
      throw new Error(`zip file not found at path: ${zipPath}`)
    }

    const uploadUrl = `https://api.addons.microsoftedge.microsoft.com/v1/products/${config.productId}/submissions/draft/package`

    const packageStream = fs.createReadStream(zipPath)

    const response = await fetch(uploadUrl, {
      method: 'POST',
      headers: {
        Authorization: `ApiKey ${config.apiKey}`,
        'X-ClientID': config.clientId,
        'Content-Type': 'application/zip',
      },
      body: packageStream,
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(
        `Failed to upload Edge extension (HTTP ${response.status}): ${response.statusText}. ${errorText}`,
      )
    }

    const submissionResponse = (await response.json()) as SubmissionResponse
    const submissionId = submissionResponse.id
    const submissionUrl = `https://partner.microsoft.com/en-us/dashboard/microsoftedge/${config.productId}/submissions/${submissionId}`

    console.log(lightGreen('Edge extension uploaded successfully! 🎉'))
    console.log(`Submission URL: ${lightCyan(submissionUrl)}`)
    console.log(
      lightYellow(
        'Note: Check Partner Center for approval status and publishing.',
      ),
    )
  } catch (error) {
    console.error(lightRed('Error uploading to Edge:'), lightRed(`${error}`))
    console.log(lightYellow('\n💡 Troubleshooting tips:'))
    console.log(
      lightYellow(
        "  • Ensure you've opted-in to the new API experience in Partner Center",
      ),
    )
    console.log(
      lightYellow(
        "  • Check that your API key hasn't expired (72-day expiration)",
      ),
    )
    console.log(
      lightYellow('  • Verify productId, clientId, and apiKey are correct'),
    )
    console.log(
      lightYellow(
        '  • Make sure the extension exists in Partner Center dashboard',
      ),
    )
  }
}

export const publishCommand = new Command('publish')
  .command('publish')
  .description(
    `publish new or update existing extension(s)
- chrome: Chrome Web Store (C W S)
- firefox: Mozilla/Firefox Add-ons (A M O)
- edge: MS Edge Add-ons (M E A)`,
  )
  .option(
    '-b, --browsers <browsers...>',
    'specify browsers to publish (chrome, firefox, edge)',
  )
  .action(async (options) => {
    try {
      const selectedBrowsers = options.browsers
      if (
        selectedBrowsers &&
        (selectedBrowsers.includes('chrome') ||
          selectedBrowsers.includes('firefox') ||
          selectedBrowsers.includes('edge'))
      ) {
        console.log(
          lightMagenta('>_ publishing...'),
          selectedBrowsers.join(', ').toLowerCase(),
        )
      }

      if (!selectedBrowsers || selectedBrowsers.length === 0) {
        console.error(
          'no browsers specified. use -b or --browsers to specify browsers.',
        )
        return
      }

      if (selectedBrowsers.includes('chrome')) {
        const zipName = `${
          process.env.PACKAGE_NAME ?? process.env.npm_package_name
        }@${
          process.env.PACKAGE_VERSION ?? process.env.npm_package_version
        }-chrome.zip`
        const zipPath = resolve(join(cwd(), 'dist', zipName))

        console.log(`• ${lightMagenta('C H R O M E:')}
└ • name: ${lightGreen(`${process.env.PACKAGE_NAME}`)}
  • version: ${lightCyan(`${process.env.PACKAGE_VERSION}`)}
  • zip: ${lightYellow(`${basename(zipPath)}`)}
  • date/time: ${new Date().toLocaleString().replace(',', '')}
`)
        const chromeConfig: ChromeUploadConfig = {
          extensionId: process.env.EXTENSION_ID || '',
          clientId: process.env.CLIENT_ID || '',
          clientSecret: process.env.CLIENT_SECRET || '',
          refreshToken: process.env.REFRESH_TOKEN || '',
        }
        uploadToChrome(chromeConfig, zipName)
      }

      if (selectedBrowsers.includes('firefox')) {
        const firefoxConfig: FirefoxUploadConfig = {
          apiKey: process.env.WEB_EXT_API_KEY || '',
          apiSecret: process.env.WEB_EXT_API_SECRET || '',
        }
        uploadToFirefox(firefoxConfig)
      }

      if (selectedBrowsers.includes('edge')) {
        const zipName = `${
          process.env.PACKAGE_NAME ?? process.env.npm_package_name
        }@${
          process.env.PACKAGE_VERSION ?? process.env.npm_package_version
        }-edge.zip`

        const edgeConfig: EdgeUploadConfig = {
          productId: process.env.EDGE_PRODUCT_ID || '',
          clientId: process.env.EDGE_CLIENT_ID || '',
          apiKey: process.env.EDGE_API_KEY || '',
        }

        if (
          !edgeConfig.productId ||
          !edgeConfig.clientId ||
          !edgeConfig.apiKey
        ) {
          console.error(
            lightRed('Missing required Edge configuration. Please set:'),
          )
          console.error(
            lightRed('  EDGE_PRODUCT_ID, EDGE_CLIENT_ID, EDGE_API_KEY'),
          )
          console.log(lightYellow('\n💡 To get these values:'))
          console.log(
            lightYellow(
              '  1. Go to Partner Center > Microsoft Edge > Publish API',
            ),
          )
          console.log(
            lightYellow('  2. Click "Enable" to opt-in to new experience'),
          )
          console.log(lightYellow('  3. Generate new API credentials'))
          return
        }

        await uploadToEdge(edgeConfig, zipName)
      }
    } catch (error) {
      console.error('failed to publish project:', error)
    }
  })
