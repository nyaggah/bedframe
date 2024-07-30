import childProcess from 'node:child_process'
import fs from 'node:fs'
import { basename, join, resolve } from 'node:path'
import { cwd } from 'node:process'
import { Command } from 'commander'
import {
  dim,
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
  clientSecret: string
  accessTokenUrl: string
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
 * get access token (jwt) for api calls
 * ```bash
 * > curl \
 *  -X POST \
 *  -H "Content-Type: application/x-www-form-urlencoded" \
 *  -d "client_id={$Client_ID}" \
 *  -d "scope=https://api.addons.microsoftedge.microsoft.com/.default" \
 *  -d "client_secret={$Client_Secret}" \
 *  -d "grant_type=client_credentials" \
 *  -v \
 *  <ACCESS_TOKEN_URL> e.g. https://login.microsoftonline.com/{$TENANT_ID}/oauth2/v2.0/token
 * ```
 * FULL access token URL. find at: https://partner.microsoft.com/en-us/dashboard/microsoftedge/publishapi
 *
 * @param {EdgeUploadConfig} config
 * @return {*}  {Promise<string>}
 */
async function getEdgeAccessToken(config: EdgeUploadConfig): Promise<string> {
  try {
    const response = await fetch(config.accessTokenUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: config.clientId,
        scope: 'https://api.addons.microsoftedge.microsoft.com/.default',
        client_secret: config.clientSecret,
        grant_type: 'client_credentials',
      }),
    })

    if (!response.ok) {
      throw new Error(`failed to get Edge access token: ${response.statusText}`)
    }

    try {
      const responseBody: any = await response.json()
      return responseBody.access_token
    } catch (jsonError: any) {
      throw new Error(`Error parsing JSON response: ${jsonError.message}`)
    }
  } catch (error) {
    console.error('Error in getEdgeAccessToken:', error)
    throw error // Re-throw the error after logging it
  }
}

/**
 * Upload to MS Edge Add-Ons
 *
 * currently can only update extension already created
 * in the MS Partner Center Edge Dashboard. so create a project
 * in the dashboard first, then this workflow should work.
 *
 * @param {EdgeUploadConfig} config
 * @param {string} source
 */
async function uploadToEdge(config: EdgeUploadConfig, source: string) {
  try {
    const zipName = source
      ? source
      : `${process.env.PACKAGE_NAME ?? process.env.npm_package_name}@${
          process.env.PACKAGE_VERSION ?? process.env.npm_package_version
        }-edge.zip`
    const zipPath = resolve(join(cwd(), 'dist', zipName))

    console.log(`
• ${lightMagenta('E D G E:')}
└ • name: ${lightGreen(`${process.env.PACKAGE_NAME}`)}
  • version: ${lightCyan(`${process.env.PACKAGE_VERSION}`)}
  • zip: ${lightYellow(`${basename(zipPath)}`)}
  • date/time: ${new Date().toLocaleString().replace(',', '')}
`)

    const accessToken = await getEdgeAccessToken(config)
    const uploadUrl = `https://api.addons.microsoftedge.microsoft.com/v1/products/${config.productId}/submissions/draft/package`

    const packageStream = fs.createReadStream(zipPath)

    const response = await fetch(uploadUrl, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/zip',
      },
      body: packageStream,
    })

    if (!response.ok) {
      throw new Error(
        `failed to upload Edge extension... this method is slightly buggy at the moment... https://www.youtube.com/watch?v=fmpw7fO8iFs&t=25s ${response.statusText}`,
      )
    }

    const submissionResponse = (await response.json()) as SubmissionResponse
    const submissionId = submissionResponse.id
    const submissionUrl = `https://partner.microsoft.com/en-us/dashboard/microsoftedge/${config.productId}/submissions/${submissionId}`

    console.log(
      `Edge extension uploaded successfully. submission url: ${submissionUrl}`,
    )
  } catch (error) {
    console.error(lightYellow('error uploading to Edge:'), lightRed(`${error}`))
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
    // TO diddly DO:
    // actually handle multiple browsers --browsers
    // option... run through below conditional for all browsers
    // found in ./src/manifests/index.ts array --> []
    // ^^^ update this when there's a moar betta way to grab all
    // browsers from project. e.g. esm import that ts and process
    // the func to return the pojo bedframeConfig
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
          clientSecret: process.env.EDGE_CLIENT_SECRET || '',
          accessTokenUrl: process.env.EDGE_ACCESS_TOKEN_URL || '',
        }
        uploadToEdge(edgeConfig, zipName)
      }
    } catch (error) {
      console.error('failed to publish project:', error)
    }
  })
