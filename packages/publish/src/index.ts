import chromeWebstoreUpload from 'chrome-webstore-upload'
import fs from 'node:fs'
import { PublishConfig, createPublishConfig } from './lib'

/*

  aaaactuaaalllyyy...
  move publish to @bedframe/cli
  bedframe includes the MVP after all
  
  should allow in package.json:
  "bedframe:version": "bedframe version",

  
  >_ 
  B E D F R A M E
  
  —- the M V P of B E D

  M A K E
  V E R S I O N
  P U B L I S H
  — - - - - - -
  B R O W S E R 
  E X T E N S I O N 
  D E V E L O P M E N T
  F R A M E W O R K
  
*/

export default function publish(publishConfig: PublishConfig) {
  const config = createPublishConfig(publishConfig)
  const { env, action } = config
  const store = chromeWebstoreUpload(env)

  const createExtension = () => {}
  const updateExtension = () => {}
  const publishExtension = () => {}

  const run = {
    create: () => {
      const zip = fs.createReadStream('./dist/picchat.ai-chrome.zip')
      store
        .fetchToken()
        .then((token: any) => {
          create(token, zip)
        })
        .catch(console.error)
    },
    update: () => {
      upload(true)
    },
    publish: () => 'publish()',
  }
}
