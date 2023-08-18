import got, { Headers } from 'got'

import { PublishConfig } from './types'
/**
 * returns the publish config w/ env and actions
 * the action will determine if we're creating a new
 * extension or updating an existing one, with an
 * option to auto publish for either/ any of these actions
 *
 * @export
 * @param {PublishConfig} config
 * @return {*}  {@link PublishConfig}
 */
export function createPublishConfig(config: PublishConfig): PublishConfig {
  return config
}

interface APIClientOptions {
  extensionId: string
  clientId: string
  clientSecret?: string
  refreshToken: string
}

const rootURI = 'https://www.googleapis.com'
const refreshTokenURI = `${rootURI}/oauth2/v4/token`

const uploadExistingURI = (id: string) =>
  `${rootURI}/upload/chromewebstore/v1.1/items/${id}`
const publishURI = (id: string, target: string) =>
  `${rootURI}/chromewebstore/v1.1/items/${id}/publish?publishTarget=${target}`
const getURI = (id: string, projection: string) =>
  `${rootURI}/chromewebstore/v1.1/items/${id}?projection=${projection}`

const requiredFields: (keyof APIClientOptions)[] = [
  'extensionId',
  'clientId',
  'refreshToken',
]

async function fetchToken(options: APIClientOptions): Promise<string> {
  const { clientId, clientSecret, refreshToken } = options
  const json = {
    client_id: clientId,
    refresh_token: refreshToken,
    grant_type: 'refresh_token',
  }

  if (clientSecret) {
    json.client_secret = clientSecret
  }

  const response = await got.post<TokenResponse>(refreshTokenURI, {
    json,
    responseType: 'json', // Specify that the response is JSON
  })

  return response.body.access_token
}

interface TokenResponse {
  access_token: string
}

function createHeaders(token: string): Headers {
  return {
    Authorization: `Bearer ${token}`,
    'x-goog-api-version': '2',
  }
}

export async function uploadExisting(
  options: APIClientOptions,
  readStream: NodeJS.ReadableStream,
): Promise<any> {
  if (!readStream) {
    throw new Error('Read stream missing')
  }

  const token = await fetchToken(options)

  return got
    .put(uploadExistingURI(options.extensionId), {
      headers: createHeaders(token),
      body: readStream,
    })
    .json()
}

export async function publish(
  options: APIClientOptions,
  target = 'default',
): Promise<any> {
  const token = await fetchToken(options)

  return got
    .post(publishURI(options.extensionId, target), {
      headers: createHeaders(token),
    })
    .json()
}

export async function get(
  options: APIClientOptions,
  projection = 'DRAFT',
): Promise<any> {
  const token = await fetchToken(options)

  return got
    .get(getURI(options.extensionId, projection), {
      headers: createHeaders(token),
    })
    .json()
}

// - - - - - - - - - - - - - - -

/*
type User = {
  name: string
  age: number
  yes: boolean
}
export function run(user: User) {
  console.log('me is:', user)
}

const me: User = {
  name: 'My Self',
  age: 21,
  yes: true,
}

run(me)

// TO diddly DO: move to @bedframe/core
enum GitProvider {
  GITHUB = 'github',
  BITBUCKET = 'bitbucket',
  GITLAB = 'gitlab',
}

type RepoBugs = {
  url: string
  email?: string // TO diddly DO: type as email
}

type Git = {
  provider: GitProvider
  type: 'git'
  url: string
  directory?: string
  bugs: RepoBugs
}

const repository = {
  provider: 'github',
  type: 'git',
  url: 'https://github.com/nyaggah/bedframe.git',
  directory: 'packages/package',
  bugs: {
    url: 'https://github.com/nyaggah/bedframe/issues',
    email: 'joe@bedframe.dev',
  },
}

*/
