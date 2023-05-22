/* eslint camelcase: 0 */
import {
  createManifestIcons,
  createManifestRequiredFields,
} from '@beframe/core'
import pkg from '../../package.json'

export const icons = createManifestIcons({
  16: 'icons/icon-16x16.png',
  32: 'icons/icon-32x32.png',
  48: 'icons/icon-48x48.png',
  128: 'icons/icon-128x128.png',
})

export const shared = createManifestRequiredFields({
  name: pkg.name, // required
  version: pkg.version, // required
  manifest_version: 3, // required
})
