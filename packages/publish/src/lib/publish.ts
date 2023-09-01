export const d = {}
// import chromeWebstoreUpload from 'chrome-webstore-upload'
// import dotenv from 'dotenv'
// import fs from 'fs'
// import got from 'got'
// import { createPublishConfig } from './utils'

// dotenv.config()

// /*
//   TO diddly DO: should be able to pass in:
//   - config: from env vars
//   - action: create { autopublish ? } | upload { new | update } | publish { new | update }
//             - visibility: 'public' | 'unlisted' | 'private'
//               - private:
//                 - target: 'default' | 'trustedtests'
// */

// const config = createPublishConfig({
//   env: {
//     extensionId: 'process.env.EXTENSION_ID',
//     clientId: 'process.env.CLIENT_ID',
//     clientSecret: 'process.env.CLIENT_SECRET',
//     refreshToken: 'process.env.REFRESH_TOKEN',
//   },
//   action: {
//     create: {
//       visibility: 'private',
//       target: 'trustedTesters',
//       exists: false,
//       autopublish: true,
//     },
//     update: {
//       visibility: 'private',
//       target: 'trustedTesters',
//       exists: true,
//       autopublish: true,
//     },
//     publish: {
//       visibility: 'private',
//       target: 'trustedTesters',
//       exists: false,
//       autopublish: true,
//     },
//   },
// })
// /*
//   ^^^ with the above we should be able to pass in args e.g.

//   const config = createPublishConfig(_config)
//   const {env, action: { create } } = config

//   export default function publish(env, create) {
//     // switch / case based on args ^^^
//     // create, update, or publish
//     // TO diddly DO: maybe account for each browser being dev'd for ??
//   }

// */

// // const config: EnvConfig = {
// //   extensionId: process.env.EXTENSION_ID,
// //   clientId: process.env.CLIENT_ID,
// //   clientSecret: process.env.CLIENT_SECRET,
// //   refreshToken: process.env.REFRESH_TOKEN,
// // }

// const { env, action } = config

// const store = chromeWebstoreUpload(env)

// function upload(update: boolean = false, target = 'trustedTesters') {
//   try {
//     store.fetchToken().then((token: any) => {
//       console.log({ token })
//       if (!update) {
//         console.log('\n[ P U B L I S H ] : target :', target + '\n')

//         store.publish(target, token).then((response: any) => {
//           console.log('after [P U B L I S H] response...', response)
//           console.log(JSON.stringify({ response }, null, 2))
//           // Response is a Resource Representation
//           // https://developer.chrome.com/webstore/webstore_api/items#resource
//         })
//       } else {
//         console.log('[ U P D A T E ] : updating existing extension...')
//         // might wanna get()... then create and upload
//         console.log('creating stream from zip...')
//         const zip = fs.createReadStream('./dist/picchat.ai-chrome.zip')

//         store.uploadExisting(zip, token).then((res: any) => {
//           console.log('after [ U P D A T E ] response...')
//           console.log(JSON.stringify({ res }, null, 2))
//           // Response is a Resource Representation
//           // https://developer.chrome.com/webstore/webstore_api/items#resource
//         })
//       }
//     })
//   } catch (error) {
//     console.error(error)
//   }
// }

// async function create(token: string, zip: any) {
//   try {
//     const _headers = (token: string) => {
//       return {
//         Authorization: `Bearer ${token}`,
//         'x-goog-api-version': '2',
//       }
//     }

//     return got
//       .post('https://www.googleapis.com/upload/chromewebstore/v1.1/items', {
//         // headers: _headers(await token), // 'await' has no effect on the type of this expression.ts(80007)
//         headers: _headers(token),
//         body: zip,
//       })
//       .then((response) => {
//         if (response.statusCode === 200) {
//           console.log('response.statusCode', response.statusCode)
//           console.log('id', response.statusCode)
//         }
//         console.log('{ response } :')
//         console.log({ response })
//         return response
//       })
//   } catch (error) {
//     console.error(error)
//   }
// }

// async function publish() {
//   store.fetchToken().then(async (token: string) => {
//     console.log({ token })
//     const _headers = (token: string) => {
//       return {
//         Authorization: `Bearer ${token}`,
//         'x-goog-api-version': '2',
//         // 'Content-Length': '0',
//       }
//     }

//     await got
//       .post(
//         `https://www.googleapis.com/chromewebstore/v1.1/items/${env.extensionId}/publish`,
//         {
//           headers: _headers(await token),
//         },
//       )
//       .then((response) => {
//         console.log({ response })
//       })
//       .catch(console.error)
//   })
// }

// const run = {
//   create: () => {
//     const zip = fs.createReadStream('./dist/picchat.ai-chrome.zip')
//     store
//       .fetchToken()

//       .then((token: any) => {
//         create(token, zip)
//       })
//       .catch(console.error)
//   },
//   update: () => {
//     upload(true)
//   },
//   publish: () => publish(),
// }

// run.update()
